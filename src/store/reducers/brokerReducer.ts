import {
  AnyAction,
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { IAdminNameList } from "@interfaces/index";
import { IAdminAccountRowCount } from "@interfaces/account.interface";
import accountService from "@services/account.service";
import { RootState } from "@store/index";
import brokerService from "@services/broker.service";
import commonService from "@services/common.service";

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;

export const createBrokerUsers = createAsyncThunk(
  `broker/addUsers`,
  async (object: any) => {
    try {
      const { data } = await brokerService.createBrokerUsers(object.payload);
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
  }
);

export const getBroker = createAsyncThunk(
  `broker/get`,
  async (pageData: { page: number; rowPerPage: number; search: string }) => {
    const { data } = await accountService.getBrokerAccountList(
      pageData.page,
      pageData.rowPerPage,
      pageData.search,
      "broker"
    );
    return data;
  }
);

export const getUserBrokerNameList = createAsyncThunk(
  `broker/getBrokerUserName`,
  async (pageData: { userId?: number | null }) => {
    const { status, data } = await commonService.getUserBrokerNameList(
      pageData.userId && pageData.userId
    );
    return { status, data };
  }
);

export const deleteBroker = createAsyncThunk(
  `broker/delete`,
  async (object: any) => {
    try {
      const res: any = await accountService.deleteAccountById(object.deleteId);
      return {
        data: res.data,
        onSuccess: object.onSuccess,
        onError: object.onError,
      };
    } catch (error: any) {
      if (error?.response?.message) {
        object.onError(error?.response?.message);
      }
      throw error;
    }
  }
);

interface State {
  loading: boolean;
  brokerList: IAdminAccountRowCount;
  allUserBrokerNameList: IAdminNameList[];
}
const initialState: State = {
  brokerList: {
    data: [],
    count: 0,
    fetchMoreLoading: false,
    page: 1,
    rowPerPage: 10,
    totalCount: 0,
    loading: false,
  },
  loading: false,
  allUserBrokerNameList: [],
};

const isPendingAction = (action: AnyAction): action is PendingAction =>
  action.type.startsWith(brokerSlice.name) && action.type.endsWith("/pending");
const isRejectedAction = (action: AnyAction): action is RejectedAction =>
  action.type.startsWith(brokerSlice.name) && action.type.endsWith("/rejected");

const brokerSlice = createSlice({
  name: "broker",
  initialState,
  reducers: {
    clearUserList: (state: State) => {
      return { ...state, allUserBrokerNameList: [] };
    },
    userPage: (state: State, action: PayloadAction<number>) => {
      state.brokerList.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBrokerUsers.fulfilled, (state, action) => {
        if (
          action.payload.data.statusCode === 200 ||
          action.payload.data.statusCode === 201
        ) {
          action.payload.onSuccess(action.payload.data.message);
          return { ...state, loading: false };
        } else {
          action.payload.onError(action.payload.data.message);
          return { ...state, loading: false };
        }
      })
      .addCase(getBroker.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          if (state.brokerList.page === 1) {
            return {
              ...state,
              brokerList: {
                ...state.brokerList,
                loading: false,
                fetchMoreLoading: false,
                data: action.payload.data.rows,
                totalCount: action.payload.data.count,
              },
            };
          } else {
            return {
              ...state,
              brokerList: {
                ...state.brokerList,
                loading: false,
                fetchMoreLoading: false,
                data: [...state.brokerList.data, ...action.payload.data.rows],
              },
            };
          }
        } else {
          return {
            ...state,
            loading: false,
            brokerList: initialState.brokerList,
          };
        }
      })
      .addCase(getUserBrokerNameList.fulfilled, (state, action) => {
        if (
          action.payload.data.statusCode === 200 ||
          action.payload.data.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            allUserBrokerNameList: action.payload.data.data.map(
              (e: IAdminNameList) => {
                return {
                  id: e.id,
                  name: `${e.name} ( ${e.user_id} )`,
                  role: e.role.slug,
                };
              }
            ),
          };
        } else {
          return {
            ...state,
            loading: false,
            allUserBrokerNameList: initialState.allUserBrokerNameList,
          };
        }
      })
      .addCase(deleteBroker.fulfilled, (state, action) => {
        if (
          action.payload.data.statusCode === 200 ||
          action.payload.data.statusCode === 201
        ) {
          action.payload.onSuccess(action.payload.data.message);
          return { ...state, loading: false };
        } else {
          action.payload.onError(action.payload.data.message);
          return { ...state, loading: false };
        }
      })
      .addMatcher(isPendingAction, (state) => {
        state.loading = true;
      })
      .addMatcher(isRejectedAction, (state) => {
        state.loading = false;
      });
  },
});

export const brokerReducer = brokerSlice.reducer;
export const brokerSelector = (state: RootState, name: string) =>
  state.broker[name as keyof typeof state.broker];

export const { clearUserList, userPage } = brokerSlice.actions;
