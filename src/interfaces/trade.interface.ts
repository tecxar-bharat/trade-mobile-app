import { typesKeyLabel } from '@utils/helpers';

export interface ITradeTable {
  id: number;
  userId: number;
  segmentId: number;
  scriptId: number;
  lot: number;
  qty: number;
  price: number;
  priceWithBrokerage: number;
  total: number;
  netQty?: number | undefined;
  netTotal: number;
  brokerage: number;
  brokeragePercentage: number;
  brokerBrokerage: number | null;
  brokerBrokeragePercentage: number | null;
  position: string;
  type: keyof typeof typesKeyLabel;
  status: string;
  instrumentId: number;
  ipAddress: string;
  comment: string;
  isSettlement: boolean;
  createdBy: number;
  updatedBy: number;
  executedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  user_id: string;
  name: string;
  tradeSymbol: string;
  role: string | undefined;
  segment: Segment;
  script: Script;
  instrument: Instrument;
  user: User;

  userName: string;
  adminName?: string;
  masterName?: string;
  balance?: string;
}

export interface ITrade {
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
  segment: Segment;
  script: Script;
  instrument: Instrument;
  user: User;
  tradeSymbol: string;
  userName: string;
  adminName?: string;
  masterName?: string;
  balance?: string;
  masterId?: string;
  product?: string;
  name?: string;
}

export interface Segment {
  id: number;
  name: string;
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

export interface Instrument {
  id: number;
  tradeSymbol: string;
  identifier: string;
}
