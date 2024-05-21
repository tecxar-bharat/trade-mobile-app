import { moderateScale } from "@common/constants";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import React from "react";
import { TouchableOpacity } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
export const FilterButton = (props: any) => {
  const { style } = props;
  const current = useAppSelector((state) => themeSelector(state, "current"));

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: current.primary,
          minHeight: 40,
          minWidth: 40,
          borderTopRightRadius: 6,
          borderBottomRightRadius: 6,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
      onPress={props.onPress}
    >
      {props.type === "plus" ? (
        <AntDesign name="plus" size={moderateScale(22)} color={current.white} />
      ) : (
        <Ionicons
          name="options-outline"
          size={moderateScale(28)}
          color={current.white}
        />
      )}
    </TouchableOpacity>
  );
};
