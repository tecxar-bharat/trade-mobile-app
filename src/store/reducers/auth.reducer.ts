import { IChangePassword, IUser } from '@interfaces/user';
import { ILoggedUser, ItradeExecData } from '@interfaces/user.interface';
import {
  AnyAction,
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import authService from '@services/auth.service';
import { RootState } from '../index';
import { setAsyncStorageData } from '@utils/helpers';
import { LOGGED_IN } from '@common/constants';
import { clearMarketData, getAllSubscribedSymbols } from './marketReducer';
import { LoggedUser } from '@db/schemas/loggedUser.model';
import { socketActions } from './socketReducer';
import { resetInstrument } from './instrumentReducer';
import { resetLedger } from './ledgerReducer';
import { resetPosition } from './positionReducer';
import { resetUser } from './userReducer';
import CookieManager from '@react-native-cookies/cookies';
import config from '@config/index';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;

export const loginUser = createAsyncThunk(
  `auth/login`,
  async (object: any, { dispatch }) => {
    try {
      const res: any = await authService.login(object.payload);
      if (res && res.data && res.data.data) {
        const sessionCookie = res.headers['set-cookie']?.[0].split(';')[0];
        const sessionValue = sessionCookie.split('=')[1];
        const cookieRes = await CookieManager.set(config.socketUrl, {
          name: 'session',
          value: sessionValue,
        });
        console.log('CookieManager.set =>', cookieRes);
        await LoggedUser.create(
          {
            ...res.data.data,
            rememberMe: object.payload.rememberMe,
            alertSound: false,
            Cookie: sessionCookie,
            isCurrentLoggedIn: true,
            balance: 0,
          },
          globalThis.realm,
        );
        const { data: balance } = await authService.getBalanceByUserId();
        setAsyncStorageData(LOGGED_IN, true);
        await dispatch(getAllSubscribedSymbols());
        await LoggedUser.setUserProperty({ balance }, globalThis.realm);
        await LoggedUser.setAsCurrentUser(res.data.data.id, globalThis.realm);
        return {
          data: res.data,
          onSuccess: object.onSuccess,
          onError: object.onError,
        };
      } else {
        object.onError('Unauthorized');
        throw 'Unauthorized';
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        object.onError(error?.response?.data?.message);
      }
      throw error;
    }
  },
);

export const whoAmI = createAsyncThunk(`auth/whoAmI`, async () => {
  try {
    console.log('---------- in whoAmI');
    const res = await authService.whoAmI();
    console.log('---------- in whoAmI res', res);
    if (res) {
      const { data: balance } = await authService.getBalanceByUserId();
      const { status, data } = res;

      console.log('----------data', data);

      LoggedUser.setUserProperty({ ...data, balance }, globalThis.realm);
      return { status, data };
    }
    return {};
  } catch (error) {
    throw error;
  }
});

export const logout = createAsyncThunk(`auth/logout`, async () => {
  try {
    const { data } = await authService.logout();
    return data;
  } catch (error) {
    throw error;
  }
});
export const changePassword = createAsyncThunk(
  `auth/changePassword`,
  async (object: any) => {
    try {
      const { data } = await authService.changePassword(object.payload);
      return {
        data,
        onSuccess: object.onSuccess,
        onError: object.onError,
      };
    } catch (error: any) {
      if (error?.response?.data?.message) {
        object.onError(error?.response?.data?.message);
      }
      throw error;
    }
  },
);
export const logOutFromApi = createAsyncThunk(
  `auth/logOutFromApi`,
  async (object: any, { dispatch }) => {
    try {
      dispatch(socketActions.disconnect());
      dispatch(resetInstrument());
      dispatch(resetLedger());
      dispatch(clearMarketData());
      dispatch(resetPosition());
      dispatch(resetUser());
      return true;
    } catch (error: any) {
      throw error;
    }
  },
);

export const getAvailableBalance = createAsyncThunk(
  `user/balancebyUserId`,
  async () => {
    try {
      const { data } = await authService.getBalanceByUserId();
      await LoggedUser.setUserProperty(
        {
          balance: data,
        },
        globalThis.realm,
      );
      return data;
    } catch (error) {
      console.log('------error', error);
      throw error;
    }
  },
);

interface INewUser {
  userId: string;
  password: string;
  type: 'Broker' | 'Admin' | 'Master' | 'User';
}

interface State {
  userData: IUser | ILoggedUser | null;
  loading: boolean;
  sessionExpired: boolean;
  deviceToken: string;
  tradeExecData: ItradeExecData | null;
  defaultEmail: string;
  defaultPassword: string;
}
const initialState: State = {
  userData: null,
  loading: false,
  sessionExpired: false,
  deviceToken: '',
  tradeExecData: null,
  defaultEmail: '',
  defaultPassword: '',
};

const isPendingAction = (action: AnyAction): action is PendingAction =>
  action.type.startsWith(authSlice.name) && action.type.endsWith('/pending');
const isRejectedAction = (action: AnyAction): action is RejectedAction =>
  action.type.startsWith(authSlice.name) && action.type.endsWith('/rejected');

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setDeviceToken: (state: State, action: PayloadAction<string>) => {
      return { ...state, deviceToken: action.payload };
    },
    updateUserData: (
      state: State,
      action: PayloadAction<IUser | ILoggedUser>,
    ) => {
      state.userData = action.payload;
      return state;
    },
    tradeExecuted: (
      state: State,
      action: PayloadAction<ItradeExecData | null>,
    ) => {
      state.tradeExecData = action.payload;
      return state;
    },
    setDefaultEmailPassword: (state: State, action: PayloadAction<any>) => {
      state.defaultEmail = action.payload.userId;
      state.defaultPassword = action.payload.password;
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(loginUser.fulfilled, (state: State, action: any) => {
        if (action.payload.onSuccess) {
          action.payload.onSuccess(action.payload.data.message);
        }
        return {
          ...state,
          loading: false,
          isAuthenticated: true,
          sessionExpired: false,
          userData: action.payload.data.data,
        };
      })
      .addCase(whoAmI.fulfilled, (state: State, action: any) => {
        if (action.payload?.status === 200 || action.payload?.status === 201) {
          return {
            ...state,
            loading: false,
            userData: action.payload.data,
            isAuthenticated: true,
          };
        } else {
          return {
            ...state,
            loading: false,
            userData: initialState.userData,
          };
        }
      })
      .addCase(logOutFromApi.fulfilled, (state: State) => {
        return {
          ...initialState,
          userData: state.userData,
          defaultEmail: state.defaultEmail,
          defaultPassword: state.defaultPassword,
          sessionExpired: true,
        };
      })

      .addCase(logout.fulfilled, (state: State, action: any) => {
        if (
          action.payload?.statusCode === 200 ||
          action.payload?.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            isAuthenticated: false,
            userData: null,
          };
        } else {
          return {
            ...state,
            loading: false,
          };
        }
      })
      .addCase(changePassword.fulfilled, (state: State, action: any) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.statusCode === 201
        ) {
          action.payload.onSuccess(action.payload?.data?.message);
          const userData = state.userData;
          if (userData) {
            userData.changePasswordRequire = false;
          }
          return {
            ...state,
            loading: false,
            isLoggedIn: true,
            userData,
          };
        } else {
          action.payload.onError(action.payload.data.message);
          return {
            ...state,
            loading: false,
            isLoggedIn: false,
          };
        }
      })
      .addMatcher(isPendingAction, (state: State) => {
        return { ...state, loading: true };
      })
      .addMatcher(isRejectedAction, (state: State) => {
        state.loading = false;
      });
  },
});

export const authReducer = authSlice.reducer;
export const authSelector = (state: RootState, name: string) =>
  state.auth[name as keyof typeof state.auth];
export const {
  setDeviceToken,
  tradeExecuted,
  updateUserData,
  setDefaultEmailPassword,
} = authSlice.actions;
