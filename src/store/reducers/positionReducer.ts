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
} from '@interfaces/common';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;

export const getPositionList = createAsyncThunk(
  `position/getPositionList`,
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
  positionList: IPosition[];
  positionAdminId: number | null;
  positionMasterId: number | null;
  positionUserId: number | null;
  scriptId: number | null | undefined;
  segmentId: number | null | undefined;
  m2mData: {
    //userIds
    [key: string]: {
      //symbols
      [key: string]: number;
    };
  };
  currentSymbol: string;
  activeSegment: ActiveSegmentType;
  currentRow: IPosition | null;
  activeDetailIndex: number;
  activeCloseIndex: number;
}
const initialState: State = {
  positionList: [],
  m2mData: {},
  loading: false,
  positionAdminId: 0,
  positionMasterId: 0,
  positionUserId: 0,
  scriptId: undefined,
  segmentId: undefined,
  currentSymbol: '',
  activeSegment: '',
  currentRow: null,
  activeDetailIndex: -1,
  activeCloseIndex: -1,
};

const isPendingAction = (action: AnyAction): action is PendingAction =>
  action.type.startsWith(positionSlice.name) &&
  action.type.endsWith('/pending');
const isRejectedAction = (action: AnyAction): action is RejectedAction =>
  action.type.startsWith(positionSlice.name) &&
  action.type.endsWith('/rejected');

const positionSlice = createSlice({
  name: 'position',
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
    setPositionAdminId: (state: State, action: PayloadAction<number>) => {
      return {
        ...state,
        positionMasterId: null,
        positionUserId: null,
        positionAdminId: action.payload,
      };
    },
    setPositionMasterId: (state: State, action: PayloadAction<number>) => {
      return {
        ...state,
        positionUserId: null,
        positionMasterId: action.payload,
      };
    },
    setPositionUserId: (state: State, action: PayloadAction<number>) => {
      return {
        ...state,
        positionUserId: action.payload,
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
    resetPosition: (state: State) => {
      return { ...state, positionList: initialState.positionList };
    },
    setActiveInPosition: (
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
        state.positionList = state.positionList.map(e => {
          const updated = { ...e };
          if (e.netQty !== 0) {
            updated.selected = action.payload.value;
          }
          return updated;
        });
      } else {
        state.positionList = state.positionList.map(e => {
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
      state.positionList[action.payload.index].selected = action.payload.value;
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
      const rowIndex = state.positionList.findIndex(
        e => e.id === action.payload.id,
      );
      if (rowIndex > -1) {
        const newProps = {
          message: action.payload.message,
          isError: action.payload.isError,
          netQty: state.positionList[rowIndex].netQty,
        };
        if (action.payload.netQty !== undefined) {
          newProps.netQty = action.payload.netQty;
        }
        state.positionList[rowIndex] = {
          ...state.positionList[rowIndex],
          ...newProps,
        };
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getPositionList.fulfilled, (state, action) => {
        if (
          action.payload.data.statusCode === 200 ||
          action.payload.data.statusCode === 201
        ) {
          state.m2mData = {};

          const position: any[] = [];

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

              position.push({
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
          state.positionList = position;
          state.loading = false;
        } else {
          state.positionList = initialState.positionList;
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

export const positionReducer = positionSlice.reducer;
export const positionSelector = (state: RootState, name: keyof State) =>
  state.position[name as keyof typeof state.position];
export const positionSymbolM2MSelector = (
  state: RootState,
  id: number,
  symbol: string,
) => state.position.m2mData[id][symbol];
export const positionM2MSelector = (state: RootState, id: number) =>
  state.position.m2mData[id];
export const {
  resetPosition,
  setPositionAdminId,
  setPositionMasterId,
  setPositionUserId,
  setScriptId,
  setSegmentId,
  setCurrentSymbolAndSegment,
  setMtM,
  setActiveInPosition,
  markSelected,
  setPropsInList,
  markSingleSelected,
} = positionSlice.actions;
