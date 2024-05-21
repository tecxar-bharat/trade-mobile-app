import { StyleSheet } from 'react-native';
import { getHeight, moderateScale } from '../common/constants';
import { colors } from './colors';
import flex from './flex';
import margin from './margin';

export default StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.light.backgroundColor,
    ...flex.flex,
  },
  innerContainer: {
    paddingHorizontal: moderateScale(20),
    ...margin.mt20,
  },
  generalTitleText: {
    fontSize: moderateScale(24),
  },
  underLineText: {
    textDecorationLine: 'underline',
  },
  horizontalLine: {
    height: getHeight(10),
    width: '100%',
  },
  shadowStyle: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.23,
    shadowRadius: 3,
    elevation: 5,
  },

  tabBarShadowStyle: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 10,
    // backgroundColor: 'black',
  },

  shadowStyle1: {
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.23,
    shadowRadius: 3,
    elevation: 5,
  },

  shadowStyle2: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },

  capitalizeTextStyle: {
    textTransform: 'capitalize',
  },
  actionSheetIndicator: {
    width: moderateScale(60),
    ...margin.mt10,
  },
});
