import EText from "@components/common/EText";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Switch, Platform } from "react-native";

interface IProps {
  value: boolean;
  onChange: (val: boolean) => void;
  label: string;
  disabled?: boolean;
  error?: { message: string };
}

const SwitchButton = (props: IProps) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const { value, onChange, label, disabled, error } = props;
  return (
    <View>
      <View style={styles.row}>
        <Switch
          {...(Platform.OS === "ios" && {
            trackColor: { true: current.primary },
            ios_backgroundColor: current.grey,
          })}
          {...(Platform.OS === "android" && {
            trackColor: { false: current.greyDark, true: current.primary },
            thumbColor: current.grey,
          })}
          onValueChange={() => {
            onChange(!value);
          }}
          value={value}
          style={styles.switch}
          disabled={disabled}
        />
        <EText type="r14" style={styles.label}>
          {label}
        </EText>
      </View>
      {error && (
        <EText type="r12" style={{ color: current.red }}>
          {error.message}
        </EText>
      )}
    </View>
  );
};
export default SwitchButton;

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 40,
  },
  label: {
    flex: 1,
  },
  switch: { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }], marginRight: 5 },
});
