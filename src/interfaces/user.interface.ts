import { Segments } from '@db/schemas/loggedUser.model';

export interface ILoginPayload {
  userId: string;
  password: string;
}

export type Role = 'superadmin' | 'admin' | 'master' | 'user' | 'broker';

export interface IRole {
  id: number;
  name: Role;
  isActive: boolean;
  slug: string | any;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: number;
  userId: string;
  name: string;
  mobile: string;
  email: string;
  maxMasters: number | null;
  maxUsers: number | null;
  partnershipPercentage: number | null;
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
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  role: IRole;
  totalMyUsers?: number;
  usedMargin?: number;
  changePasswordRequire?: boolean | null;
}

export interface IChangePassword {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface IResetPassword {
  newPassword?: string;
}

export interface IUserPayload {
  id?: number;
  userId: string;
  parentId: number;
  name: string;
  mobile: number;
  email: string;
  roleSlug: string;
  roleId: number;
  password: string;
  segments: any;
  otherM2mAlert: number;
  blockScriptGroupId?: number;
  quantityScriptGroupId?: number;
  otherM2mPercentage: number;
  orderBetweenHighLow: boolean;
  isLimitAllow: boolean;
  partnershipPercentage?: number;
  isApplyAutoSquareOff?: boolean;
}

export interface ILoggedUser {
  id: number;
  userId: string;
  name: string;
  mobile: string | null;
  email: string | null;
  maxMasters: number | null;
  maxUsers: number | null;
  partnershipPercentage: number | null;
  minBrokerage: number | null;
  masterMarginUserNseFut: number | null;
  maxMarginUserNseFut: number | null;
  orderBetweenHighLow: boolean | null;
  isLimitAllow: boolean | null;
  isApplyAutoSquareOff: boolean | null;
  editTrade: boolean | null;
  deleteTrade: boolean | null;
  manualTrade: boolean | null;
  maxLotUserMcx: number | null;
  masterLotMcx: number | null;
  maxLotUserNseOption: number | null;
  masterLotUserNseOption: number | null;
  isActive: boolean;
  roleId: number | null;
  parentId: number | null;
  otherM2mAlert: number | null;
  otherM2mPercentage: number | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  totalMyUsers: number | null;
  role: IRole;
  isCurrentLoggedIn: boolean;
  Cookie: string;
  segments: Segments[];
  alertSound: boolean;
  rememberMe: boolean;
  balance: number | null;
  changePasswordRequire: boolean | null;
  isNseOptionSell: boolean | null;
}

export interface ItradeExecData {
  status: string;
  userId: string;
  qty: number;
  price: number;
  product: string;
  comment: string;
  position: string;
}

export interface payloadDataInfo {
  q?: string;
  page: number | undefined;
  createdAt?: string;
  pageSize: number | undefined;
  filter?: IFilter;
  searchStr?: string;
}
export interface IFilter {
  userId?: number | undefined | null;
  segmentId?: number;
  scriptId?: number;
}
export interface ItradeExecData {
  status: string;
  userId: string;
  qty: number;
  price: number;
  product: string;
  comment: string;
  position: string;
}
