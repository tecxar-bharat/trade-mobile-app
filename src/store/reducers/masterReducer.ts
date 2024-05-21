import {
  AnyAction,
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { IAdminNameList } from '@interfaces/index';
import accountService from '@services/account.service';
import commonService from '@services/common.service';
import { RootState } from '@store/index';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;

export const getMasters = createAsyncThunk(
  `master/get`,
  async (pageData: { page: number; rowPerPage: number; search: string }) => {
    const { data } = await accountService.getAccountList(
      pageData.page,
      pageData.rowPerPage,
      'master',
    );
    return data;
  },
);
export const exportMaster = createAsyncThunk(
  `master/export`,
  async (pageData: { exportData?: boolean }) => {
    const { data } = await accountService.exportAccountList(
      pageData.exportData,
      'master',
    );
    return data;
  },
);
export const getMasterNameList = createAsyncThunk(
  `master/getMasterList`,
  async (pageData: { userId?: number | null }) => {
    const { status, data } = await commonService.getMasterNameList(
      pageData.userId && pageData.userId,
    );
    return { status, data };
  },
);

export const deleteMaster = createAsyncThunk(
  `master/delete`,

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
  },
  // async (masterId: number, { dispatch }) => {
  //   try {
  //     const { data }: any = await accountService
  //       .deleteAccountById(masterId)
  //       .then((req) => {
  //         dispatch(getMasters({ page: 1, rowPerPage: 10, search: "" }));
  //       });
  //     return data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
);

interface IMAsterList {
  data: IAdminNameList[];
  count: number;
  fetchMoreLoading: boolean;
  page: number;
  rowPerPage: number;
  totalCount: number;
  loading: boolean;
}

interface State {
  loading: boolean;
  masterList: IMAsterList;
  allMasterNameList: IAdminNameList[];
  page: number;
  rowPerPage: number;
  search: string;
  totalCount: number;
  canNext: boolean;
  canPrev: boolean;
  totalPages: number;
}
const initialState: State = {
  masterList: {
    data: [],
    count: 0,
    fetchMoreLoading: false,
    page: 1,
    rowPerPage: 10,
    totalCount: 0,
    loading: false,
  },
  loading: false,
  allMasterNameList: [],
  page: 0,
  rowPerPage: 10,
  search: '',
  totalCount: 0,
  canNext: false,
  canPrev: false,
  totalPages: 0,
};

const isPendingAction = (action: AnyAction): action is PendingAction =>
  action.type.startsWith(masterSlice.name) && action.type.endsWith('/pending');
const isRejectedAction = (action: AnyAction): action is RejectedAction =>
  action.type.startsWith(masterSlice.name) && action.type.endsWith('/rejected');

const masterSlice = createSlice({
  name: 'master',
  initialState,
  reducers: {
    updatePage: (state: State, action: PayloadAction<number>) => {
      return { ...state, page: action.payload };
    },
    masterPage: (state: State, action: PayloadAction<number>) => {
      state.masterList.page = action.payload;
    },
    updateRowPerPage: (state: State, action: PayloadAction<number>) => {
      return { ...state, rowPerPage: action.payload };
    },
    updateSearch: (state: State, action: PayloadAction<string>) => {
      return { ...state, search: action.payload, page: initialState.page };
    },
    clearMasterList: (state: State) => {
      return { ...state, allMasterNameList: [] };
    },

    setActiveMaster: (state: State, action: PayloadAction<any>) => {
      // const newAdminList = state.adminList;
      if (state.masterList.data && state.masterList.data.length > 0) {
        const newMasterList = JSON.parse(JSON.stringify(state.masterList));

        newMasterList.rows = newMasterList.rows.map((e: any) => {
          let isOnline = e.isOnline;
          if (action.payload && action.payload.id === e.id) {
            isOnline = action.payload.status;
          }
          return {
            ...e,
            isOnline,
          };
        });
        return {
          ...state,
          masterList: newMasterList,
        };
      } else {
        return {
          ...state,
        };
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getMasters.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          if (state.masterList.page === 1) {
            return {
              ...state,
              masterList: {
                ...state.masterList,
                loading: false,
                fetchMoreLoading: false,
                data: action.payload.data.rows,
                totalCount: action.payload.data.count,
              },
            };
          } else {
            return {
              ...state,
              masterList: {
                ...state.masterList,
                loading: false,
                fetchMoreLoading: false,
                data: [...state.masterList.data, ...action.payload.data.rows],
              },
            };
          }
        } else {
          return {
            ...state,
            loading: false,
            masterList: initialState.masterList,
          };
        }
      })
      .addCase(getMasterNameList.fulfilled, (state, action) => {
        if (
          action.payload.data.statusCode === 200 ||
          action.payload.data.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            allMasterNameList: action.payload.data.data.map(
              (e: IAdminNameList) => {
                return {
                  id: e.id,
                  name: `${e.name} ( ${e.user_id} )`,
                  min_brokerage: e.min_brokerage,
                  min_mcx_brokerage: e.min_mcx_brokerage,
                  partnership_percentage: e.partnership_percentage,
                };
              },
            ),
          };
        } else {
          return {
            ...state,
            loading: false,
            allMasterNameList: initialState.allMasterNameList,
          };
        }
      })
      .addCase(deleteMaster.fulfilled, (state, action) => {
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
      .addCase(exportMaster.fulfilled, state => {
        return { ...state, loading: false };
      })
      .addMatcher(isPendingAction, state => {
        state.loading = true;
      })
      .addMatcher(isRejectedAction, state => {
        state.loading = false;
      });
  },
});

export const masterReducer = masterSlice.reducer;

export const masterSelector = (state: RootState, name: string) =>
  state.master[name as keyof typeof state.master];
export const {
  updatePage,
  updateRowPerPage,
  updateSearch,
  setActiveMaster,
  clearMasterList,
  masterPage,
} = masterSlice.actions;
