import { useNavigation } from "@react-navigation/native";
import React, { Fragment, ReactElement, memo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

// Custom Imports
import images from "@assets/images";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { moderateScale } from "../../common/constants";
import { useAppSelector } from "../../store";
import { themeSelector } from "../../store/reducers/theme.reducer";
import { styles } from "../../themes";
import EText from "./EText";
import Marquee from "./Marquee";

interface IHeader {
  title?: string;
  onPressBack?: () => void;
  rightIcon?: ReactElement;
  isHideBack?: boolean;
  isLeftIcon?: ReactElement;
  showProfileButton?: boolean;
}

const EHeader = (props: IHeader) => {
  const {
    title,
    onPressBack,
    rightIcon,
    isHideBack,
    isLeftIcon,
    showProfileButton,
  } = props;
  const navigation = useNavigation();
  const current = useAppSelector((state) => themeSelector(state, "current"));

  const goBack = () => navigation.goBack();
  return (
    <Fragment>
      <View
        style={[
          localStyles.container,
          !!isHideBack && styles.pr10,
          { backgroundColor: current.backgroundColor1 },
        ]}
      >
        <View style={[styles.rowStart, styles.flex]}>
          {!isHideBack && (
            <TouchableOpacity
              style={localStyles.backIcon}
              onPress={onPressBack || goBack}
            >
              <MaterialIcons
                name="arrow-back"
                size={moderateScale(25)}
                color={current.textColor}
              />
            </TouchableOpacity>
          )}
          {!!isLeftIcon && isLeftIcon}
          {title && (
            <View style={{ flex: 1, marginLeft: 10 }}>
              <EText numberOfLines={1} type={"b22"}>
                {title}
              </EText>
            </View>
          )}
        </View>
        {showProfileButton && (
          <TouchableOpacity
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
            }}
            onPress={() => navigation.openDrawer()}
          >
            <Image
              source={images.userProfile}
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
              }}
            />
          </TouchableOpacity>
        )}
        {!!rightIcon && rightIcon}
      </View>
      <Marquee type='inner' />
    </Fragment>
  );
};

export default memo(EHeader);

const localStyles = StyleSheet.create({
  container: {
    ...styles.rowSpaceBetween,
    ...styles.ph10,
    ...styles.pv10,
    ...styles.center,
  },
  backIcon: {
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
