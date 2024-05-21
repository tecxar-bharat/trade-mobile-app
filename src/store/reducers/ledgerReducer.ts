import {
  AnyAction,
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { ILedgerListRowCount } from '@interfaces/index';
import ledgerService from '@services/ledger.service';
import { RootState } from '@store/index';
import moment from 'moment';
import { toNumber } from '@utils/constant';
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;

export const createLedger = createAsyncThunk(
  `ledger/add`,
  async (object: any) => {
    try {
      const { data } = await ledgerService.createLedger(object.payload);
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

export const createJVEntry = createAsyncThunk(
  `createJVEntry/add`,
  async (object: any) => {
    try {
      const { data } = await ledgerService.createJVEntry(object.payload);
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

export const getCashLedgersList = createAsyncThunk(
  `ledger/cash/get`,
  async (pageData: {
    userId?: number;
    page?: number;
    rowPerPage?: number;
    search?: string;
  }) => {
    try {
      const { data } = await ledgerService.getCashLedgersList(
        pageData.userId,
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
export const getCashJVEntryList = createAsyncThunk(
  `ledger/cashjvEntry`,
  async (pageData: {
    userId?: number;
    startDate?: string;
    endDate?: string;
    page?: number;
    rowPerPage?: number;
    entryType?: string;
  }) => {
    const { data } = await ledgerService.getCashJVEntryList(
      pageData.userId,
      pageData.startDate,
      pageData.endDate,
      pageData.page,
      pageData.rowPerPage,
      pageData.entryType,
    );
    return data;
  },
);
export const getValanviseList = createAsyncThunk(
  `valan/get`,
  async (userId?: number | undefined) => {
    try {
      const { data } = await ledgerService.getValanviseList(userId);
      return data;
    } catch (error) {
      throw error;
    }
  },
);
export const getValanDropDownList = createAsyncThunk(
  `valanDrop/getList`,
  async () => {
    try {
      const { data } = await ledgerService.getValanDropDownList();
      return data;
    } catch (error) {
      throw error;
    }
  },
);
export const getAllUsersLedgers = createAsyncThunk(
  `ledger/getAllUsersLedgers`,
  async (pageData: {
    userId?: number;
    page: number;
    rowPerPage: number;
    search?: string;
  }) => {
    try {
      const { data }: any = await ledgerService.getAllUsersLedgers(
        pageData.userId,
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
export const getAllBrokerBillOfUsers = createAsyncThunk(
  `ledger/getAllBrokerBillOfUsers`,
  async (pageData: {
    startDate?: string;
    endDate?: string;
    userId?: number | null;
  }) => {
    try {
      const { data }: any = await ledgerService.getAllBrokerBillOfUsers(
        pageData.startDate,
        pageData.endDate,
        pageData.userId,
      );
      return data;
    } catch (error) {
      throw error;
    }
  },
);

export const getCashLedgerById = createAsyncThunk(
  `ledger/id`,
  async (id: number) => {
    const { data } = await ledgerService.getCashLedgerById(id);
    return data;
  },
);

export const updateLedgerById = createAsyncThunk(
  `ledger/update`,
  async (object: any) => {
    const id = toNumber(object.payload.id);
    const { data } = await ledgerService.updateLedgerById(id, object.payload);
    return { data, onSuccess: object.onSuccess, onError: object.onError };
  },
);

export const getUplineBills = createAsyncThunk(
  `valans/getUplineBill`,
  async (pageData: {
    startDate?: string;
    endDate?: string;
    userId?: number;
  }) => {
    try {
      const { data }: any = await ledgerService.getUplineBills(
        pageData.startDate,
        pageData.endDate,
        pageData.userId,
      );
      return data;
    } catch (error) {
      throw error;
    }
  },
);

interface State {
  loading: boolean;
  ledgerLoading: boolean;
  cashLedgerLoading: boolean;
  ledgerList: ILedgerListRowCount;
  cashLedgerList: any;
  AllUsersLedgersList: ILedgerListRowCount;
  AllUsersBrokerBillList: ILedgerListRowCount;
  valanViseList: any;
  valanDropDownList: any;
  valanId: number | null | undefined;
  CashledgerDataOfUser: any;
  cashJvEntryList: ILedgerListRowCount;
  startDate: string;
  endDate: string;
  AdminId: number | null;
  MasterId: number | null;
  UserId: number | null;
  page: number;
  rowPerPage: number;
  totalCount: number;
  search: string;
  uplineBillsList: any;
  balance: number;
}
const initialState: State = {
  ledgerList: {
    data: [],
    count: 0,
    fetchMoreLoading: false,
    page: 1,
    rowPerPage: 10,
    totalCount: 0,
    loading: false,
  },
  uplineBillsList: [],
  cashLedgerList: [],
  AllUsersLedgersList: {
    data: [],
    count: 0,
    fetchMoreLoading: false,
    page: 1,
    rowPerPage: 10,
    totalCount: 0,
    loading: false,
  },
  AllUsersBrokerBillList: {
    data: [],
    count: 0,
    fetchMoreLoading: false,
    page: 1,
    rowPerPage: 10,
    totalCount: 0,
    loading: false,
  },
  valanViseList: [],
  valanDropDownList: [],
  valanId: undefined,
  CashledgerDataOfUser: {},
  cashJvEntryList: {
    data: [],
    count: 0,
    fetchMoreLoading: false,
    page: 1,
    rowPerPage: 10,
    totalCount: 0,
    loading: false,
  },
  page: 1,
  rowPerPage: 10,
  totalCount: 0,
  AdminId: 0,
  MasterId: 0,
  UserId: 0,
  search: '',
  startDate: '',
  endDate: '',
  loading: false,
  ledgerLoading: false,
  cashLedgerLoading: false,
  balance: 0,
};

const isPendingAction = (action: AnyAction): action is PendingAction =>
  action.type.startsWith(ledgerSlice.name) && action.type.endsWith('/pending');
const isRejectedAction = (action: AnyAction): action is RejectedAction =>
  action.type.startsWith(ledgerSlice.name) && action.type.endsWith('/rejected');

const ledgerSlice = createSlice({
  name: 'ledger',
  initialState,
  reducers: {
    resetLedger: () => {
      return { ...initialState };
    },

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
        valanViseList: initialState.valanViseList,
        AdminId: 0,
        MasterId: null,
        UserId: null,
      };
    },
    setValanId: (state: State, action: PayloadAction<any>) => {
      return {
        ...state,
        valanId: action.payload?.date ?? null,
        startDate: action.payload?.start_date,
        endDate: action.payload?.end_date,
      };
    },
    updatePage: (state: State, action: PayloadAction<number>) => {
      {
        state.cashJvEntryList.page = action.payload;
      }
    },
    setPage: (state: State, action: PayloadAction<number>) => {
      return { ...state, page: action.payload };
    },
    updareBrokerBill: (state: State, action: PayloadAction<number>) => {
      {
        state.AllUsersBrokerBillList.page = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createLedger.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          action.payload.onSuccess(action.payload.data.message);
          return { ...state, loading: false };
        } else {
          action.payload.onError(action.payload?.data?.message);
          return { ...state, loading: false };
        }
      })
      .addCase(createJVEntry.fulfilled, (state, action) => {
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
      .addCase(getCashLedgerById.fulfilled, (state, action) => {
        if (
          action.payload?.statusCode === 200 ||
          action.payload?.statusCode === 201
        ) {
          return {
            ...state,
            cashLedgerLoading: false,
            CashledgerDataOfUser: action.payload.data,
          };
        } else {
          return {
            ...state,
            cashLedgerLoading: false,
            CashledgerDataOfUser: initialState.CashledgerDataOfUser,
          };
        }
      })
      .addCase(getUplineBills.fulfilled, (state, action) => {
        if (
          action.payload?.statusCode === 200 ||
          action.payload?.statusCode === 201
        ) {
          let totalBalance = 0;
          let totalBrokerBrokerage = 0;
          let netM2M = 0;
          let uplineM2m = 0;
          let position: any[] = [];
          action.payload.data.forEach((element: any) => {
            position.push({
              ...element,
            });
            totalBalance = totalBalance + element.user.balance;
            totalBrokerBrokerage =
              totalBrokerBrokerage + element.user.brokerBrokerage;
            netM2M =
              netM2M + element.user.balance + element.user.brokerBrokerage;
            uplineM2m =
              uplineM2m +
              ((element.user.balance + element.user.brokerBrokerage) *
                element.user.partnership_percentage) /
                100;
          });
          if (action.payload.data.length > 0) {
            position.push({
              totalBalance,
              totalBrokerBrokerage,
              netM2M,
              uplineM2m: -uplineM2m,
              isExtraRow: true,
            });
          }
          return {
            ...state,
            loading: false,
            uplineBillsList: position,
          };
        } else {
          return {
            ...state,
            loading: false,
            uplineBillsList: initialState.uplineBillsList,
          };
        }
      })
      .addCase(updateLedgerById.fulfilled, (state, action) => {
        if (
          action.payload?.data?.statusCode === 200 ||
          action.payload?.data?.statusCode === 201
        ) {
          action.payload.onSuccess(action.payload.data.message);
          return { ...state, loading: false };
        } else {
          action.payload.onError(action.payload?.data?.message);
          return { ...state, loading: false };
        }
      })
      .addCase(getCashLedgersList.fulfilled, (state, action) => {
        if (
          action.payload?.statusCode === 200 ||
          action.payload?.statusCode === 201
        ) {
          if (state.page === 1) {
            const cashLedger: any[] = [];
            action.payload.data.forEach((element: any) => {
              if (element.ledgers.length > 0) {
                cashLedger.push({
                  date: '',
                  valanId: '',
                  debit: '',
                  credit: '',
                  description: '',
                  balance: element.ledgers[0].balanceOFUser,
                  masterName: element.ledgers[0].masterName,
                  role: element.role.slug,
                  userId: `${element.name} ( ${element.user_id} )`,
                  isExtraRow: true,
                });
              }
              element.ledgers.forEach((e: any) => {
                cashLedger.push({
                  ...e,
                  user: element.name,
                  userId: element.user_id,
                  role: element.role.slug,
                  userIdd: element.id,
                });
              });
            });
            const rawData: any = cashLedger;
            let transformedData: any = [];
            let currentUser: any = null;
            let currentKey = 1;
            rawData.forEach((item: any) => {
              if (item.isExtraRow) {
                if (currentUser) {
                  transformedData.push(currentUser);
                }
                currentUser = {
                  ...item,
                  children: [],
                  key: currentKey++,
                };
              } else if (currentUser) {
                currentUser.children.push({
                  ...item,
                  key: currentKey++,
                });
              }
            });
            const groupedData = transformedData.reduce(
              (result: any, item: any) => {
                const id = item.masterName;
                if (!result[id]) {
                  result[id] = [];
                }
                result[id].push(item);
                return result;
              },
              {},
            );
            transformedData = [];
            Object.keys(groupedData).forEach((e: any) => {
              transformedData.push({
                masterName: e,
                date: '',
                valanId: '',
                debit: '',
                credit: '',
                description: '',
                balance: '',
                userId: ``,
                isExtraRow1: true,
              });
              groupedData[e].forEach((ee: any) => {
                transformedData.push(ee);
              });
            });
            if (currentUser) {
              transformedData.push(currentUser);
            }
            return {
              ...state,
              cashLedgerLoading: false,
              cashLedgerList: transformedData,
            };
          }
          // else {
          //   return {
          //     ...state,
          //     cashLedgerLoading: false,
          //     cashLedgerList: [
          //       ...state.cashLedgerList.data,
          //       ...action.payload.data.rows,
          //     ],
          //   };
          // }
        } else {
          return {
            ...state,
            cashLedgerLoading: false,
            cashLedgerList: initialState.cashLedgerList,
          };
        }
      })
      .addCase(getCashJVEntryList.fulfilled, (state: State, action: any) => {
        if (state.cashJvEntryList.page === 1) {
          return {
            ...state,
            cashJvEntryList: {
              ...state.cashJvEntryList,
              loading: false,
              fetchMoreLoading: false,
              data: action.payload.data.rows,
              totalCount: action.payload.data.count,
            },
          };
        } else {
          return {
            ...state,
            cashJvEntryList: {
              ...state.cashJvEntryList,
              loading: false,
              fetchMoreLoading: false,
              data: [
                ...state.cashJvEntryList.data,
                ...action.payload.data.rows,
              ],
            },
          };
        }
      })
      .addCase(getValanviseList.fulfilled, (state, action) => {
        if (
          action.payload?.statusCode === 200 ||
          action.payload?.statusCode === 201
        ) {
          let valanList: any[] = [];
          Object.keys(action.payload.data).forEach(e => {
            valanList.push({
              userId: `${moment(action.payload.data[e][0].start_date)
                .format('DDMMM')
                .toUpperCase()}-${moment(action.payload.data[e][0].end_date)
                .format('DDMMM')
                .toUpperCase()}`,
              isExtraRow: true,
            });
            valanList = [
              ...valanList,
              ...action.payload.data[e].map((i: any) => {
                return {
                  debit: i?.ledgers?.debit ?? 0,
                  credit: i?.ledgers?.credit ?? 0,
                  userId: i.user.user_id,
                  valanIdd: i?.id,
                };
              }),
            ];
          });

          return {
            ...state,
            loading: false,
            valanViseList: valanList,
          };
        } else {
          return {
            ...state,
            loading: false,
            valanViseList: initialState.valanViseList,
          };
        }
      })
      .addCase(getAllUsersLedgers.fulfilled, (state: State, action: any) => {
        if (
          action.payload?.statusCode === 200 ||
          action.payload?.statusCode === 201
        ) {
          return {
            ...state,
            AllUsersLedgersList: {
              ...state.AllUsersLedgersList,
              loading: false,
              fetchMoreLoading: false,
              data: action.payload.data.rows,
              totalCount: action.payload.data.count,
            },
          };
        } else {
          return {
            ...state,
            AllUsersLedgersList: initialState.AllUsersLedgersList,
          };
        }
      })
      .addCase(
        getAllBrokerBillOfUsers.fulfilled,
        (state: State, action: any) => {
          if (state.AllUsersBrokerBillList.page === 1) {
            return {
              ...state,
              AllUsersBrokerBillList: {
                ...state.AllUsersBrokerBillList,
                loading: false,
                fetchMoreLoading: false,
                data: action.payload.data.rows,
                totalCount: action.payload.data.count,
              },
            };
          } else {
            return {
              ...state,
              AllUsersBrokerBillList: {
                ...state.AllUsersBrokerBillList,
                loading: false,
                fetchMoreLoading: false,
                data: [
                  ...state.AllUsersBrokerBillList.data,
                  ...action.payload.data.rows,
                ],
              },
            };
          }
        },
      )
      .addCase(getValanDropDownList.fulfilled, (state, action) => {
        if (
          action.payload?.statusCode === 200 ||
          action.payload?.statusCode === 201
        ) {
          return {
            ...state,
            loading: false,
            valanDropDownList: action.payload.data.map(
              (e: any, index: number) => {
                return {
                  ...e,
                  date: `${moment(e.start_date).format('MMM').toUpperCase()} ${
                    index + 1
                  } ( ${moment(e.start_date)
                    .format('DDMMM')
                    .toUpperCase()}-${moment(e.end_date)
                    .format('DDMMM')
                    .toUpperCase()} )`,
                };
              },
            ),
          };
        } else {
          return {
            ...state,
            loading: false,
            valanDropDownList: initialState.valanDropDownList,
          };
        }
      })
      .addCase(getCashLedgersList.pending, state => {
        return {
          ...state,
          cashLedgerLoading: true,
        };
      })
      .addCase(getAllUsersLedgers.pending, state => {
        return {
          ...state,
          ledgerLoading: true,
        };
      })
      .addMatcher(isPendingAction, state => {
        state.loading = true;
      })
      .addMatcher(isRejectedAction, state => {
        state.loading = false;
      });
  },
});

export const ledgerReducer = ledgerSlice.reducer;
export const ledgerSelector = (state: RootState, name: string) =>
  state.ledger[name as keyof typeof state.ledger];

export const {
  setValanId,
  setAdminId,
  setMasterId,
  setUserId,
  flushState,
  resetLedger,
  updatePage,
  updareBrokerBill,
  setPage,
} = ledgerSlice.actions;
