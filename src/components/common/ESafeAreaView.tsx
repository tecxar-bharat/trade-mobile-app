import { SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import { styles } from "@themes/index";
import { useAppSelector } from "@store/index";

export default ESafeAreaView = ({ children, ...props }) => {
  const colors = useAppSelector((state) => state.theme.current);
  return (
    <SafeAreaView {...props} style={[localStyles(colors, props.style).root]}>
      {children}
    </SafeAreaView>
  );
};

const localStyles = (colors, style) =>
  StyleSheet.create({
    root: {
      ...styles.flex,
      backgroundColor: colors.backgroundColor,
      ...style,
    },
  });
