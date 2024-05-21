import { View } from "react-native";
import EText from "./EText";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";

export const BuySellChip = ({ position }: { position: string }) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  return (
    <View
      style={{
        backgroundColor: position === "buy" ? current.greenBg : current.redBg,
        borderRadius: 5,
      }}
    >
      <EText
        type="m12"
        style={{
          padding: 3,
          paddingHorizontal: 8,
          borderColor: position === "buy" ? current.green : current.red,
          color: position === "buy" ? current.green : current.red,
          textTransform: "uppercase",
        }}
      >
        {position}
      </EText>
    </View>
  );
};
