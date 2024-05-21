import EText from "@commonComponents/EText";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { positionM2MSelector } from "@store/reducers/positionReducer";
import { styles } from "@themes/index";
import { formatIndianAmount } from "@utils/helpers";
import React, { Fragment, useEffect, useState } from "react";
import { View } from "react-native";

interface IProps {
  isPositionList?: boolean;
}

const CurrentPNL = ({ isPositionList }: IProps) => {
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const [total, setTotal] = useState(0);
  const userSymbols = useAppSelector((state) =>
    positionM2MSelector(state, userData?.id)
  );

  useEffect(() => {
    let mtm = 0;
    if (userSymbols) {
      const symbols = Object.keys(userSymbols);
      for (let index = 0; index < symbols.length; index++) {
        const element = symbols[index];
        mtm = mtm + userSymbols[element];
      }
      setTotal(mtm);
    }
  }, [userSymbols]);

  const current = useAppSelector((state) => themeSelector(state, "current"));

  return (
    <Fragment>
      <View
        style={{
          marginTop: 10,
          backgroundColor: current.backgroundColor,
          borderWidth: 1,
          ...styles.shadowStyle2,
          shadowColor: total >= 0 ? current.green : current.red,
          borderColor: total >= 0 ? current.green : current.red,
          borderRadius: 5,
          paddingHorizontal: 10,
        }}
      >
        {isPositionList && (
          <View
            style={{
              paddingBottom: 5,
              paddingTop: 3,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <View style={{ alignItems: "flex-start", flex: 1 }}>
                <EText type="b18">{`M2m Alert:`}</EText>
              </View>
              <View style={{ alignItems: "flex-end", flex: 1 }}>
                <EText type="b18">{`${formatIndianAmount(
                  userData?.otherM2mAlert
                )}`}</EText>
              </View>
            </View>
          </View>
        )}
        <View
          style={{
            paddingBottom: 3,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
            }}
          >
            <View style={{ alignItems: "flex-start", flex: 1 }}>
              <EText type="b18">{`Current PNL: `}</EText>
            </View>
            <View style={{ alignItems: "flex-end", flex: 1 }}>
              <EText
                type="b18"
                color={total && total >= 0 ? current.green : current.red}
              >{`${formatIndianAmount(total)}`}</EText>
            </View>
          </View>
        </View>
      </View>
    </Fragment>
  );
};

export default CurrentPNL;
