import { IRole } from './user.interface';

export interface ILogin {
  email: string;
  password: string;
  deviceToken: string;
  platform: string;
}
export interface ISignUp {
  first_name: string;
  last_name: string;
  mobile: number;
  roleId: number;
}

export interface IResendOTP {
  userId: number;
  phoneNumber: string;
}
export interface IVerifyOtp {
  otp: string;
  userId: number;
  phoneNumber: string;
}

export interface IRegister2 {
  email: string;
  id: number;
  password: string;
  confirmPassword: string;
  referral_code: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IRoles {
  createdAt: string;
  id: number;
  isActive: boolean;
  name: string;
  slug: string;
  updatedAt: string;
}

export interface IBalance {
  id: number;
  balance: string;
  user_id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
export interface IUser {
  createdAt: string;
  currency_id: string | null;
  email: string;
  expiration_time: string;
  first_name: string;
  id: number;
  isActive: boolean;
  last_name: string;
  mobile: string;
  otp: string;
  password: string;
  roleId: number;
  roles: IRoles;
  role: IRole;
  updatedAt: string;
  verified: boolean;
  profileImage: string;
  city: string | null;
  dob: string | null;
  gender: string | null;
  language: string | null;
  subscription_id: number;
  my_referral: string | null;
  commission: number | null;
  total_referral: number | null;
  balance: IBalance | null;
  peer: number;
  Cookie: string;
  segments: ISegments[];
  changePasswordRequire: boolean;
  isNseOptionSell: boolean | null;
}
export interface ISegments {
  id: number;
  segmentId: number;
  marginType: string;
  segment: ISegment;
}
export interface ISegment {
  id: number;
  name: string;
  slug: string;
  refSlug: string;
}

export interface IUpdateUser {
  id: number;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  city: string;
  dob: string;
  currency_id: string;
  gender: string;
  profileImage: string | null;
}

export interface IUpdateProfileImage {
  profileImage: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
