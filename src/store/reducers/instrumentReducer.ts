import { IWatchScripts } from '@interfaces/index';
import {
  AnyAction,
  AsyncThunk,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import instrumentService from '@services/instrument.service';
import { RootState } from '@store/index';
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;

export const getWatchListScripts = createAsyncThunk(
  `instrument/getWatchListScripts`,
  async (payload: { segmentId: number; expiry: string }) => {
    try {
      const { status, data } = await instrumentService.getWatchListScripts(
        payload.segmentId,
        payload.expiry,
      );
      return { status, data };
    } catch (error) {
      console.log('ERR', error);
      throw error;
    }
  },
);

// export const getIdentifier = createAsyncThunk(
//   `instrument/getIdentifier`,
//   async (payload: { segmentId: number; scriptId: number; expiry: string }) => {
//     try {
//       const { status, data } = await instrumentService.getIdentifier(
//         payload.segmentId,
//         payload.scriptId,
//         payload.expiry
//       );
//       return { status, data };
//     } catch (error) {
//       throw error;
//     }
//   }
// );

interface State {
  loading: boolean;
  expiryDates: [];
  strikePrices: [];
  watchListScripts: [];
  watchListSubscribedScripts: [];
  // identifier: IIdentifier;
}
const initialState: State = {
  loading: false,
  expiryDates: [],
  strikePrices: [],
  watchListScripts: [],
  watchListSubscribedScripts: [],
  // identifier: {
  //   id: 0,
  //   identifier: "",
  //   tradeSymbol: "",
  // },
};

const isPendingAction = (action: AnyAction): action is PendingAction =>
  action.type.startsWith(instrumentSlice.name) &&
  action.type.endsWith('/pending');
const isRejectedAction = (action: AnyAction): action is RejectedAction =>
  action.type.startsWith(instrumentSlice.name) &&
  action.type.endsWith('/rejected');

const instrumentSlice = createSlice({
  name: 'instrument',
  initialState,
  reducers: {
    resetInstrument: () => {
      return { ...initialState };
    },
  },
  extraReducers: builder => {
    builder

      .addCase(getWatchListScripts.fulfilled, (state, action) => {
        if (action.payload?.data?.statusCode === 200) {
          return {
            ...state,
            loading: false,
            watchListScripts: action.payload.data.data.all.map(
              (e: IWatchScripts) => {
                let expiry: any = e.identifier.split('_');
                expiry = `${expiry[2]}`;
                return {
                  ...e,
                  name: e.script.name,
                  expiry: expiry,
                  subscribed:
                    action.payload.data.data?.subscribed?.findIndex(
                      (ee: string) => ee.includes(e.identifier),
                    ) > -1,
                };
              },
            ),
          };
        } else {
          return {
            ...state,
            loading: false,
            watchListScripts: initialState.watchListScripts,
          };
        }
      })

      .addMatcher(isPendingAction, state => {
        state.loading = true;
      })
      .addMatcher(isRejectedAction, state => {
        state.loading = false;
      });
  },
});

export const instrumentReducer = instrumentSlice.reducer;
export const instrumentSelector = (state: RootState, name: string) =>
  state.instrument[name as keyof typeof state.instrument];
export const { resetInstrument } = instrumentSlice.actions;
