import EDivider from "@commonComponents/EDivider";
import EText from "@commonComponents/EText";
import { LoggedUser } from "@db/schemas/loggedUser.model";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import commonStyle from "@themes/commonStyle";
import { formatIndianAmount } from "@utils/helpers";
import React from "react";
import { View } from "react-native";

interface IProps {
  totalMtM: number;
}

const MasterTopHeader = ({ totalMtM }: IProps) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const userData = LoggedUser.getActiveUser(globalThis.realm);

  const selfM2M = 0 - (totalMtM * userData?.partnershipPercentage!) / 100
  const uplineM2M = 0 - (totalMtM * (100 - userData?.partnershipPercentage!)) / 100

  return (
    <View
      style={{
        borderRadius: 6,
        padding: 14,
        paddingVertical: 10,
        marginTop: -40,
        backgroundColor: current.white,
        ...commonStyle.shadowStyle,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ display: "flex", flexDirection: "column" }}>
          <EText type="r14" color={current.greyText}>
            Total M2M
          </EText>
          <EText type="s18">{formatIndianAmount(totalMtM)}</EText>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <EText type="r14" color={current.greyText}>
            Upline M2M
          </EText>
          <EText type="s18">
            {formatIndianAmount(uplineM2M)}
          </EText>
        </View>
      </View>
      <EDivider style={{ marginVertical: 10 }} />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          paddingVertical: userData?.role?.slug !== 'user' ? 6 : 0,
          justifyContent: "space-between",
        }}
      >
        <EText type="s18" color={current.greyText}>
          SELF M2M
        </EText>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <EText type="m18" color={selfM2M >= 0 ? current.green : current.red}>
            {selfM2M > 0 ? "+" : null}
            {formatIndianAmount(selfM2M)}
          </EText>
        </View>
      </View>
    </View>
  );
};

export default MasterTopHeader;
