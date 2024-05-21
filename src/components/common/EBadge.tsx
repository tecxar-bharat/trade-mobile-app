import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { View } from "react-native";
import EText from "./EText";
import React = require("react");

const EBadgeForTab = ({ count }: { count: number }) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  if (count && count > 0) {
    return (
      <View
        style={{
          marginTop: 5,
          marginLeft: 5,
          height: 20,
          minWidth: 20,
          backgroundColor: current.primary,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 4
        }}
      >
        <EText type='r10' color={current.white}>{count}</EText>
      </View>
    );
  } else {
    return null;
  }
};

export default EBadgeForTab;
