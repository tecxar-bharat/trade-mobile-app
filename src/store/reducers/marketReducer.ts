import {
  AnyAction,
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { RootState } from '@store/index';
import { IPosition, RealtimeResult } from '@interfaces/index';

import {
  ActiveSegmentSlugType,
  GlobalDataSegments,
  GlobalSegmentsSlug,
  SegmentSlugTypes,
  SegmentTypes,
} from '@interfaces/common';

import instrumentService from '@services/instrument.service';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
export interface INifty {
  LastTradePrice: number;
  PriceChange: number;
  LastTradePriceChange: number;
  PriceChangePercentage: number;
}

export const getAllSubscribedSymbols = createAsyncThunk(
  `market/getAllSubscribedSymbols`,
  async () => {
    try {
      const { data } = await instrumentService.getAllSubscribedSymbols();
      return data;
    } catch (error: any) {
      throw error;
    }
  },
);

const setMarketSymbolData = (
  state: MarketState,
  payload: RealtimeResult,
  listUpdate?: boolean,
) => {
  if (state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier]) {
    if (
      state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier]
        .BuyPrice !== payload.BuyPrice
    )
      state[payload.SegmentSlug].symbols[
        payload.InstrumentIdentifier
      ].BuyPrice = payload.BuyPrice;

    if (
      state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier]
        .SellPrice !== payload.SellPrice
    )
      state[payload.SegmentSlug].symbols[
        payload.InstrumentIdentifier
      ].SellPrice = payload.SellPrice;

    if (
      state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier]
        .LastTradePrice !== payload.LastTradePrice
    )
      state[payload.SegmentSlug].symbols[
        payload.InstrumentIdentifier
      ].LastTradePrice = payload.LastTradePrice;

    if (
      state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier]
        .PriceChange !== payload.PriceChange
    ) {
      state[payload.SegmentSlug].symbols[
        payload.InstrumentIdentifier
      ].PriceChange = payload.PriceChange;
      state[payload.SegmentSlug].symbols[
        payload.InstrumentIdentifier
      ].PriceChangePercentage = payload.PriceChangePercentage;
      state[payload.SegmentSlug].symbols[
        payload.InstrumentIdentifier
      ].PriceChangeWithPercentage = `${payload.PriceChange} (${payload.PriceChangePercentage})`;
    }

    if (
      state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier].High !==
      payload.High
    )
      state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier].High =
        payload.High;

    if (
      state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier].Low !==
      payload.Low
    )
      state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier].Low =
        payload.Low;

    if (
      state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier]
        .BuyPriceChange !== payload.BuyPriceChange
    )
      state[payload.SegmentSlug].symbols[
        payload.InstrumentIdentifier
      ].BuyPriceChange = payload.BuyPriceChange;

    if (
      state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier]
        .SellPriceChange !== payload.SellPriceChange
    )
      state[payload.SegmentSlug].symbols[
        payload.InstrumentIdentifier
      ].SellPriceChange = payload.SellPriceChange;

    if (
      state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier]
        .HighPriceChange !== payload.HighPriceChange
    )
      state[payload.SegmentSlug].symbols[
        payload.InstrumentIdentifier
      ].HighPriceChange = payload.HighPriceChange;

    if (
      state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier]
        .LowPriceChange !== payload.LowPriceChange
    )
      state[payload.SegmentSlug].symbols[
        payload.InstrumentIdentifier
      ].LowPriceChange = payload.LowPriceChange;

    if (
      state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier]
        .LastTradePriceChange !== payload.LastTradePriceChange
    )
      state[payload.SegmentSlug].symbols[
        payload.InstrumentIdentifier
      ].LastTradePriceChange = payload.LastTradePriceChange;
  } else {
    const name = payload.InstrumentIdentifier.split('_');
    state[payload.SegmentSlug].symbols[payload.InstrumentIdentifier] = {
      ...payload,
      PriceChangeWithPercentage: `${payload.PriceChange} (${payload.PriceChangePercentage})`,
      Name: `${name[1]} ${name[2]}${
        payload.InstrumentIdentifier.startsWith('OPT')
          ? ` ${name[3]} ${name[4]}`
          : ``
      }`,
    };
    if (listUpdate) {
      if (
        state[payload.SegmentSlug].list.indexOf(
          payload.InstrumentIdentifier,
        ) === -1
      ) {
        state[payload.SegmentSlug].list.push(payload.InstrumentIdentifier);
      }
    }
  }
};

