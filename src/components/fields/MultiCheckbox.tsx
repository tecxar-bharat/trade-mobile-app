// ** React Imports

import EText from "@components/common/EText";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import React, { Fragment } from "react";
import { View } from "react-native";
import SwitchButton from "./SwitchButton";

const MultiCheckBox = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const { label, value, error, onChange, labelKey, valueKey, options } = props;
  const handleChange = (checked: boolean, val: string) => {
    let newValue = value ? [...value] : [];
    if (checked) {
      newValue.push(val);
    } else {
      newValue = newValue.filter((e: string) => e !== val);
    }
    onChange(newValue);
  };
  return (
    <Fragment>
      <EText style={{ marginBottom: 5, marginTop: 5 }} type={"s14"}>
        {label}
      </EText>
      <View>
        <View style={{ flexDirection: "column" }}>
          {options.map((e: string) => {
            return (
              <SwitchButton
                value={value?.includes(e[valueKey])}
                onChange={() => {
                  handleChange(!value?.includes(e[valueKey]), e[valueKey]);
                }}
                label={e[labelKey]}
              />
            );
          })}
        </View>
        {error && (
          <EText type="b14" style={{ color: current.red, marginTop: 10 }}>
            {error.message}
          </EText>
        )}
      </View>
    </Fragment>
  );
};

export default MultiCheckBox;
