import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
// Custom Imports
import { moderateScale } from '../../common/constants';
import { useAppSelector } from '../../store';

const EDivider = ({ style }: { style?: ViewStyle }) => {
  const colors = useAppSelector(state => state.theme.current);
  return (
    <View
      style={[
        localStyles.divider,
        {
          backgroundColor:
            colors.value === 'dark' ? colors.grayScale8 : colors.grayScale3,
        },
        style,
      ]}
    />
  );
};

const localStyles = StyleSheet.create({
  divider: {
    height: moderateScale(1),
  },
});

export default memo(EDivider);
