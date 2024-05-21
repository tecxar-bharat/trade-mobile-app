export interface IColor {
  value: string;
  primary: string;
  primaryLight: string;
  backgroundColor: string;
  backgroundColor1: string;
  red: string;
  alert: string;
  green: string;
  blue: string;
  cancelBtn: string;
  grey: string;
  textColor: string;
  borderColor: string;
  greyText: string;
  greyDark: string;
  white: string;
  indicator: string;
  bcolor: string;
  textOne: string;
  cardBackround: string;
  orange: string;
  redBg: string;
  greenBg: string;
  marqueeBg: string;
  marqueeText: string;
  marqueeBorder: string;
}

export interface IViewColor {
  text: string;
  bg: string;
}

export interface IStatusColor {
  green: IViewColor;
  red: IViewColor;
}
export interface ICommonColor {
  white: string;
  black: string;
  primary: string;
  primaryLight: string;
  divider: string;
  grayScale1: string;
  grayScale3: string;
  grayScale4: string;
  grayScale5: string;
  grayScale7: string;
  grayScale8: string;
  dark2: string;
  primary5: string;
  primaryD: string;
  primaryTransparent: string;
  placeHolderColor: string;
  borderColor: string;
  inputFocusColor: string;
  transparent: string;
  darkBg: string;
  redColor: string;
  lightRed: string;
  lightGray: string;
  orange: string;
  blue: string;
  modalBg: string;
  disabledColor: string;
  alertColor: string;
  transparentSilver: string;
  greenColor: string;
  new_primary: string;
  red_button: string;
  new_secondary: string;
  tabBar: string;
  status: IStatusColor;
  textOne: string;
}

//App colors
export const LightColor: IColor = {
  value: 'light',
  primary: '#F8961E',
  primaryLight: '#ffc98647',
  backgroundColor: '#FFFFFF',
  backgroundColor1: '#EBECEE',
  red: '#DF514C',
  alert: '#de2935',
  green: '#4CAF50',
  blue: '#4184F3',
  cancelBtn: '#DF514C',
  grey: '#EFEFEF',
  textColor: '#2A3547',
  borderColor: '#F0F0F0',
  greyText: '#A3A3A3',
  greyDark: '#676767',
  white: '#000000',
  indicator: '#60ADFF',
  bcolor: '#DFE5EF',
  textOne: '#FFFFFF',
  cardBackround: '#FFFFFF',
  orange: '#ff5722',
  greenBg: '#e8f4e9',
  redBg: '#F4D0CC',
  marqueeBg: '#FFFAEB',
  marqueeText: '#444444',
  marqueeBorder: '#f4e4af',
};

export const DarkColor: IColor = {
  value: 'dark',
  primary: '#F8961E',
  primaryLight: '#ffc98647',
  backgroundColor: '#181A20',
  backgroundColor1: '#EBECEE',
  red: '#DF514C',
  alert: '#de2935',
  green: '#4CAF50',
  blue: '#4184F3',
  cancelBtn: '#DF514C',
  grey: '#EFEFEF',
  textColor: '#FFFFFF',
  borderColor: '#F0F0F0',
  greyText: '#A3A3A3',
  greyDark: '#676767',
  white: '#FFFFFF',
  indicator: '#60ADFF',
  bcolor: '#DFE5EF',
  textOne: '#000000',
  cardBackround: '#363636',
  orange: '#ff5722',
  greenBg: '#e8f4e9',
  redBg: '#F4D0CC',
  marqueeBg: '#FFFAEB',
  marqueeText: '#444444',
  marqueeBorder: '#f4e4af',
};

// Common colors
export const commonColor: ICommonColor = {
  white: '#FFFFFF',
  black: '#000000',
  primary: '#F8961E',
  primaryLight: '#ffc98647',
  divider: '#ECECEC',
  grayScale1: '#F5F5F5',
  grayScale3: '#E0E0E0',
  grayScale4: '#BDBDBD',
  grayScale5: '#9E9E9E',
  grayScale7: '#616161',
  grayScale8: '#424242',
  dark2: '#1F222A',
  primary5: '#584CF4',
  primaryD: '#544BC3',
  primaryTransparent: '#584CF414',
  placeHolderColor: '#9E9E9E',
  borderColor: '#35383F',
  inputFocusColor: '#584CF414',
  transparent: '#00000000',
  darkBg: '#181A20',
  redColor: '#F75555',
  lightRed: '#FF5C74',
  lightGray: '#7575751F',
  orange: '#FB9400',
  blue: '#4184F3',
  modalBg: '#00000099',
  disabledColor: '#393939',
  alertColor: '#F75555',
  transparentSilver: '#10101014',
  greenColor: '#07BD74',
  new_primary: '#E58025',
  new_secondary: '#FE7765',
  tabBar: '#FFEEEC',
  red_button: '#FF4040',
  textOne: '#FFFFFF',
  status: {
    green: {
      text: '#008079',
      bg: '#B5DDDB',
    },
    red: {
      text: '#CB1800',
      bg: '#F4D0CC',
    },
  },
};

export interface IColor {}
export interface IModeColor {
  light: IColor;
  dark: IColor;
}

export const colors: IModeColor = {
  light: {
    ...LightColor,
    ...commonColor,
  },
  dark: {
    ...DarkColor,
    ...commonColor,
  },
};
