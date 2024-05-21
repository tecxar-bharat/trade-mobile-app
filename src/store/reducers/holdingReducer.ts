import {
  AnyAction,
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { IPosition } from '../../interfaces';
import positionService from '@services/position.service';
import { RootState } from '../index';
import {
  GlobalDataSegments,
  GlobalSegmentsSlug,
  ActiveSegmentType,
  IMtMData,
} from '@interfaces/common';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;

export const getHoldingList = createAsyncThunk(
  `holding/getPositionList`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (positionData: {
    userId: number;
    scriptId?: any;
    segmentId?: any;
    masterId?: number;
    brokerId?: number;
    adminId?: number;
    deliveryType?: string;
    expiryDate?: string;
    search?: string | null;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await positionService.getPositionList(
      positionData.userId ??
        positionData.brokerId ??
        positionData.masterId ??
        positionData.adminId,
      positionData.scriptId,
      positionData.segmentId,
      positionData.deliveryType,
      positionData.expiryDate,
      positionData.search,
    );
    return response;
  },
);
interface State {
  loading: boolean;
  holdingList: IPosition[];
  holdingAdminId: number | null;
  holdingMasterId: number | null;
  holdingUserId: number | null;
  scriptId: number | null | undefined;
  segmentId: number | null | undefined;
  m2mData: IMtMData;
  currentSymbol: string;
  activeSegment: ActiveSegmentType;
  currentRow: IPosition | null;
  activeDetailIndex: number;
  activeCloseIndex: number;
}
const initialState: State = {
  holdingList: [],
  m2mData: {},
  loading: false,
  holdingAdminId: 0,
  holdingMasterId: 0,
  holdingUserId: 0,
  scriptId: undefined,
  segmentId: undefined,
  currentSymbol: '',
  activeSegment: '',
  currentRow: null,
  activeDetailIndex: -1,
  activeCloseIndex: -1,
};

const isPendingAction = (action: AnyAction): action is PendingAction =>
  action.type.startsWith(holdingSlice.name) && action.type.endsWith('/pending');
const isRejectedAction = (action: AnyAction): action is RejectedAction =>
  action.type.startsWith(holdingSlice.name) &&
  action.type.endsWith('/rejected');

const holdingSlice = createSlice({
  name: 'holding',
  initialState,
  reducers: {
    setMtM: (
      state: State,
      {
        payload: { identifier, mtm, userId },
      }: PayloadAction<{ mtm: number; identifier: string; userId: number }>,
    ) => {
      state.m2mData[userId][identifier] = mtm;
    },
    setHoldingAdminId: (state: State, action: PayloadAction<number>) => {
      return {
        ...state,
        holdingMasterId: null,
        holdingUserId: null,
        holdingAdminId: action.payload,
      };
    },
    setHoldingMasterId: (state: State, action: PayloadAction<number>) => {
      return {
        ...state,
        holdingUserId: null,
        holdingMasterId: action.payload,
      };
    },
    setHoldingUserId: (state: State, action: PayloadAction<number>) => {
      return {
        ...state,
        holdingUserId: action.payload,
      };
    },
    setScriptId: (state: State, action: PayloadAction<number>) => {
      return {
        ...state,
        scriptId: action.payload,
      };
    },
    setSegmentId: (state: State, action: PayloadAction<number>) => {
      return {
        ...state,
        segmentId: action.payload,
        scriptId: null,
      };
    },
    resetHolding: (state: State) => {
      return { ...state, holdingList: initialState.holdingList };
    },
    setActiveInHolding: (
      state: State,
      action: PayloadAction<{ index: number; isActive: boolean }>,
    ) => {
      if (action.payload.isActive) {
        state.activeDetailIndex = action.payload.index;
      } else {
        state.activeDetailIndex = -1;
      }
    },
    setCurrentSymbolAndSegment: (
      state: State,
      action: PayloadAction<{ index: number; isActive: boolean }>,
    ) => {
      if (action.payload.isActive) {
        state.activeCloseIndex = action.payload.index;
      } else {
        state.activeCloseIndex = -1;
      }
    },

    markSelected: (
      state: State,
      action: PayloadAction<{ value: boolean; type: string }>,
    ) => {
      if (action.payload.type === 'All') {
        state.holdingList = state.holdingList.map(e => {
          const updated = { ...e };
          if (e.netQty !== 0) {
            updated.selected = action.payload.value;
          }
          return updated;
        });
      } else {
        state.holdingList = state.holdingList.map(e => {
          const updated = { ...e };
          if (e.netQty !== 0 && e.segment === action.payload.type) {
            updated.selected = action.payload.value;
          }
          return updated;
        });
      }
    },

    markSingleSelected: (
      state: State,
      action: PayloadAction<{ value: boolean; index: number }>,
    ) => {
      state.holdingList[action.payload.index].selected = action.payload.value;
    },
    setPropsInList: (
      state: State,
      action: PayloadAction<{
        id: number;
        message: string | null;
        isError: boolean | null;
        netQty?: number;
      }>,
    ) => {
      const rowIndex = state.holdingList.findIndex(
        e => e.id === action.payload.id,
      );
      if (rowIndex > -1) {
        const newProps = {
          message: action.payload.message,
          isError: action.payload.isError,
          netQty: state.holdingList[rowIndex].netQty,
        };
        if (action.payload.netQty !== undefined) {
          newProps.netQty = action.payload.netQty;
        }
        state.holdingList[rowIndex] = {
          ...state.holdingList[rowIndex],
          ...newProps,
        };
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getHoldingList.fulfilled, (state, action) => {
        if (
          action.payload.data.statusCode === 200 ||
          action.payload.data.statusCode === 201
        ) {
          state.m2mData = {};
          const holding: any[] = [];
          for (
            let index = 0;
            index < action.payload.data.data.length;
            index++
          ) {
            const element = action.payload.data.data[index];
            let totalM2M = 0;
            const positions = element.positions.filter(
              (e: IPosition) => e.netQty !== 0,
            );
            for (let jIndex = 0; jIndex < positions.length; jIndex++) {
              const e = positions[jIndex];
              if (e.refSlug === GlobalDataSegments.mcx) {
                e.refSlug = GlobalSegmentsSlug.mcx;
              } else if (e.identifier.startsWith('FUT')) {
                e.refSlug = GlobalSegmentsSlug.nfoFut;
              } else {
                e.refSlug = GlobalSegmentsSlug.nseOpt;
              }

              holding.push({
                ...e,
                user: element.userInfo.name,
                userId: element.userInfo.userId,
                id: element.userInfo.id,
                userIdd: element.userInfo.id,
              });
              state.m2mData[element.userInfo.id] = {
                ...state.m2mData[element.userInfo.id],
                [e.identifier]: e.mtm,
              };
              totalM2M = totalM2M + e.mtm;
            }
          }
          state.holdingList = holding;
          state.loading = false;
        } else {
          state.holdingList = initialState.holdingList;
          state.loading = false;
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

export const holdingReducer = holdingSlice.reducer;
export const holdingSelector = (state: RootState, name: keyof State) =>
  state.holding[name as keyof typeof state.holding];
export const holdingSymbolM2MSelector = (
  state: RootState,
  id: number,
  symbol: string,
) => state.holding.m2mData[id][symbol];
export const holdingM2MSelector = (state: RootState, id: number) =>
  state.holding.m2mData[id];
export const {
  resetHolding,
  setHoldingAdminId,
  setHoldingMasterId,
  setHoldingUserId,
  setScriptId,
  setSegmentId,
  setCurrentSymbolAndSegment,
  setMtM,
  setActiveInHolding,
  markSelected,
  setPropsInList,
  markSingleSelected,
} = holdingSlice.actions;
