import { View } from "react-native";
import EText from "./EText";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";

export const ApproveRejectChip = ({ isApproved }: { isApproved: string }) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  return (
    <View
      style={{
        borderRadius: 5,
        backgroundColor:
          isApproved === "approved" ? current.greenBg : current.redBg,
      }}
    >
      <EText
        type="s12"
        style={{
          padding: 2,
          paddingHorizontal: 8,
          color: isApproved === "approved" ? current.green : current.red,
          textTransform: "capitalize",
        }}
      >
        {isApproved}
      </EText>
    </View>
  );
};
