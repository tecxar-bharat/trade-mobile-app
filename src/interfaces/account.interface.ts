import { IRole } from '@interfaces/user.interface';

export interface IAdminAccount {
  id: number;
  userId: string;
  name: string;
  mobile: string;
  email: string;
  maxMasters: number | null;
  maxUsers: number | null;
  partnershipPercentage: string | null;
  roleId: number;
  createdBy: number;
  updatedBy: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  role: IRole;
}

export interface IAdminAccountRowCount {
  data: IAdminAccount[];
  count: number;
  fetchMoreLoading: boolean;
  page: number;
  rowPerPage: number;
  totalCount: number;
  loading: boolean;
}
export interface IMasterAccountRowCount {
  data: IMasterAccount[];
  count: number;
  fetchMoreLoading: boolean;
  page: number;
  rowPerPage: number;
  totalCount: number;
  loading: boolean;
}
export interface IMasterAccount {
  id: number;
  userId: string;
  name: string;
  mobile: string;
  email: string;
  maxMasters: number | null;
  maxUsers: number | null;
  partnershipPercentage: string | null;
  minBrokerage: number | null;
  masterMargin: number | null;
  maxMargin: number | null;
  roleId: number;
  totalMyUsers?: number | null;
  totalBrokerage?: number;
  parentId: number | null;
  otherM2mAlert: number | null;
  otherM2mPercentage: number | null;
  otherSquareOff: number | null;
  createdBy: number;
  updatedBy: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  role: IRole;
  uplineM2M: number | null;
  totalM2m: number | null;
  usedMargin: number | null;
  masterMarginUserNseFut: number | null;
}
export interface IUserAccount {
  id: number;
  userId: string;
  name: string;
  mobile: any;
  email: any;
  maxMasters: any;
  maxUsers: any;
  partnershipPercentage: any;
  minBrokerage: any;
  masterMarginUserNseFut: any;
  maxMarginUserNseFut: any;
  maxLotUserMcx: any;
  masterLotMcx: any;
  maxLotUserNseOption: any;
  masterLotUserNseOption: any;
  roleId: number;
  parentId: number;
  otherM2mAlert: number;
  otherM2mPercentage: number;
  otherSquareOff: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  totalMyUsers: number;
  role: Role;
  usedMargin: number;
  userMargin: number;
  isActive: boolean;
  totalBrokerage: number;
  totalM2m: number;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
}
export interface IAccount {
  id: number;
  userId: string;
  name: string;
  email: string;
  password?: string;
  maxMasters: number | null;
  maxUsers: number | null;
  segment: number[];
  partnershipPercentage: string | null;
  minBrokerage: number | null;
  masterMargin: number | null;
  maxMargin: number | null;
  roleId: number;
  masterId: number;
  parentId: number | null;
  otherM2mAlert: number | null;
  otherM2mPercentage: number | null;
  otherSquareOff: number | null;
  createdBy: number;
  updatedBy: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  role: IRole;
  isActive: boolean;
  isOnline?: boolean;
}

export interface ISegment {
  id?: number | any;
  name: string;
  slug: string;
}
export interface IScripts {
  id: number;
  scriptId: number;
  size: number;
  brokerage: null;
}
export interface ISingleUser {
  id: number;
  segmentId: number;
  marginType: string;
  userId: number;
  brokerageIntraday: number;
  brokerageCF: number;
  noOfMaxScript: null;
  allScriptsTotalAmount: number;
  noOfMaxLotPerStock: null;
  totalMaxLot: null;
  maxAmountOrLotPerScrips: number;
  maxPositionLimit: number;
  isFreshSellLimitAllow: boolean;
  segment: ISegment;
  scripts: IScripts[];
  name: string;
  mobile: string;
  email: string;
  password?: string;
  maxMasters: number | null;
  maxUsers: number | null;
  partnershipPercentage?: string | null;
  minBrokerage: number | null;
  masterMargin: number | null;
  maxMargin: number | null;
  roleId: number;
  parentId: number | null;
  otherM2mAlert: number | null;
  otherM2mPercentage: number | null;
  otherSquareOff: number | null;
  createdBy: number;
  updatedBy: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  role: IRole;
  segmentName: ISegment[];
  maxMarginUserNseFut?: number;
  maxLotUserMcx?: number;
  maxLotUserNseOption?: number;
  myUsers?: any;
}

export interface INseFormScripts {
  id: number;
  symbol: string;
  name: string;
}
export interface IQuantityScript {
  id: number;
  name: string;
  qtyScripts: QtyScript[];
}
export interface QtyScript {
  scriptId: number;
  qty: number;
  maxQty: number;
  script: ScriptName;
}
export interface ScriptName {
  name: string;
}
export interface IUserAccountRowCount {
  data: IUserAccount[];
  count: number;
  fetchMoreLoading: boolean;
  page: number;
  rowPerPage: number;
  totalCount: number;
  loading: boolean;
}

export interface IUserList {
  data: IUserAccount[];
  count: number;
  fetchMoreLoading: boolean;
  page: number;
  rowPerPage: number;
  totalCount: number;
  loading: boolean;
}

export interface IFields {
  key: string;
  label: string;
}
export interface ISegmentSummary {
  id?: number;
  name: string;
  slug: string;
  refSlug: string;
}
export interface InstrumentQuery {
  segmentId: number;
  scriptId: number;
  expiry: string;
  optionType?: string;
  strikePrice?: string;
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
export interface ISegmentScript {
  scriptId: number;
  script: Script;
}
export interface Script {
  symbol: string;
  name: string;
}
export interface InstrumentResponse {
  id: number;
  identifier: string;
  tradeSymbol: string;
}

export interface IBrokerAccount {
  masterName: string;
  adminName: string;
  userId: string;
  name: string;
  lastLogin: string;
  loginIp: string;
  createdAt: string;
  brokerBrokerage?: number;
  totalBrokerUsers: number[];
  isOnline?: boolean;
}
export interface IHoliday {
  id: number;
  name: string;
  date: string;
  firstSession: boolean;
  secondSession: boolean;
  segmentId: number;
  segmentName?: string;
}