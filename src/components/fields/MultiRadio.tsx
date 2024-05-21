// ** React Imports

import { Fragment } from "react";
import { Text, View } from "react-native";
import { RadioButton } from "react-native-radio-buttons-group";
import EText from "@components/common/EText";
import { themeSelector } from "@store/reducers/theme.reducer";
import { useAppSelector } from "@store/index";
const MultiRadio = (props: any) => {
  const {
    label,
    value,
    error,
    onChange,
    labelKey,
    required,
    disableType,
    valueKey,
    options,
    direction,
    radioSize,
    radioColor,
  } = props;
  const handleChange = (val: string) => {
    onChange(val);
  };
  const current = useAppSelector((state) => themeSelector(state, "current"));
  return (
    <Fragment>
      <View>
        <View style={{ flexDirection: "row" }}>
          <EText style={{ textAlign: "left", opacity: 0.9 }} type={"s14"}>
            {label}
          </EText>
          {required && <EText style={{ color: "red" }}>*</EText>}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: direction ? "row" : "column",
          }}
        >
          {options.map((e: string, index: number) => {
            return (
              <View key={index}>
                <RadioButton
                  id={e[valueKey]}
                  disabled={e[disableType] === "true" ? true : false}
                  selected={value === e[valueKey]}
                  onPress={() => handleChange(e[valueKey])}
                  label={e[labelKey]}
                  labelStyle={{ color: "#000000" }}
                  color={radioColor}
                  size={radioSize}
                />
              </View>
            );
          })}
        </View>
      </View>
      {error && <EText style={{ color: "red" }}>{error.message}</EText>}
    </Fragment>
  );
};
export default MultiRadio;
