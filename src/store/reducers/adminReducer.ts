import {
  AnyAction,
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { IAdminNameList } from '@interfaces/index';
import { IAdminAccountRowCount } from '@interfaces/account.interface';
import accountService from '@services/account.service';
import commonService from '@services/common.service';
import { RootState } from '@store/index';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;

export const getAdmin = createAsyncThunk(
  `admin/get`,
  async (pageData: { page: number; rowPerPage: number; search: string }) => {
    const { data } = await accountService.getAccountListAdmin(
      pageData.page,
      pageData.rowPerPage,
      pageData.search,
      null,
      'admin',
    );
    return data;
  },
);
export const exportAdmin = createAsyncThunk(
  `admin/export`,
  async (pageData: { exportData?: boolean }) => {
    const { data } = await accountService.exportAccountList(
      pageData.exportData,
      'admin',
    );
    return data;
  },
);

export const getAdminNameList = createAsyncThunk(
  `admin/getAdminName`,
  async () => {
    const { status, data } = await commonService.getAdminNameList();
    return { status, data };
  },
);

export const deleteAdmin = createAsyncThunk(
  `admin/delete`,
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
);

interface State {
  loading: boolean;
  adminList: IAdminAccountRowCount;
  allAdminNameList: IAdminNameList[];
}
const initialState: State = {
  adminList: {
    data: [],
    count: 0,
    fetchMoreLoading: false,
    page: 1,
    rowPerPage: 10,
    totalCount: 0,
    loading: false,
  },
  loading: false,
  allAdminNameList: [],
};

const isPendingAction = (action: AnyAction): action is PendingAction =>
  action.type.startsWith(adminSlice.name) && action.type.endsWith('/pending');
const isRejectedAction = (action: AnyAction): action is RejectedAction =>
  action.type.startsWith(adminSlice.name) && action.type.endsWith('/rejected');

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setActiveAdmin: (state: State, action: PayloadAction<any>) => {
      // const newAdminList = state.adminList;
      if (state.adminList.rows && state.adminList.rows.length > 0) {
        const newAdminList = JSON.parse(JSON.stringify(state.adminList));

        newAdminList.rows = newAdminList.rows.map((e: any) => {
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
          adminList: newAdminList,
        };
      } else {
        return {
          ...state,
        };
      }
    },
    adminPage: (state: State, action: PayloadAction<number>) => {
      {
        state.adminList.page = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAdmin.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        )
          if (state.adminList.page === 1) {
            return {
              ...state,
              adminList: {
                ...state.adminList,
                loading: false,
                fetchMoreLoading: false,
                data: action.payload.data.rows,
                totalCount: action.payload.data.count,
              },
            };
          } else {
            return {
              ...state,
              adminList: {
                ...state.adminList,
                loading: false,
                fetchMoreLoading: false,
                data: [
                  ...state.adminList.data,
                  ...action.payload.data.rows,
                ],
              },
            };
          }
      })
      .addCase(getAdminNameList.fulfilled, (state, action) => {
        if (
          action.payload.data.statusCode === 200 ||
          action.payload.data.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            allAdminNameList: action.payload.data.data.map(
              (e: IAdminNameList) => {
                return {
                  id: e.id,
                  name: `${e.name} ( ${e.user_id} )`,
                  max_users: e.max_users,
                  manual_trade: e.manual_trade,
                  edit_trade: e.edit_trade,
                  delete_trade: e.delete_trade,
                };
              },
            ),
          };
        } else {
          return {
            ...state,
            loading: false,
            allAdminNameList: initialState.allAdminNameList,
          };
        }
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
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
      .addCase(exportAdmin.fulfilled, state => {
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

export const adminReducer = adminSlice.reducer;
export const adminSelector = (state: RootState, name: string) =>
  state.admin[name as keyof typeof state.admin];
export const { setActiveAdmin, adminPage } = adminSlice.actions;
