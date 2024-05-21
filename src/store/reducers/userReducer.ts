import {
  AnyAction,
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {
  IAllOnlyUsersName,
  IAllScripts,
  IFormScripts,
  IGetAccoutSegments,
} from '@interfaces/index';
import {
  ISingleUser,
  IUserAccountRowCount,
  IUserList,
} from '@interfaces/account.interface';
import accountService from '@services/account.service';
import commonService from '@services/common.service';
import { toNumber } from '@utils/constant';
import { RootState } from '@store/index';
import { LoggedUser } from '@db/schemas/loggedUser.model';
// import brokerService from "@services/broker.service";

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;

export const createAccount = createAsyncThunk(
  `user/add`,
  async (object: any) => {
    try {
      const { data } = await accountService.createAccount(object.payload);
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

export const getAccountById = createAsyncThunk(
  `user/id`,
  async (id: number) => {
    const { data } = await accountService.getAccountById(id);

    return data;
  },
);

export const getProfile = createAsyncThunk(
  `user/profile`,
  async (id: number) => {
    const { data } = await accountService.getAccountById(id);

    return data;
  },
);

export const getM2mAlertOfUsers = createAsyncThunk(
  `user/getM2mAlertOfUsers`,
  async () => {
    const { data } = await accountService.m2mAlertOfUsers();
    return data;
  },
);

export const updateAccountById = createAsyncThunk(
  `user/update`,
  async (object: any) => {
    const id = toNumber(object.payload.id);
    const { data } = await accountService.updateAccountById(id, object.payload);
    return { data, onSuccess: object.onSuccess, onError: object.onError };
  },
);

export const changeStatusById = createAsyncThunk(
  `user/changeStatus`,
  async (object: any) => {
    const id = toNumber(object.item.id);
    const { data } = await accountService.changeStatusById(id, {
      isActive: object.lock,
    });
    return { data };
  },
);
export const deleteUsersSegmentBrokerageLotsEntry = createAsyncThunk(
  `user/deleteUsersSegmentBrokerageLotsEntry`,

  async (object: any) => {
    try {
      const res: any =
        await accountService.deleteUsersSegmentBrokerageLotsEntry(
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

export const getSummaryReport = createAsyncThunk(
  `users/summaryReport`,
  async (pageData: {
    page: number;
    rowPerPage: number;
    userId?: number;
    scriptId?: number;
    segmentId?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    const { data } = await accountService.getSummaryReport(
      pageData.page,
      pageData.rowPerPage,
      pageData.userId,
      pageData.scriptId,
      pageData.segmentId,
      pageData.startDate,
      pageData.endDate,
    );
    return data;
  },
);

export const getAccountByOtherClientId = createAsyncThunk(
  `user/OtherClientId`,
  async (id: number) => {
    const { data } = await accountService.getAccountById(id);
    return data;
  },
);

export const getUserNameList = createAsyncThunk(
  `user/getUserList`,
  async (pageData: { userId?: number | null }) => {
    try {
      const { status, data } = await commonService.getUserNameList(
        pageData.userId && pageData.userId,
      );
      return { status, data };
    } catch (error) {
      throw error;
    }
  },
);

export const getBrokerNameList = createAsyncThunk(
  `user/getBrokerList`,
  async (pageData: { userId?: number | null }) => {
    const { status, data } = await commonService.getBrokerNameList(
      pageData.userId && pageData.userId,
    );
    return { status, data };
  },
);

export const getUsers = createAsyncThunk(
  `user/getUsers`,
  async (pageData: {
    page: number;
    rowPerPage: number;
    search: string;
    tradeUserId?: number | null;
  }) => {
    const { data } = await accountService.getAccountList(
      pageData.page,
      pageData.rowPerPage,
      pageData.search,
      pageData.tradeUserId,
      'user',
    );
    return data;
  },
);

export const getUsersName = createAsyncThunk(`user/getUsersName`, async () => {
  try {
    const { data } = await accountService.getUsersName();
    return data;
  } catch (error) {
    throw error;
  }
});
export const findUserByName = createAsyncThunk(
  `user/findUserByName`,
  async (name: string) => {
    try {
      const { data } = await accountService.findUserByName(name);
      return data;
    } catch (error) {
      throw error;
    }
  },
);

export const getTradesList = createAsyncThunk(
  `user/getTradelist`,
  async (pageData: { page: number; rowPerPage: number; search: string }) => {
    try {
      const { data } = await accountService.getTradesList(
        pageData.page,
        pageData.rowPerPage,
        pageData.search,
      );
      return data;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteUser = createAsyncThunk(
  `user/delete`,

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
export const getSegments = createAsyncThunk(`user/segments`, async () => {
  try {
    const { status, data } = await accountService.getSegments();

    return { status, data };
  } catch (error) {
    throw error;
  }
});

export const getuserNseFormScripts = createAsyncThunk(
  `user/userNseFormScripts`,
  async () => {
    try {
      const { status, data } = await commonService.getuserNseFormScripts();
      return { status, data };
    } catch (error) {
      throw error;
    }
  },
);

export const getuserNseFormLotScripts = createAsyncThunk(
  `user/userNseFormLotScripts`,
  async () => {
    try {
      const { status, data } = await commonService.getuserNseFormScripts();
      return { status, data };
    } catch (error) {
      throw error;
    }
  },
);

export const getAllScripts = createAsyncThunk(
  `user/getAllScripts`,
  async () => {
    try {
      const { status, data } = await commonService.getAllScripts();
      return { status, data };
    } catch (error) {
      throw error;
    }
  },
);

export const getUserAuditLogs = createAsyncThunk(
  `user/getUserAuditLogs`,
  async (pageData: {
    userId?: number | null;
    page: number;
    rowPerPage: number;
  }) => {
    const { data } = await accountService.getUserAuditList(
      pageData.userId,
      pageData.page,
      pageData.rowPerPage,
    );
    return data;
  },
);
export const createUserSegmentBrokerageLotsEntry = createAsyncThunk(
  `user/createUserSegmentBrokerageLotsEntry`,

  async (object: any) => {
    try {
      const { data } = await accountService.createUserSegmentBrokerageLotsEntry(
        object.payload,
      );
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
export const updateUserSegmentBrokerageLotsEntry = createAsyncThunk(
  `user/updateUserSegmentBrokerageLotsEntry`,
  async (object: any) => {
    try {
      const { data } = await accountService.updateUserSegmentBrokerageLotsEntry(
        object.payload,
      );
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

export const getuserMcxFormScripts = createAsyncThunk(
  `user/userMcxFormScripts`,
  async () => {
    try {
      const { status, data } = await commonService.getuserMcxFormScripts();
      return { status, data };
    } catch (error) {
      throw error;
    }
  },
);
export const getuserMcxFormScriptsOthers = createAsyncThunk(
  `user/userMcxFormScriptsOthers`,
  async () => {
    try {
      const { status, data } =
        await commonService.getuserMcxFormScriptsOthers();
      return { status, data };
    } catch (error) {
      throw error;
    }
  },
);

export const getMasterCount = createAsyncThunk('user/masterCount', async () => {
  try {
    const { data } = await accountService.getMasterCount();
    return { count: data.data.count, data: data };
  } catch (error) {
    throw error;
  }
});
export const isUserAvailable = createAsyncThunk(
  `user/isAvailableById`,
  async (userId: string) => {
    try {
      const { data } = await accountService.isUserAvailable(userId);
      return { status: data.status, data: data };
    } catch (error) {
      throw error;
    }
  },
);
export const getAllRoles = createAsyncThunk(`user/getAllRoles`, async () => {
  try {
    const { data } = await accountService.getAllRoles();
    return { status: data.status, data: data };
  } catch (error) {
    throw error;
  }
});
export const onlyPositionSquareOffById = createAsyncThunk(
  `user/onlyPositionSquareOff`,
  async (object: any) => {
    const id = toNumber(object.item.id);
    const { data } = await accountService.onlyPositionSquareOff(id, {
      onlyPositionSquareOff: object.onlyPositionSquareOff,
    });
    return { data };
  },
);

export const getBrokerUsers: any = createAsyncThunk(
  `user/getBrokerUsers`,
  async (userId?: number) => {
    const { status, data } = await brokerService.getBrokerUsers(userId);
    return { status, data };
  },
);

interface State {
  loading: boolean;
  usersList: IUserList;
  auditLogsList: IUserAccountRowCount;
  allNseFormScripts: IFormScripts[];
  allNseFormLotScripts: IFormScripts[];
  allMcxFormScripts: IFormScripts[];
  allRoleList: any;
  allMcxFormScriptsOthers: IFormScripts[];
  allSegmentList: any;
  allTradeList: any;
  singleUser: ISingleUser | null | undefined;
  allScripts: IAllScripts[];
  page: number;
  rowPerPage: number;
  search: string;
  totalCount: number;
  totalPages: number;
  masterCount: number;
  getSegmentsData: any;
  AllOnlyUsersName: IAllOnlyUsersName[];
  UserByName: IAllOnlyUsersName[];
  allUserNameList: any;
  allBrokerNameList: any;
  summaryReportData: {
    data: any[];
    count: number;
    fetchMoreLoading: boolean;
    page: number;
    rowPerPage: number;
    totalCount: number;
    loading: boolean;
  };
  segmnetsId: any;
  profileData: any;
  M2mAlertOfUsers: any;
  tradeMasterId: number | null;
  tradeAdminId: number | null;
  allBrokerUsersList: any;
}
const initialState: State = {
  allScripts: [],
  usersList: {
    data: [],
    count: 0,
    fetchMoreLoading: false,
    page: 1,
    rowPerPage: 10,
    totalCount: 0,
    loading: false,
  },
  auditLogsList: {
    data: [],
    count: 0,
    fetchMoreLoading: false,
    page: 1,
    rowPerPage: 10,
    totalCount: 0,
    loading: false,
  },
  allRoleList: [],
  allSegmentList: [],
  allNseFormLotScripts: [],
  singleUser: null,
  getSegmentsData: [],
  loading: false,
  allNseFormScripts: [],
  allTradeList: [],
  allMcxFormScripts: [],
  allMcxFormScriptsOthers: [],
  AllOnlyUsersName: [],
  UserByName: [],
  page: 1,
  rowPerPage: 10,
  search: '',
  totalCount: 0,
  totalPages: 0,
  masterCount: 0,
  allUserNameList: [],
  allBrokerNameList: [],
  summaryReportData: {
    data: [],
    count: 0,
    fetchMoreLoading: false,
    page: 1,
    rowPerPage: 10,
    totalCount: 0,
    loading: false,
  },
  segmnetsId: 0,
  profileData: null,
  M2mAlertOfUsers: [],
  tradeMasterId: 0,
  tradeAdminId: 0,
  allBrokerUsersList: [],
};

const isPendingAction = (action: AnyAction): action is PendingAction =>
  action.type.startsWith(userSlice.name) && action.type.endsWith('/pending');
const isRejectedAction = (action: AnyAction): action is RejectedAction =>
  action.type.startsWith(userSlice.name) && action.type.endsWith('/rejected');

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: () => {
      return { ...initialState };
    },
    summaryPage: (state: State, action: PayloadAction<number>) => {
      state.summaryReportData.page = action.payload;
    },
    auditPage: (state: State, action: PayloadAction<number>) => {
      state.auditLogsList.page = action.payload;
    },
    userPage: (state: State, action: PayloadAction<number>) => {
      state.usersList.page = action.payload;
    },
    updatePage: (state: State, action: PayloadAction<number>) => {
      return { ...state, page: action.payload };
    },
    updateRowPerPage: (state: State, action: PayloadAction<number>) => {
      return { ...state, rowPerPage: action.payload };
    },
    updateSearch: (state: State, action: PayloadAction<string>) => {
      return { ...state, search: action.payload, page: initialState.page };
    },
    setTradeAdminId: (state: State, action: PayloadAction<number>) => {
      return {
        ...state,
        tradeAdminId: action.payload,
        tradeMasterId: null,
        rowPerPage: initialState.rowPerPage,
        page: initialState.page,
        search: initialState.search,
      };
    },
    setTradeMasterId: (state: State, action: PayloadAction<number>) => {
      return {
        ...state,
        tradeMasterId: action.payload,
        page: initialState.page,
        rowPerPage: initialState.rowPerPage,
        search: initialState.search,
      };
    },
    setSegmnetsId: (state: State, action: PayloadAction<number>) => {
      return {
        ...state,
        segmnetsId: action.payload,
      };
    },
    flushState: (state: State) => {
      return {
        ...state,
        tradeAdminId: 0,
        tradeMasterId: null,
      };
    },
    clearUserList: (state: State) => {
      return { ...state, allUserNameList: [] };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createAccount.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          action.payload.onSuccess(action.payload?.data?.message);
          return { ...state, loading: false };
        } else {
          action.payload.onError(action.payload?.data?.message);
          return { ...state, loading: false };
        }
      })
      .addCase(
        deleteUsersSegmentBrokerageLotsEntry.fulfilled,
        (state, action) => {
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
        },
      )
      .addCase(updateAccountById.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          action.payload.onSuccess(action.payload?.data?.message);
          return { ...state, loading: false };
        } else {
          action.payload.onError(action.payload?.data?.message);
          return { ...state, loading: false };
        }
      })
      .addCase(
        createUserSegmentBrokerageLotsEntry.fulfilled,
        (state, action) => {
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
        },
      )
      .addCase(
        updateUserSegmentBrokerageLotsEntry.fulfilled,
        (state, action) => {
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
        },
      )
      .addCase(changeStatusById.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          return { ...state, loading: false };
        } else {
          return { ...state, loading: false };
        }
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          if (state.usersList.page === 1) {
            return {
              ...state,
              usersList: {
                ...state.usersList,
                loading: false,
                fetchMoreLoading: false,
                data: action.payload.data.rows,
                totalCount: action.payload.data.count,
              },
            };
          } else {
            return {
              ...state,
              usersList: {
                ...state.usersList,
                loading: false,
                fetchMoreLoading: false,
                data: [...state.usersList.data, ...action.payload.data.rows],
              },
            };
          }
        } else {
          return {
            ...state,
            loading: false,
            usersList: initialState.usersList,
          };
        }
      })

      .addCase(getUserAuditLogs.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          if (state.auditLogsList.page === 1) {
            return {
              ...state,
              auditLogsList: {
                ...state.auditLogsList,
                loading: false,
                fetchMoreLoading: false,
                data: action.payload.data.rows,
                totalCount: action.payload.data.count,
              },
            };
          } else {
            return {
              ...state,
              auditLogsList: {
                ...state.auditLogsList,
                loading: false,
                fetchMoreLoading: false,
                data: [
                  ...state.auditLogsList.data,
                  ...action.payload.data.rows,
                ],
              },
            };
          }
        } else {
          return {
            ...state,
            loading: false,
            auditLogsList: initialState.auditLogsList,
          };
        }
      })
      .addCase(getSummaryReport.fulfilled, (state, action) => {
        if (
          action.payload?.statusCode === 200 ||
          action.payload?.statusCode === 201
        ) {
          if (state.summaryReportData.page === 1) {
            return {
              ...state,
              summaryReportData: {
                ...state.summaryReportData,
                loading: false,
                fetchMoreLoading: false,
                data: action.payload.data.rows,
                totalCount: action.payload.data.count,
              },
            };
          } else {
            return {
              ...state,
              summaryReportData: {
                ...state.summaryReportData,
                loading: false,
                fetchMoreLoading: false,
                data: [
                  ...state.summaryReportData.data,
                  ...action.payload.data.rows,
                ],
              },
            };
          }
        } else {
          return {
            ...state,
            loading: false,
            summaryReportData: initialState.summaryReportData,
          };
        }
      })

      .addCase(getM2mAlertOfUsers.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            M2mAlertOfUsers: action.payload.data,
          };
        } else {
          return {
            ...state,
            loading: false,
            M2mAlertOfUsers: initialState.M2mAlertOfUsers,
          };
        }
      })

      .addCase(getUsersName.fulfilled, (state, action) => {
        if (
          action.payload?.statusCode === 200 ||
          action.payload?.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            AllOnlyUsersName: action.payload.data,
          };
        } else {
          return {
            ...state,
            loading: false,
            AllOnlyUsersName: initialState.AllOnlyUsersName,
          };
        }
      })
      .addCase(findUserByName.fulfilled, (state, action) => {
        if (
          action.payload?.statusCode === 200 ||
          action.payload?.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            UserByName: action.payload.data,
          };
        } else {
          return {
            ...state,
            loading: false,
            UserByName: initialState.UserByName,
          };
        }
      })
      .addCase(getTradesList.fulfilled, (state, action) => {
        if (
          action.payload?.statusCode === 200 ||
          action.payload?.statusCode === 201
        ) {
          if (state.page === 1) {
            return {
              ...state,
              loading: false,
              allTradeList: [],
              totalCount: action.payload.data.count,
              totalPages: Math.ceil(action.payload.data.count / 10),
            };
          } else {
            return {
              ...state,
              loading: false,
              allTradeList: action.payload.data.rows,
            };
          }
        } else {
          return {
            ...state,
            loading: false,
            allTradeList: initialState.allTradeList,
          };
        }
      })
      .addCase(getUserNameList.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            allUserNameList: action.payload.data.data.map((e: any) => {
              return {
                id: e.id,
                name: `${e.name} ( ${e.user_id} )`,
                min_brokerage: e.min_brokerage,
              };
            }),
          };
        } else {
          return {
            ...state,
            loading: false,
            allUserNameList: initialState.allUserNameList,
          };
        }
      })
      .addCase(getBrokerNameList.fulfilled, (state, action) => {
        if (
          action.payload.data.statusCode === 200 ||
          action.payload.data.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,

            allBrokerNameList: action.payload.data.data.map((e: any) => {
              return {
                id: e.id,
                name: `${e.name} ( ${e.user_id} )`,
              };
            }),
          };
        } else {
          return {
            ...state,
            loading: false,
            allBrokerNameList: initialState.allBrokerNameList,
          };
        }
      })
      .addCase(getAccountByOtherClientId.fulfilled, state => {
        return {
          ...state,
          loading: false,
        };
      })
      .addCase(getAccountById.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          return {
            ...state,
            singleUserloading: false,
            singleUser: {
              ...action.payload.data,
              segmentName: action.payload.data.segments.map(
                (e: IGetAccoutSegments) => e.segment,
              ),
              blockScripts: action.payload.data.blockScripts.map(
                (e: any) => e.id,
              ),
            },
          };
        } else {
          return {
            ...state,
            loading: false,
            singleUser: initialState.singleUser,
          };
        }
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        if (action.payload?.data?.segments) {
          action.payload.data.segments = action.payload.data.segments.map(e => {
            const updated = { ...e };

            updated.totalMargin = e.scripts?.reduce(
              (totalMargin: number, script: any) => {
                totalMargin += toNumber(script.size);
                return totalMargin;
              },
              0,
            );
            updated.availableMargin =
              Number(updated.totalMargin) -
              Number(action.payload.data.usedMargin);

            return updated;
          });
          return {
            ...state,
            loading: false,
            profileData: action.payload.data,
          };
        } else {
          return {
            ...state,
            loading: false,
          };
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          action.payload.onSuccess(action.payload?.data?.message);
          return { ...state, loading: false, totalCount: state.totalCount - 1 };
        } else {
          action.payload.onError(action.payload?.data?.message);
          return { ...state, loading: false };
        }
      })
      // .addCase(deleteUser.fulfilled, (state, action) => {
      //   if (
      //     action.payload?.statusCode === 200 ||
      //     action.payload?.statusCode === 201
      //   ) {
      //     return {
      //       ...state,
      //       loading: false,
      //       totalCount: state.totalCount - 1,
      //       usersList: state.usersList.filter(
      //         (e: IUserAccount) => e.id !== action.payload.data.id
      //       ),
      //     };
      //   } else {
      //     return { ...state, loading: false };
      //   }
      // })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            allRoleList: action.payload.data.data,
          };
        } else {
          return {
            ...state,
            loading: false,
            allRoleList: initialState.allRoleList,
          };
        }
      })
      .addCase(isUserAvailable.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
          };
        } else {
          return {
            ...state,
            loading: false,
          };
        }
      })
      .addCase(getSegments.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            allSegmentList: action.payload.data.data,
          };
        } else {
          return {
            ...state,
            loading: false,
            allSegmentList: initialState.allSegmentList,
          };
        }
      })
      .addCase(getuserNseFormScripts.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            allNseFormScripts: action.payload.data.data.map(
              (e: IFormScripts) => {
                return {
                  id: e.id,
                  name: e.name,
                  isChecked: false,
                  amount: null,
                  size: null,
                  brokerage: null,
                };
              },
            ),
          };
        } else {
          return {
            ...state,
            loading: false,
            allNseFormScripts: initialState.allNseFormScripts,
          };
        }
      })

      .addCase(getuserNseFormLotScripts.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            allNseFormLotScripts: action.payload.data.data.map(
              (e: IFormScripts) => {
                return {
                  id: e.id,
                  name: e.name,
                  isChecked: false,
                  amount: null,
                  size: null,
                  brokerage: null,
                };
              },
            ),
          };
        } else {
          return {
            ...state,
            loading: false,
            allNseFormLotScripts: initialState.allNseFormLotScripts,
          };
        }
      })
      .addCase(getAllScripts.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            allScripts: action.payload.data.data,
          };
        } else {
          return {
            ...state,
            loading: false,
            allScripts: initialState.allScripts,
          };
        }
      })
      .addCase(getuserMcxFormScripts.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            allMcxFormScripts: action.payload.data.data.map(
              (e: IFormScripts) => {
                return {
                  id: e.id,
                  name: e.name,
                  isChecked: false,
                  size: null,
                  brokerage: null,
                };
              },
            ),
          };
        } else {
          return {
            ...state,
            loading: false,
            allMcxFormScripts: initialState.allMcxFormScripts,
          };
        }
      })
      .addCase(getuserMcxFormScriptsOthers.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            allMcxFormScriptsOthers: action.payload.data.data.map(
              (e: IFormScripts) => {
                return {
                  id: e.id,
                  name: e.name,
                  isChecked: false,
                  brokerage: null,
                };
              },
            ),
          };
        } else {
          return {
            ...state,
            loading: false,
            allMcxFormScriptsOthers: initialState.allMcxFormScriptsOthers,
          };
        }
      })
      .addCase(getMasterCount.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            masterCount: action.payload.count,
          };
        } else {
          return {
            ...state,
            loading: false,
            masterCount: initialState.masterCount,
          };
        }
      })
      .addCase(onlyPositionSquareOffById.fulfilled, (state, action) => {
        if (
          action.payload.data.statusCode === 200 ||
          action.payload.data.statusCode === 201
        ) {
          return { ...state, loading: false };
        } else {
          return { ...state, loading: false };
        }
      })
      .addCase(getBrokerUsers.fulfilled, (state, action) => {
        if (
          action.payload.data.statusCode === 200 ||
          action.payload.data.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            allBrokerUsersList: action.payload.data.data,
          };
        } else {
          return {
            ...state,
            loading: false,
            allBrokerUsersList: initialState.allBrokerUsersList,
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

export const userReducer = userSlice.reducer;
export const userSelector = (state: RootState, name: string) =>
  state.user[name as keyof typeof state.user];
export const {
  updatePage,
  updateRowPerPage,
  updateSearch,
  setSegmnetsId,
  resetUser,
  summaryPage,
  auditPage,
  clearUserList,
  userPage,
} = userSlice.actions;
