import { View } from "react-native";
import EText from "./EText";
import React from "react";

const ListEmptyComponent = ({ message }: { message: string }) => {
  return (
    <View
      style={{
        justifyContent: "center",
        marginVertical: 20,
        alignItems: "center",
      }}
    >
      <EText type="s18">{message ?? "No Data Found"}</EText>
    </View>
  );
};
export default ListEmptyComponent;
