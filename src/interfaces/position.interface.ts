export interface IPositionData {
  segment: string;
  identifier: string;
  tradeSymbol: string;
  scriptId: number;
  script: string;
  totalBuyQty: number;
  buyAvgPriceWithBrokerage: number;
  totalSellQty: number;
  sellAvgPriceWithBrokerage: number;
  netQty: number;
  currentRate: number;
  mtm: number;
  Exchange: string | null;
  InstrumentIdentifier: string;
  LastTradeTime: number | null;
  ServerTime: number | null;
  AverageTradedPrice: number | null;
  BuyPrice: number | null;
  BuyPriceChange: number | null;
  BuyQty: number | null;
  Close: number | null;
  High: number | null;
  HighPriceChange: number | null;
  Low: number | null;
  LowPriceChange: number | null;
  LastTradePrice: number | null;
  LastTradePriceChange: number | null;
  LastTradeQty: number | null;
  Open: number | null;
  OpenInterest: number | null;
  QuotationLot: number | null;
  SellPrice: number | null;
  SellPriceChange: number | null;
  SellQty: number | null;
  TotalQtyTraded: number | null;
  Value: number | null;
  PreOpen: boolean | null;
  PriceChange: number | null;
  PriceChangePercentage: number | null;
  OpenInterestChange: number | null;
  MessageType: string | null;
}

export interface IPosition extends IPositionData {
  id: string;
  user: string;
  userId: string;
  userIdd: number;
  isActive: boolean | null;
  isClosePositionModal: boolean | null;
  selected: boolean | null;
  message: string | null;
  isError: boolean | null;
}

export interface IUserInfo {
  name: string;
  id: number;
  userId: string;
  partnershipPercentage: number;
  masterPartnershipPercentage: number;
}

export interface ICreatePosition {
  userInfo: IUserInfo;
  positions: IPositionData[];
}
