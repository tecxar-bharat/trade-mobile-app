import { View } from "react-native";
import ELoader from "./ELoader";
import React = require("react");

export const RenderFooter = ({
  isFetchingMore,
}: {
  isFetchingMore: boolean;
}) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
      }}
    >
      {isFetchingMore && (
        <ELoader loading={true} mode="button" size="small" />
      )}
    </View>
  );
};
