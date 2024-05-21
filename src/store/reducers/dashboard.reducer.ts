import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ITrade } from '@interfaces/trade.interface';
import dashboardService from '@services/dashboard.service';
import { RootState } from '@store/index';

// Get Completed Trades List
export const getCompletedTrades = createAsyncThunk(
  `dashboard/getCompletedTrades`,
  async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data }: any = await dashboardService.getCompletedTrades();
    return data.data;
  },
);

// Get Pending Trades List
export const getPendingTrades = createAsyncThunk(
  `dashboard/getPendingTrades`,
  async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data }: any = await dashboardService.getPendingTrades();
    return data.data;
  },
);

// Get Rejected Trades List
export const getRejectedTrades = createAsyncThunk(
  `dashboard/getRejectedTrades`,
  async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data }: any = await dashboardService.getRejectedTrades();
    return data.data;
  },
);

export interface DashboardState {
  completed: {
    isLoading: boolean;
    rows: ITrade[];
  };
  pending: {
    isLoading: boolean;
    rows: ITrade[];
  };
  rejected: {
    isLoading: boolean;
    rows: ITrade[];
  };

  m2mAlerts: {
    isLoading: boolean;
    rows: ITrade[];
  };
}
const initialState: DashboardState = {
  completed: {
    isLoading: false,
    rows: [],
  },
  pending: {
    isLoading: false,
    rows: [],
  },
  rejected: {
    isLoading: false,
    rows: [],
  },

  m2mAlerts: {
    isLoading: false,
    rows: [],
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    liveTradeUpdateForDashboard: (
      state: DashboardState,
      action: PayloadAction<ITrade>,
    ) => {
      Object.assign(action.payload, {
        segment: { name: action.payload.segment },
        masterName: action.payload.masterId,
        role: action.payload.createdBy,
        user_id: action.payload.userId,
        user: {
          user_id: action.payload.userId,
          name: action.payload.name,
        },
        tradeSymbol: action.payload.product,
      });
      switch (action.payload.status) {
        case 'completed':
          state.completed.rows = [action.payload, ...state.completed.rows];
          break;
        case 'pending':
          state.pending.rows = [action.payload, ...state.pending.rows];
          break;
        case 'rejected':
          state.rejected.rows = [action.payload, ...state.rejected.rows];
          break;
        default:
          break;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getCompletedTrades.fulfilled, (state, action) => {
        state.completed.isLoading = false;
        state.completed.rows = action.payload.rows;
      })
      .addCase(getCompletedTrades.pending, state => {
        state.completed.isLoading = true;
      })
      .addCase(getCompletedTrades.rejected, state => {
        state.completed.isLoading = false;
      })
      .addCase(getPendingTrades.fulfilled, (state, action) => {
        state.pending.isLoading = false;
        state.pending.rows = action.payload.rows;
      })
      .addCase(getPendingTrades.pending, state => {
        state.pending.isLoading = true;
      })
      .addCase(getPendingTrades.rejected, state => {
        state.pending.isLoading = false;
      })
      .addCase(getRejectedTrades.fulfilled, (state, action) => {
        state.rejected.isLoading = false;
        state.rejected.rows = action.payload.rows;
      })
      .addCase(getRejectedTrades.pending, state => {
        state.rejected.isLoading = true;
      })
      .addCase(getRejectedTrades.rejected, state => {
        state.rejected.isLoading = false;
      });
  },
});

export const dashboardReducer = dashboardSlice.reducer;
export const dashboardSelector = (
  state: RootState,
  stateKey: keyof DashboardState,
) => state.dashboard[stateKey];
export const { liveTradeUpdateForDashboard } = dashboardSlice.actions;
