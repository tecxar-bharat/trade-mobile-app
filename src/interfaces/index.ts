import { Segment } from '@db/schemas/loggedUser.model';
import {
  GlobalSegmentsSlug,
  SegmentSlugTypes,
  SegmentTypes,
} from '@interfaces/common';

export interface RealtimeResult {
  Exchange: SegmentTypes;
  SegmentSlug: SegmentSlugTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  InstrumentIdentifier?: string | any;
  identifier?: string;
  LastTradeTime?: number;
  ServerTime?: number;
  AverageTradedPrice?: number;
  BuyPrice?: number;
  BuyPriceChange?: number;
  BuyQty?: number;
  Close?: number;
  High?: number;
  HighPriceChange?: number;
  Low?: number;
  LowPriceChange?: number;
  LastTradePrice?: number;
  LastTradePriceChange?: number;
  LastTradeQty?: number;
  Open?: number;
  OpenInterest?: number;
  QuotationLot?: number;
  SellPrice?: number;
  SellPriceChange?: number;
  SellQty?: number;
  TotalQtyTraded?: number;
  Value?: number;
  PreOpen?: boolean;
  PriceChange?: number;
  PriceChangeWithPercentage?: string;
  PriceChangePercentage?: number;
  OpenInterestChange?: number;
  MessageType?: string;
  Name: string;
}
export interface INotification {
  comment: string;
  position: string;
  price: number;
  product: string;
  qty: string;
  status: string;
  userId: string;
}
export interface ILedgerListRowCount {
  data: ITradeList[];
  count: number;
  fetchMoreLoading: boolean;
  page: number;
  rowPerPage: number;
  totalCount: number;
  loading: boolean;
}
export interface IIdentifier {
  id: number;
  identifier: string;
  tradeSymbol: string;
}

export interface IAllScripts {
  id: number;
  name: string;
}

export interface IAllOnlyUsersName {
  id: number;
  name: string;
}

export interface IUpdateTrade {
  id?: number;
  status: string;
}

export interface IAdminNameList {
  id: number;
  name: string;
  user_id: string;
  max_users: number;
  manual_trade: number;
  edit_trade: number;
  delete_trade: number;
  min_brokerage: number | null;
  min_mcx_brokerage: number | null;
  role: IRole;
  partnership_percentage?: number;
}

export interface IRole {
  id: number;
  name: string;
  slug: string;
}

export interface ISegment {
  id: number;
  name: string;
  slug: string;
  refSlug: string;
}

export interface ISegments {
  id: number;
  segmentId: number;
  marginType: string;
  segment: Segment;
}
export interface IStatus {
  isActive?: boolean;
  onlyPositionSquareOff?: boolean;
}
export interface IPosition {
  segment: string;
  user: string;
  userId: number;
  identifier: string;
  tradeSymbol: string;
  scriptId: string;
  script: string;
  totalBuyQty: number;
  buyAvgPrice: number;
  totalSellQty: number;
  buyAvgPriceWithBrokerage: number;
  sellAvgPriceWithBrokerage: number;
  sellAvgPrice: number;
  netQty: number;
  mtm: number;
  currentRate?: number;
  refSlug: GlobalSegmentsSlug;
  id: number;
}

export interface IWatchScripts {
  id: number;
  identifier: string;
  script: Script;
  segment: Segment;
}

export interface Script {
  name: string;
  symbol: string;
}

export interface SegmentRef {
  refSlug: string;
}

export interface ITradeList {
  id: number;
  userId: number;
  segmentId: number;
  scriptId: number;
  lot: number;
  qty: number;
  price: number;
  priceWithBrokerage: number;
  total: number;
  netTotal: number;
  brokerage: number;
  brokeragePercentage: number;
  position: string;
  type: string;
  status: string;
  instrumentId: number;
  ipAddress: string;
  comment: string;
  createdBy: number;
  updatedBy: number;
  executedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  segment: SegmentRef;
  script: Script;
  instrument: Instrument;
  user: User;
  tradeSymbol: string;
  userName: string;
}
export interface Script {
  id: number;
  name: string;
}

export interface Instrument {
  id: number;
  tradeSymbol: string;
  identifier: string;
}

export interface User {
  id: number;
  name: string;
  user_id: string;
  mobile: any;
}

export interface IFormScripts {
  id: number;
  symbol: string;
  name: string;
}

export interface IGetAccoutSegments {
  id: number;
  segmentId: number;
  marginType: string;
  userId: number;
  brokerage: number;
  noOfMaxScript: any;
  allScriptsTotalAmount: number;
  noOfMaxLotPerStock: any;
  totalMaxLot: any;
  maxAmountOrLotPerScrips: number;
  maxPositionLimit: number;
  isFreshSellLimitAllow: boolean;
  segment: SegmentRef;
  scripts: any[];
}

export interface ITradeListRowCount {
  data: ITradeList[];
  count: number;
  fetchMoreLoading: boolean;
  page: number;
  rowPerPage: number;
  totalCount: number;
  loading: boolean;
}
export interface ITradeList {
  id: number;
  userId: number;
  segmentId: number;
  scriptId: number;
  lot: number;
  qty: number;
  price: number;
  priceWithBrokerage: number;
  total: number;
  netTotal: number;
  brokerage: number;
  brokeragePercentage: number;
  position: string;
  type: string;
  status: string;
  instrumentId: number;
  ipAddress: string;
  comment: string;
  createdBy: number;
  updatedBy: number;
  executedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  segment: Segment2;
  script: Script;
  instrument: Instrument;
  user: User;
  tradeSymbol: string;
  userName: string;
}
export interface IShortTrade {
  symbol: string;
  userId: string;
  sellPrice: string;
  sellQty: string;
  sellExecutedAt: string;
  buyQty: number;
  buyPrice: number;
  buyExecutedAt: string;
  firstOrder: string;
}
export interface IShortTradePayload {
  valanId?: string;
  startDate?: string;
  endDate?: string;
  adminId?: number;
  masterId?: number;
  userId?: number;
  scriptId?: number;
  tradeMinute?: number;
}
