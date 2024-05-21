import { View, TextStyle, Dimensions } from "react-native";
import EText from "./EText";
import { checkPermission, formatIndianAmount } from "@utils/helpers";
import React from "react";

interface IAccess {
  superadmin: boolean;
  admin: boolean;
  master: boolean;
  user: boolean;
  broker: boolean;
}

interface IFields {
  value: string | number;
  label: string;
  withComma?: boolean;
  access?: IAccess;
  isStatus?: boolean;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
}

interface Iprops {
  fields: IFields[];
}

const ValueLabelComponent = ({ fields }: Iprops) => {

  const windowWidth = Dimensions.get('window').width;

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'space-between',
        gap: 6
      }}
    >
      {checkPermission(fields).map((e: IFields) => {
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: (windowWidth - 40) / 3,
            }}
          >
            <EText type="r12">{e.label}</EText>
            {e.isStatus ? (
              <EText type="b12" style={{ textTransform: "uppercase" }}>
                {e.withComma ? formatIndianAmount(e.value) : e.value}
              </EText>
            ) : (
              <EText type="b12" style={{ textTransform: e.textTransform ? e.textTransform : 'none' }} >
                {e.withComma ? formatIndianAmount(e.value) : e.value}
              </EText>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default ValueLabelComponent;
