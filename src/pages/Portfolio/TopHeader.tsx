import EDivider from "@commonComponents/EDivider";
import EText from "@commonComponents/EText";
import { LoggedUser } from "@db/schemas/loggedUser.model";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import commonStyle from "@themes/commonStyle";
import { formatIndianAmount } from "@utils/helpers";
import React from "react";
import { Fragment, useEffect, useState } from "react";
import { View } from "react-native";

interface IProps {
  totalInvested: number;
  totalMtM: number;
}

const TopHeader = ({ totalInvested, totalMtM }: IProps) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const userData = LoggedUser.getActiveUser(globalThis.realm);
  const [mtmChange, setMtMChange] = useState(0);

  useEffect(() => {
    if (totalMtM && totalInvested) {
      const percentage = parseFloat(
        ((totalMtM * 10) / Math.abs(totalInvested)).toFixed(2)
      );
      setMtMChange(percentage);
    }
  }, [totalInvested, totalMtM]);

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
      {userData?.role?.slug === 'user' ?
        <Fragment>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ display: "flex", flexDirection: "column" }}>
              <EText type="r14" color={current.greyText}>
                Invested
              </EText>
              <EText type="s18">{formatIndianAmount(totalInvested)}</EText>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <EText type="r14" color={current.greyText}>
                Current
              </EText>
              <EText type="s18">
                {formatIndianAmount(totalInvested + totalMtM)}
              </EText>
            </View>
          </View>
          <EDivider style={{ marginVertical: 10 }} />
        </Fragment> : null
      }
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          paddingVertical: userData?.role?.slug !== 'user' ? 6 : 0,
          justifyContent: "space-between",
        }}
      >
        <EText type="s18" color={current.greyText}>
          P&L
        </EText>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <EText type="m18" color={totalMtM >= 0 ? current.green : current.red}>
            {totalMtM > 0 ? "+" : null}
            {formatIndianAmount(totalMtM)}
          </EText>
          <View
            style={{
              backgroundColor: mtmChange >= 0 ? current.greenBg : current.redBg,
              marginLeft: 10,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              paddingHorizontal: 8,
            }}
          >
            <EText
              color={mtmChange >= 0 ? current.green : current.red}
              type="m14"
            >
              {mtmChange > 0 ? "+" : null}
              {mtmChange}%
            </EText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TopHeader;