export type MarketState = {
  [GlobalSegmentsSlug.nfoFut]: {
    list: string[];
    symbols: { [key: string]: RealtimeResult };
  };
  [GlobalSegmentsSlug.mcx]: {
    list: string[];
    symbols: { [key: string]: RealtimeResult };
  };
  [GlobalSegmentsSlug.nseOpt]: {
    list: string[];
    symbols: { [key: string]: RealtimeResult };
  };
  currentSymbol: string;
  activeTradeDiv: ActiveSegmentSlugType;

  niftyPrice: INifty;
  bankNiftyPrice: INifty;
  loading: boolean;
};

const initialState: MarketState = {
  [GlobalSegmentsSlug.nfoFut]: {
    list: [],
    symbols: {},
  },
  [GlobalSegmentsSlug.mcx]: {
    list: [],
    symbols: {},
  },
  [GlobalSegmentsSlug.nseOpt]: {
    list: [],
    symbols: {},
  },
  currentSymbol: '',
  activeTradeDiv: '',

  niftyPrice: {
    LastTradePrice: 0,
    PriceChange: 0,
    LastTradePriceChange: 0,
    PriceChangePercentage: 0,
  },
  bankNiftyPrice: {
    LastTradePrice: 0,
    PriceChange: 0,
    LastTradePriceChange: 0,
    PriceChangePercentage: 0,
  },
  loading: false,
};

const isPendingAction = (action: AnyAction): action is PendingAction =>
  action.type.startsWith(marketSlice.name) && action.type.endsWith('/pending');
