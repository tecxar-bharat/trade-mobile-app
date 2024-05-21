import {
  AnyAction,
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { ITradeList } from '@interfaces/index';
import commonService from '@services/common.service';
import { RootState } from '@store/index';
import blockScriptsService from '@services/blockScripts.service';
import {
  IQuantityScript,
  IUserAccountRowCount,
} from '@interfaces/account.interface';
import { toNumber } from '@utils/constant';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;

export const getBlockedScripts = createAsyncThunk(
  `blockedScripts/getTradeList`,
  async (pageData: { page: number; rowPerPage: number }) => {
    try {
      const { data } = await commonService.getBlockScripts(
        pageData.page,
        pageData.rowPerPage,
      );
      return data;
    } catch (error) {
      throw error;
    }
  },
);
export const getBlockScriptsofUser = createAsyncThunk(
  `blockScripts/user/get`,
  async (pageData: { page: number; rowPerPage: number; userId?: number | null; scriptId?: number | null; segmentId?: number | null }) => {
    const { data } = await commonService.getBlockScriptsofUsers(
      pageData.page,
      pageData.rowPerPage,
      pageData.userId,
      pageData.scriptId,
      pageData.segmentId,
    );

    return data;
  },
);
export const createBlockScripts = createAsyncThunk(
  `blockScripts/add`,
  async (object: any) => {
    try {
      const { data } = await commonService.createBlockScripts(object.payload);
      return {
        data,
        onSuccess: object.onSuccess2,
        onError: object.onError2,
      };
    } catch (error: any) {
      if (error?.response?.data?.message) {
        object.onError2(error?.response?.data?.message);
      }
      throw error;
    }
  },
);
export const createBlockScriptGroup = createAsyncThunk(
  `createBlockScriptGroup/add`,
  async (object: any) => {
    try {
      const { data } = await blockScriptsService.createBlockScriptGroup(object.payload);
      return {
        data,
        onSuccess: object.onSuccess,
        onError: object.onError,
      };
    } catch (error: any) {
      if (error?.response?.data?.message) {
        object.onError(error?.response?.data?.message[0]);
      }
      throw error;
    }
  },
);
export const deleteBlockScript = createAsyncThunk(
  `tradeLogs/delete`,
  async (object: any) => {
    try {
      const res: any = await commonService.deleteBlockScriptById(object.deleteId);
      return {
        data: res.data,
        onSuccess: object.onSuccess2,
        onError: object.onError2,
      };

    } catch (error: any) {
      if (error?.response?.message) {
        object.onError2(error?.response?.message);
      }
      throw error;
    }
  },
);
export const getQuantityScriptsofUsers = createAsyncThunk(
  `quantityScripts/user/get`,
  async (pageData: { userId?: number | null; scriptId: number | null }) => {
    const { data } = await blockScriptsService.getQuantityScriptsofUsers(pageData.userId, pageData.scriptId);
    return data;
  },
);
export const updateBlockScriptsGroupById = createAsyncThunk(
  `blockScriptsModule/update`,
  async (object: any) => {
    const id = toNumber(object.payload.id);
    const { data } = await blockScriptsService.updateBlockScriptsGroupById(id, object.payload);
    return { data, onSuccess: object.onSuccess, onError: object.onError };
  },
);
export const deleteBlockScriptsGroupById = createAsyncThunk(
  `blockScriptsModule/delete`,
  async (object: any) => {
    try {
      const res: any = await blockScriptsService.deleteBlockScriptsGroupById(object.deleteId);
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
export const getBlockScriptsGroupDropDown = createAsyncThunk(
  `blockScripts/getDropDownValues`,
  async (pageData: {
    page?: number;
    rowPerPage?: number;
    parentId?: number;
    groupType?: string;
  }) => {
    const { data } = await blockScriptsService.getBlockScriptsGroupDropDown(
      pageData.page,
      pageData.rowPerPage,
      pageData.parentId,
      pageData.groupType,
    );
    return data;
  },
);
export const getQuantityScriptsGroupDropDown = createAsyncThunk(
  `blockScripts/quantity/getDropDownValues`,
  async (pageData: {
    page?: number;
    rowPerPage?: number;
    parentId?: number;
    groupType?: string;
  }) => {
    const { data } = await blockScriptsService.getBlockScriptsGroupDropDown(
      pageData.page,
      pageData.rowPerPage,
      pageData.parentId,
      pageData.groupType,
    );
    return data;
  },
);
export const getTradeLogs = createAsyncThunk(
  `blockScripts/tradeLogs/get`,
  async (pageData: {
    userId?: number;
    startDate?: string;
    endDate?: string;
    page?: number;
    rowPerPage?: number;
  }) => {
    const { data } = await blockScriptsService.getTradeLogs(
      pageData.userId,
      pageData.startDate,
      pageData.endDate,
      pageData.page,
      pageData.rowPerPage,
    );
    return data;
  },
);
export const getQuantityScriptsDataByGroupId = createAsyncThunk(
  `quantityScriptsData/get`,
  async (groupId: number) => {
    const { data } = await blockScriptsService.getQuantityScriptsDataByGroupId(
      groupId,
    );
    return data;
  },
);
export const getBlockScriptsGroup = createAsyncThunk(
  `blockScripts/get`,
  async (pageData: { page?: number; rowPerPage?: number; groupType?: string }) => {
    const { data } = await blockScriptsService.getBlockScriptsGroup(pageData.page, pageData.rowPerPage, pageData.groupType);
    return data;
  },
);

interface State {
  loading: boolean;
  fetchMoreLoading: boolean;
  data: ITradeList[];
  page: number;
  rowPerPage: number;
  totalCount: number;
  quantityScriptsofUserList: any;
  blockScriptsGroupListDropDown: [];
  blockScriptsGroupList: IUserAccountRowCount;
  quantityScriptsGroupListDropDown: [];
  quantityScriptsData: IQuantityScript;
  blockScriptsofUserList: IUserAccountRowCount;
  TradeLogsList: IUserAccountRowCount;
}
const initialState: State = {
  loading: true,
  fetchMoreLoading: false,
  data: [],
  page: 1,
  rowPerPage: 20,
  totalCount: 0,
  quantityScriptsofUserList: [],
  blockScriptsGroupListDropDown: [],
  quantityScriptsGroupListDropDown: [],
  quantityScriptsData: {
    id: 0,
    name: '',
    qtyScripts: [],
  },
  TradeLogsList: {
    data: [],
    count: 0,
    fetchMoreLoading: false,
    page: 1,
    rowPerPage: 10,
    totalCount: 0,
    loading: false,
  },
  blockScriptsofUserList: {
    data: [],
    count: 0,
    fetchMoreLoading: false,
    page: 1,
    rowPerPage: 10,
    totalCount: 0,
    loading: false,
  },
  blockScriptsGroupList: {
    data: [],
    count: 0,
    fetchMoreLoading: false,
    page: 1,
    rowPerPage: 10,
    totalCount: 0,
    loading: false,
  },
};

const isPendingAction = (action: AnyAction): action is PendingAction =>
  action.type.startsWith(blockedScriptsSlice.name) &&
  action.type.endsWith('/pending');
const isRejectedAction = (action: AnyAction): action is RejectedAction =>
  action.type.startsWith(blockedScriptsSlice.name) &&
  action.type.endsWith('/rejected');

const blockedScriptsSlice = createSlice({
  name: 'blockedScripts',
  initialState,
  reducers: {
    updatePage: (state: State, action: PayloadAction<number>) => {
      return { ...state, page: action.payload };
    },
    updateRowPerPage: (state: State, action: PayloadAction<number>) => {
      return { ...state, rowPerPage: action.payload };
    },
    tradePage: (state: State, action: PayloadAction<number>) => {
      {
        state.TradeLogsList.page = action.payload;
      }
    },
    blockPage: (state: State, action: PayloadAction<number>) => {
      {
        state.blockScriptsGroupList.page = action.payload;
      }
    },
    blockUnblock: (state: State, action: PayloadAction<number>) => {
      {
        state.blockScriptsofUserList.page = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getBlockedScripts.fulfilled, (state, action) => {
        if (
          action.payload?.statusCode === 200 ||
          action.payload?.statusCode === 201
        ) {
          if (state.page === 1) {
            return {
              ...state,
              loading: false,
              totalCount: action.payload.data.count,
              data: action.payload.data.rows,
            };
          } else {
            return {
              ...state,
              loading: false,
              data: [...state.data, ...action.payload.data.rows],
            };
          }
        } else {
          return {
            ...state,
            loading: false,
            data: initialState.data,
          };
        }
      })
      .addCase(getBlockScriptsofUser.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          if (state.blockScriptsofUserList.page === 1) {
            return {
              ...state,
              blockScriptsofUserList: {
                ...state.blockScriptsofUserList,
                loading: false,
                fetchMoreLoading: false,
                data: action.payload.data.rows,
                totalCount: action.payload.data.count,
              },
            };
          } else {
            return {
              ...state,
              blockScriptsofUserList: {
                ...state.blockScriptsofUserList,
                loading: false,
                fetchMoreLoading: false,
                data: [
                  ...state.blockScriptsofUserList.data,
                  ...action.payload.data.rows,
                ],
              },
            };
          }
        } else {
          return {
            ...state,
            loading: false,
            blockScriptsofUserList: initialState.blockScriptsofUserList,
          };
        }
      })
      .addCase(getBlockedScripts.pending, (state, action: any) => {
        if (action.meta.arg.page === 1) {
          return { ...state, loading: true };
        } else {
          return { ...state, fetchMoreLoading: true };
        }
      })
      .addCase(createBlockScripts.fulfilled, (state, action) => {
        if (action.payload.data.statusCode === 200 || action.payload.data.statusCode === 201) {
          action.payload.onSuccess(action.payload.data.message);
          return { ...state, loading: false };
        } else {
          action.payload.onError(action.payload.data.message);
          return { ...state, loading: false };
        }
      })
      .addCase(createBlockScriptGroup.fulfilled, (state, action) => {
        if (action.payload.data.statusCode === 200 || action.payload.data.statusCode === 201) {
          action.payload.onSuccess(action.payload.data.message);
          return { ...state, loading: false };
        } else {
          action.payload.onError(action.payload.data.message);
          return { ...state, loading: false };
        }
      })
      .addCase(updateBlockScriptsGroupById.fulfilled, (state, action) => {
        if (action.payload.data.statusCode === 200 || action.payload.data.statusCode === 201) {
          action.payload.onSuccess(action.payload.data.message);
          return { ...state, loading: false };
        } else {
          action.payload.onError(action.payload.data.message);
          return { ...state, loading: false };
        }
      })
      .addCase(deleteBlockScript.fulfilled, (state, action) => {
        if (action.payload.data.statusCode === 200 || action.payload.data.statusCode === 201) {
          action.payload.onSuccess(action.payload.data.message);
          return { ...state, loading: false };
        } else {
          action.payload.onError(action.payload.data.message);
          return { ...state, loading: false };
        }
      })
      .addCase(getQuantityScriptsofUsers.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200 || action.payload.statusCode === 201) {
          let newData: any[] = [];
          if (action.payload.data[0].segments[0]?.marginType === 'qty') {
            const totalScripts = action.payload.data[0].segments[0].scripts.map(
              (e: any) => {
                return {
                  brokerageSegmentTableRowId: e.id,
                  scriptName: e.script.name,
                  scriptId: e.scriptId,
                  qty: e.size,
                  maxQty: e.maxSize,
                  userName: action.payload.data[0].userId,
                  userId: action.payload.data[0].id,
                  createdAt: action.payload.data[0].createdAt,
                };
              },
            );
            newData = [{ ...action.payload.data, totalScripts }];
          }
          return {
            ...state,
            loading: false,
            quantityScriptsofUserList: newData,
          };
        } else {
          return {
            ...state,
            loading: false,
            quantityScriptsofUserList: initialState.quantityScriptsofUserList,
          };
        }
      })
      .addCase(getTradeLogs.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          if (state.TradeLogsList.page === 1) {
            return {
              ...state,
              TradeLogsList: {
                ...state.TradeLogsList,
                loading: false,
                fetchMoreLoading: false,
                data: action.payload.data.rows,
                totalCount: action.payload.data.count,
              },

            };
          } else {
            return {
              ...state,
              TradeLogsList: {
                ...state.TradeLogsList,
                loading: false,
                fetchMoreLoading: false,
                data: [
                  ...state.TradeLogsList.data,
                  ...action.payload.data.rows,
                ],
              },
            };
          }
        } else {
          return {
            ...state,
            loading: false,
            TradeLogsList: initialState.TradeLogsList,
          };
        }
      })

      .addCase(getBlockScriptsGroup.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200 || action.payload.statusCode === 201) {
          if (state.blockScriptsGroupList.page === 1) {
            return {
              ...state,
              blockScriptsGroupList: {
                ...state.blockScriptsGroupList,
                loading: false,
                fetchMoreLoading: false,
                data: action.payload.data.rows,
                totalCount: action.payload.data.count,
              },

            };
          } else {
            return {
              ...state,
              blockScriptsGroupList: {
                ...state.blockScriptsGroupList,
                loading: false,
                fetchMoreLoading: false,
                data: [
                  ...state.blockScriptsGroupList.data,
                  ...action.payload.data.rows,
                ],
              },
            };
          }
        } else {
          return {
            ...state,
            loading: false,
            blockScriptsGroupList: initialState.blockScriptsGroupList,
          };
        }
      }
      )

      .addCase(getBlockScriptsGroupDropDown.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            blockScriptsGroupListDropDown: action.payload.data,
          };
        } else {
          return {
            ...state,
            loading: false,
            blockScriptsGroupListDropDown:
              initialState.blockScriptsGroupListDropDown,
          };
        }
      })
      .addCase(deleteBlockScriptsGroupById.fulfilled, (state, action) => {
        if (action.payload.data.statusCode === 200 || action.payload.data.statusCode === 201) {
          action.payload.onSuccess(action.payload.data.message);
          return { ...state, loading: false };
        } else {
          action.payload.onError(action.payload.data.message);
          return { ...state, loading: false };
        }
      })
      .addCase(getQuantityScriptsGroupDropDown.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            quantityScriptsGroupListDropDown: action.payload.data,
          };
        } else {
          return {
            ...state,
            loading: false,
            quantityScriptsGroupListDropDown:
              initialState.quantityScriptsGroupListDropDown,
          };
        }
      })
      .addCase(getQuantityScriptsDataByGroupId.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            quantityScriptsData: action.payload.data,
          };
        } else {
          return {
            ...state,
            loading: false,
            quantityScriptsData: initialState.quantityScriptsData,
          };
        }
      })
      .addMatcher(isPendingAction, (state: State) => {
        state.loading = true;
      })
      .addMatcher(isRejectedAction, (state: State) => {
        state.loading = false;
      });
  },
});

export const blockedScriptsReducer = blockedScriptsSlice.reducer;
export const blockedScriptsSelector = (state: RootState, name: string) =>
  state.blockedScripts[name as keyof typeof state.blockedScripts];
export const { updatePage, updateRowPerPage, tradePage, blockPage, blockUnblock } =
  blockedScriptsSlice.actions;
