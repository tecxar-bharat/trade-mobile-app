import { GlobalDataSegments } from '@interfaces/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store/index';

export interface SocketState {
  isEstablishingConnection: boolean;
  isConnected: boolean;
  time: string;
  subscribe: Subscribe;
}
export interface Subscribe {
  Exchange: string;
  InstrumentIdentifier: string;
}
export interface UserStatus {
  id: number;
  status: boolean;
}
export interface IUpdateMarketRow {
  type: GlobalDataSegments;
  symbols: string[];
}
const initialState: SocketState = {
  isEstablishingConnection: false,
  isConnected: false,
  time: '',
  subscribe: {
    Exchange: '',
    InstrumentIdentifier: '',
  },
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    startConnecting: (state: SocketState) => {
      state.isEstablishingConnection = true;
    },
    connectionEstablished: (state: SocketState) => {
      state.isConnected = true;
      state.isEstablishingConnection = false;
    },
    updateTime: (state: SocketState, action: PayloadAction<string>) => {
      state.time = action.payload;
    },
    disconnect: (state: SocketState) => {
      state.isEstablishingConnection = false;
      state.isConnected = false;
    },
    subscribe: (state: SocketState, action: PayloadAction<Subscribe>) => {
      console.log(action);
      return state;
    },
    getLastQuote: (state: SocketState, action: PayloadAction<Subscribe>) => {
      return state;
    },
    getSymbols: (state: SocketState, action: PayloadAction<Subscribe>) => {
      console.log(action);
      return state;
    },

    getExecutetradeNotification: (
      state: SocketState,
      action: PayloadAction<Subscribe>,
    ) => {
      console.log(action);
      return state;
    },
    setMarketRowOrder: (
      state: SocketState,
      action: PayloadAction<IUpdateMarketRow>,
    ) => {
      console.log(action);
      return state;
    },
    unsubscribe: (state: SocketState, action: PayloadAction<Subscribe>) => {
      console.log(action);
      return state;
    },

    getStatus: (state: SocketState, action: PayloadAction<UserStatus>) => {
      console.log(action);
      return state;
    },
  },
});

export const socketReducer = socketSlice.reducer;
export const socketSelector = (state: RootState) => state.socket;
export const socketActions = socketSlice.actions;

export default socketSlice;
