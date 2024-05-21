import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { INavigation } from "../../interfaces/common";
import Octicons from "react-native-vector-icons/Octicons";
import { useAppSelector } from "../../store";

const MenuButton = ({ navigation }: INavigation) => {
  const colors = useAppSelector((state) => state.theme.current);
  return (
    <TouchableOpacity
      style={[localStyles.menuIcon]}
      onPress={() => navigation?.getParent('LeftDrawer')?.openDrawer()}
    >
      <Octicons name={"three-bars"} size={24} color={colors.textColor} />
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  menuIcon: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MenuButton;
