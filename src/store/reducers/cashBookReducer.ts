import {
  AnyAction,
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import cashBookService from '@services/cashBook.service';
import { RootState } from '@store/index';
import { ILedgerListRowCount } from '@interfaces/index';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;

export const createCashBook = createAsyncThunk(
  `cashBook/add`,
  async (object: any) => {
    try {
      const { data } = await cashBookService.createCashBook(object.payload);
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

export const getCashBookList = createAsyncThunk(
  `cashBook/get`,
  async (pageData: {
    page?: number;
    rowPerPage?: number;
    search?: string;
    userId?: number | null;
    entryType?: string;
  }) => {
    const { data } = await cashBookService.getCashBookList(
      pageData.page,
      pageData.rowPerPage,
      pageData.search,
      pageData.userId,
      pageData.entryType,
    );
    return data;
  },
);

export const getBalanceByUserId = createAsyncThunk(
  `cashBook/balance/get`,
  async (pageData: { userId: number; type: string }) => {
    const { data } = await cashBookService.getBalanceByUserId(
      pageData.userId,
      pageData.type,
    );
    return data;
  },
);

export const getAllUsersCashLedgers = createAsyncThunk(
  `cashBook/getAllUsersCashLedgers`,
  async (pageData: {
    userId?: number | null;
    page: number;
    rowPerPage: number;
    search?: string;
    entryType?: string;
  }) => {
    const { data }: any = await cashBookService.getAllUsersCashLedgers(
      pageData.userId,
      pageData.page,
      pageData.rowPerPage,
      pageData.search,
      pageData.entryType,
    );
    return data;
  },
);

interface State {
  loading: boolean;
  cashBookList: any;
  AllUsersCashLedgersList: ILedgerListRowCount;
  valanId: any;
  AdminId: number | null;
  MasterId: number | null;
  UserId: number | null;
  page: number;
  rowPerPage: number;
  search: string;
  balanceOfUser: number;
  balanceOfCreditUser: number;
  balanceOfDebitUser: number;
}
const initialState: State = {
  cashBookList: [],
  valanId: undefined,
  AllUsersCashLedgersList: {
    data: [],
    count: 0,
    fetchMoreLoading: false,
    page: 1,
    rowPerPage: 10,
    totalCount: 0,
    loading: false,
  },
  AdminId: 0,
  balanceOfUser: 0,
  balanceOfCreditUser: 0,
  balanceOfDebitUser: 0,
  MasterId: 0,
  UserId: 0,
  page: 0,
  rowPerPage: 10,
  search: '',
  loading: false,
};

const isPendingAction = (action: AnyAction): action is PendingAction =>
  action.type.startsWith(cashBookSlice.name) &&
  action.type.endsWith('/pending');
const isRejectedAction = (action: AnyAction): action is RejectedAction =>
  action.type.startsWith(cashBookSlice.name) &&
  action.type.endsWith('/rejected');

const cashBookSlice = createSlice({
  name: 'cashBook',
  initialState,
  reducers: {
    setAdminId: (state: State, action: PayloadAction<number>) => {
      return {
        ...state,
        AdminId: action.payload,
        MasterId: null,
        UserId: null,
        rowPerPage: initialState.rowPerPage,
        page: initialState.page,
        search: initialState.search,
      };
    },
    setMasterId: (state: State, action: PayloadAction<number>) => {
      return {
        ...state,
        MasterId: action.payload,
        UserId: null,
        rowPerPage: initialState.rowPerPage,
        page: initialState.page,
        search: initialState.search,
      };
    },
    setUserId: (state: State, action: PayloadAction<number>) => {
      return {
        ...state,
        UserId: action.payload,
        page: initialState.page,
        rowPerPage: initialState.rowPerPage,
        search: initialState.search,
      };
    },
    flushState: (state: State) => {
      return {
        ...state,
        cashBookList: initialState.cashBookList,
        AdminId: 0,
        MasterId: null,
        UserId: null,
      };
    },
    updatePage: (state: State, action: PayloadAction<number>) => {
      {
        state.AllUsersCashLedgersList.page = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createCashBook.fulfilled, (state, action) => {
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
      .addCase(getCashBookList.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            cashBookList: action.payload.data,
          };
        } else {
          return {
            ...state,
            loading: false,
            cashBookList: initialState.cashBookList,
          };
        }
      })
      .addCase(getBalanceByUserId.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            balanceOfUser: action.payload.data,
            balanceOfCreditUser: action.payload.data,
            balanceOfDebitUser: action.payload.data,
          };
        } else {
          return {
            ...state,
            loading: false,
            balanceOfUser: initialState.balanceOfUser,
            balanceOfCreditUser: initialState.balanceOfCreditUser,
            balanceOfDebitUser: initialState.balanceOfDebitUser,
          };
        }
      })
      .addCase(getAllUsersCashLedgers.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          let totalM2m = 0;
          action.payload.data.rows.forEach((element: any) => {
            totalM2m = totalM2m + element.balance;
          });
          if (state.AllUsersCashLedgersList.page === 1) {
            if (action.payload.data.rows.length > 0) {
              action.payload.data.rows.push({
                balance: totalM2m,
                user: { name: 'Total Balance : ' },
                isExtraRow: true,
              });
            }
            return {
              ...state,
              AllUsersCashLedgersList: {
                ...state.AllUsersCashLedgersList,
                loading: false,
                fetchMoreLoading: false,
                data: action.payload.data.rows,
                totalCount: action.payload.data.count,
              },
            };
          } else {
            return {
              ...state,
              AllUsersCashLedgersList: {
                ...state.AllUsersCashLedgersList,
                loading: false,
                fetchMoreLoading: false,
                data: [
                  ...state.AllUsersCashLedgersList.data,
                  ...action.payload.data.rows,
                ],
              },
            };
          }
        } else {
          return {
            ...state,
            loading: false,
            AllUsersCashLedgersList: initialState.AllUsersCashLedgersList,
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

export const cashBookReducer = cashBookSlice.reducer;
export const cashBookSelector = (state: RootState, name: string) =>
  state.cashBook[name as keyof typeof state.cashBook];
export const { setAdminId, setMasterId, setUserId, flushState, updatePage } =
  cashBookSlice.actions;