const isRejectedAction = (action: AnyAction): action is RejectedAction =>
  action.type.startsWith(marketSlice.name) && action.type.endsWith('/rejected');

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    unSubscribeSymbol: (
      state: MarketState,
      {
        payload,
      }: PayloadAction<{
        Exchange: SegmentTypes;
        InstrumentIdentifier: string;
      }>,
    ) => {
      let SegmentSlug: SegmentSlugTypes | null = null;
      if (payload.Exchange === GlobalDataSegments.mcx) {
        SegmentSlug = GlobalSegmentsSlug.mcx;
      } else {
        if (payload.InstrumentIdentifier.startsWith('FUT')) {
          SegmentSlug = GlobalSegmentsSlug.nfoFut;
        } else {
          SegmentSlug = GlobalSegmentsSlug.nseOpt;
        }
      }
      if (SegmentSlug) {
        const symbolIndex = state[SegmentSlug].list.indexOf(
          payload.InstrumentIdentifier,
        );
        if (symbolIndex > -1) {
          state[SegmentSlug].list.splice(symbolIndex, 1);
        }
        delete state[SegmentSlug].symbols[payload.InstrumentIdentifier];
      }
    },
    setMarketData: (
      state: MarketState,
      { payload }: PayloadAction<RealtimeResult>,
    ) => {
      setMarketSymbolData(state, payload, true);
    },
    setMarketDataOnlySymbols: (
      state: MarketState,
      { payload }: PayloadAction<RealtimeResult>,
    ) => {
      setMarketSymbolData(state, payload);
    },
    clearMarketData: () => {
      return { ...initialState };
    },
    setQtyByPosition: (
      state: MarketState,
      {
        payload: { positions, segmentType },
      }: PayloadAction<{
        positions: IPosition[];
        segmentType: SegmentSlugTypes;
      }>,
    ) => {
      for (let index = 0; index < state[segmentType].list.length; index++) {
        const element = state[segmentType].list[index];
        const positionIndex = positions.findIndex(e => {
          return e.identifier === element;
        });
        if (positionIndex > -1) {
          state[segmentType].symbols[element].LastTradeQty =
            positions[positionIndex].netQty;
        }
      }
    },
    setActiveTradeDiv: (
      state,
      { payload }: PayloadAction<ActiveSegmentSlugType>,
    ) => {
      state.activeTradeDiv = payload;
    },
    setCurrentSymbol: (state, { payload }: PayloadAction<string>) => {
      if (state.currentSymbol === payload) {
        state.currentSymbol = '';
      } else {
        state.currentSymbol = payload;
      }
    },
    getNiftyPrice: (state: MarketState, action: PayloadAction<INifty>) => {
      if (
        state.niftyPrice.LastTradePrice !== action.payload.LastTradePrice ||
        state.niftyPrice.PriceChange !== action.payload.PriceChange
      ) {
        state.niftyPrice = action.payload;
      }
    },

    getBankNiftyPrice: (state: MarketState, action: PayloadAction<INifty>) => {
      if (
        state.bankNiftyPrice.LastTradePrice !== action.payload.LastTradePrice ||
        state.bankNiftyPrice.PriceChange !== action.payload.PriceChange
      ) {
        state.bankNiftyPrice = action.payload;
      }
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getAllSubscribedSymbols.fulfilled, (state, action) => {
        if (
          action.payload.statusCode === 200 ||
          action.payload.statusCode === 201
        ) {
          const newData: MarketState = {
            [GlobalSegmentsSlug.nfoFut]: {
              list: [],
              symbols: {},
            },
            [GlobalSegmentsSlug.mcx]: {
              list: [],
              symbols: {},
            },
            [GlobalSegmentsSlug.nseOpt]: {
              list: [],
              symbols: {},
            },
            currentSymbol: '',
            activeTradeDiv: '',
            niftyPrice: {
              LastTradePrice: 0,
              PriceChange: 0,
              LastTradePriceChange: 0,
              PriceChangePercentage: 0,
            },
            bankNiftyPrice: {
              LastTradePrice: 0,
              PriceChange: 0,
              LastTradePriceChange: 0,
              PriceChangePercentage: 0,
            },
            loading: false,
          };

          for (
            let index = 0;
            index < action.payload.data.subscribed.length;
            index++
          ) {
            const element = action.payload.data.subscribed[index];
            const split: string[] = element.split(':');
            if (split.length > 1) {
              newData[
                split[0] as
                  | GlobalSegmentsSlug.nfoFut
                  | GlobalSegmentsSlug.mcx
                  | GlobalSegmentsSlug.nseOpt
              ].list.push(split[1]);
              // newData[split[0] as keyof MarketState].symbols[split[1]] = {};
            }
          }
          state[GlobalSegmentsSlug.nfoFut] = newData[GlobalSegmentsSlug.nfoFut];
          state[GlobalSegmentsSlug.mcx] = newData[GlobalSegmentsSlug.mcx];
          state[GlobalSegmentsSlug.nseOpt] = newData[GlobalSegmentsSlug.nseOpt];
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

export const marketReducer = marketSlice.reducer;
export const marketLocalStateSelector = (
  state: RootState,
  name: keyof MarketState,
) => state.market[name];
export const marketListSelector = (state: RootState, type: SegmentSlugTypes) =>
  state.market[type].list;
export const marketSelector = (
  state: RootState,
  type: SegmentSlugTypes,
  identifier: string,
  key: keyof RealtimeResult,
) => state.market[type].symbols[identifier]?.[key];
export const marketRowSelector = (
  state: RootState,
  type: SegmentSlugTypes,
  identifier: string,
) => state.market[type].symbols[identifier];
export const {
  setMarketData,
  setMarketDataOnlySymbols,
  unSubscribeSymbol,
  clearMarketData,
  setQtyByPosition,
  setActiveTradeDiv,
  setCurrentSymbol,
  getNiftyPrice,
  getBankNiftyPrice,
} = marketSlice.actions;
