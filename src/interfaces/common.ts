import { NavigationProp } from '@react-navigation/native';

export interface INavigation {
  navigation: NavigationProp<any>;
}

export interface apiResponse<T> {
  data: T;
  message: string;
  redirect: string;
  status: string;
  error?: string;
  statusCode?: number;
}

export interface apiResponseWithRow<T> {
  data: {
    rows: T;
    count: number;
  };
  message: string;
  redirect: string;
  status: string;
}

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

export interface IAllScripts {
  id: number;
  name: string;
}

export interface IExpiry {
  id: number;
  expiry: string;
}
export interface IStrikePrice {
  id: number;
  strikePrice: string;
}

export interface InstrumentQuery {
  segmentId: number;
  scriptId: number;
  expiry: string;
  optionType?: string;
  strikePrice?: string;
}
export interface InstrumentResponse {
  id: number;
  identifier: string;
  tradeSymbol: string;
}

export interface IM2mAlerts {
  masterName: string;
  userId: string;
  name: string;
  m2mText: string;
}

export interface IAllOnlyUsersName {
  id: number;
  name: string;
}

export interface IUpdateTrade {
  id?: number;
  status: string;
}

export interface ILedgerList {
  adminName: string;
  masterName: string;
  user: {
    user_id: string;
    name: string;
  };
  balance: string;
}

export interface ICashLedgerTable {
  id?: number;
  date: string;
  valanId: string;
  debit: string;
  credit: string;
  description: string;
  caseType?: string;
  masterName: string;
  adminName: string;
  balance: number;
  userId: string;
  role: string;
  isExtraRow?: boolean;
  isExtraRow1?: boolean;
  key: number;
  user: User;
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
  min_mcx_brokerage_percentage: number | null;
  nse_opt_min_lot_wise_brokerage: number | null;
  nse_opt_delivery_multiplication: number | null;
  nse_opt_intraday_multiplication: number | null;
  delivery_multiplication: number | null;
  intraday_multiplication: number | null;
  role: IRole;
  partnership_percentage?: number;
  parent_id?: number;
}
export interface IStatus {
  isActive?: boolean;
  onlyPositionSquareOff?: boolean;
}

export interface INotification {
  segment: string;
  masterId: string;
  name: string;
  type: string;
  lot: number;
  total: number;
  ipAddress: string;
  createdBy: string;
  executedAt: string;
  status: string;
  userId: string;
  qty: number;
  price: number;
  product: string;
  comment: string;
  position: string;
}

export interface IRole {
  id: number;
  name: string;
  slug: string | undefined;
}

export interface IPosition {
  High: number | undefined;
  Low: number | undefined;
  QuotationLot: number | undefined;
  sellAvgPriceWithBrokerage: number;
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
  sellAvgPrice: number;
  netQty: number;
  mtm: number;
  currentRate?: number;
  isTotalRow?: boolean;
  refSlug?: any;
  id?: number;
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
  adminName?: string;
  masterName?: string;
  balance?: string;
  role: string;
}
export interface ITradeListRowCount {
  rows: ITradeList[];
  count: number;
}

export interface Segment2 {
  id: number;
  name: string;
  slug?: string;
}

export interface Script {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  user_id: string;
  mobile: string;
}

export interface ISegmentScript {
  scriptId: number;
  script: Script;
}

export interface Script {
  symbol: string;
  name: string;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  noOfMaxScript: any;
  allScriptsTotalAmount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  noOfMaxLotPerStock: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  totalMaxLot: any;
  maxAmountOrLotPerScrips: number;
  maxPositionLimit: number;
  isFreshSellLimitAllow: boolean;
  segment: Segment;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scripts: any[];
}

export interface Segment {
  id: number;
  name: string;
}

export interface Instrument {
  id: number;
  tradeSymbol: string;
  identifier: string;
}

export enum GlobalDataSegments {
  // eslint-disable-next-line no-unused-vars
  nfo = 'NFO',
  // eslint-disable-next-line no-unused-vars
  mcx = 'MCX',
  // eslint-disable-next-line no-unused-vars
  nseIndex = 'NSE_IDX',
}
export type ActiveSegmentType = GlobalDataSegments | '';
export type SegmentTypes = GlobalDataSegments;

export enum GlobalSegmentsSlug {
  // eslint-disable-next-line no-unused-vars
  nfoFut = 'nse_fut',
  // eslint-disable-next-line no-unused-vars
  mcx = 'mcx',
  // eslint-disable-next-line no-unused-vars
  nseOpt = 'nse_option',
}
export type ActiveSegmentSlugType = GlobalSegmentsSlug | '';
export type SegmentSlugTypes = GlobalSegmentsSlug;

export interface ITempSymbols {
  identifier: string;
  Exchange: SegmentTypes;
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

export interface IFilterConfig {
  name: string;
  label: string;
  type: string;
  clearable?: boolean;
}

export type Status = 'active' | 'inActive';
export interface IFilter {
  userId?: number | undefined | null;
  masterId?: number | undefined | null;
  adminId?: number | undefined | null;
  brokerId?: number | undefined | null;
  valanId?: string | undefined | null;
  segmentId?: number;
  scriptId?: number;
  tradeMinute?: string;
  tradeDate?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  searchByTradeStatus?: string;
  fromAfter?: string;
  fromBefore?: string;
  tradePositionSubType?: string;
  status?: Status | undefined | null;
}

export interface payloadDataInfo {
  q?: string;
  page: number | undefined;
  createdAt?: string;
  pageSize: number | undefined;
  filter?: IFilter;
  searchStr?: string;
}

export interface IMtMData {
  //userIds
  [key: string]: {
    //symbols
    [key: string]: number;
  };
}
