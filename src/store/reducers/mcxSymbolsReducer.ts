import {
  AnyAction,
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import mcxSymbolsService from '@services/mcxSymbols.service';
import { RootState } from '@store/index';
import { IMcxSymbols } from '@interfaces/mcxSymbols.interface';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;

export const addMcxSymbol = createAsyncThunk(
  `AddMcxSymbol/create`,
  async (object: any) => {
    try {
      const { data } = await mcxSymbolsService.addMcxSymbol(object.payload);
      return {
        data,
        onSuccess: object.onSuccess2,
        onError: object.onError2,
      };
    } catch (error: any) {
      if (error?.response?.data?.message) {
        object.onError(error?.response?.data?.message);
      }
      throw error;
    }
  },
);

export const getMcxSymbols = createAsyncThunk(`mcxSymbols/get`, async () => {
  const { data } = await mcxSymbolsService.getMcxSymbols();
  return data;
});

export const getCurrentMcxSymbols = createAsyncThunk(
  `getCurrentMcxSymbols/get`,
  async () => {
    const { data } = await mcxSymbolsService.getCurrentMcxSymbols();
    return data;
  },
);

export const deleteMcxSymbolById = createAsyncThunk(
  `deleteMcxSymbolById/delete`,
  async (object: any) => {
    try {
      const res: any = await mcxSymbolsService.deleteMcxSymbolById(
        object.deleteId,
      );
      return {
        data: res.data,
        onSuccess: object.onSuccess2,
        onError: object.onError2,
      };
    } catch (error: any) {
      if (error?.response?.message) {
        object.onError(error?.response?.message);
      }
      throw error;
    }
  },
);

interface State {
  loading: boolean;
  mcxSymbolsList: IMcxSymbols[];

  mcxCurrentSymbolsList: any;
  mcxInstrumentIdentifier: string[];
}
const initialState: State = {
  mcxSymbolsList: [],
  loading: false,
  mcxCurrentSymbolsList: [],
  mcxInstrumentIdentifier: [],
};

const isPendingAction = (action: AnyAction): action is PendingAction =>
  action.type.startsWith(mcxSymbolsSlice.name) &&
  action.type.endsWith('/pending');
const isRejectedAction = (action: AnyAction): action is RejectedAction =>
  action.type.startsWith(mcxSymbolsSlice.name) &&
  action.type.endsWith('/rejected');

const mcxSymbolsSlice = createSlice({
  name: 'mcxSymbols',
  initialState,
  reducers: {
    mcxSubscribed: (state: State, action: PayloadAction<string>) => {
      const mcxCurrentSymbolsList = JSON.parse(
        JSON.stringify(state.mcxCurrentSymbolsList),
      );
      const existIndex = mcxCurrentSymbolsList.findIndex(
        (e: any) => e.identifier === action.payload,
      );
      if (existIndex > -1) {
        mcxCurrentSymbolsList[existIndex].subscribed = true;
      }
      return {
        ...state,
        mcxCurrentSymbolsList: mcxCurrentSymbolsList,
        // .filter((e: RealtimeResult) => e.identifier !== action.payload),
      };
    },
    resetInstrument: () => {
      return { ...initialState };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addMcxSymbol.fulfilled, (state, action) => {
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
      .addCase(getMcxSymbols.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            mcxSymbolsList: action.payload.data,
          };
        } else {
          return {
            ...state,
            loading: false,
            mcxSymbolsList: initialState.mcxSymbolsList,
          };
        }
      })
      .addCase(getCurrentMcxSymbols.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,

            mcxCurrentSymbolsList: action.payload.data.all.map((e: any) => {
              return {
                ...e,
                subscribed:
                  action.payload.data?.subscribed?.findIndex((ee: string) =>
                    ee.includes(e.identifier),
                  ) > -1,
              };
            }),

            mcxInstrumentIdentifier: action.payload.data.all.map((e: any) => {
              return e.identifier;
            }),
          };
        } else {
          return {
            ...state,
            loading: false,
            mcxCurrentSymbolsList: initialState.mcxCurrentSymbolsList,
          };
        }
      })
      .addCase(deleteMcxSymbolById.fulfilled, (state, action) => {
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
      .addMatcher(isPendingAction, state => {
        state.loading = true;
      })
      .addMatcher(isRejectedAction, state => {
        state.loading = false;
      });
  },
});

export const mcxSymbolsReducer = mcxSymbolsSlice.reducer;
export const mcxSymbolsSelector = (state: RootState, name: string) =>
  state.mcxSymbols[name as keyof typeof state.mcxSymbols];
export const { mcxSubscribed, resetInstrument } = mcxSymbolsSlice.actions;
