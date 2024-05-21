import { Controller } from "react-hook-form";
import SwitchButton from "./SwitchButton";
import strings from "@i18n/strings";
import React from "react";

const FormSwitchButton = (props: any) => {
  const {
    name,
    control,
    label,
    disable,
    onValueChange,
    required,
    ...inputProps
  } = props;
  const rules: any = {};
  if (required) {
    if (typeof required === "string") {
      rules.required = required;
    } else {
      rules.required = `${inputProps.label ? `${inputProps.label} is` : ""} ${
        strings.required
      }`;
    }
  }
  return (
    <Controller
      control={control}
      rules={rules}
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
      }) => {
        const on_Change = (e: any) => {
          onChange(e);
          if (onValueChange) {
            onValueChange(e);
          }
        };
        return (
          <SwitchButton
            disabled={disable}
            label={label}
            onChange={on_Change}
            value={value}
            onBlur={onBlur}
            error={error}
            {...inputProps}
          />
        );
      }}
      name={name}
    />
  );
};

export default FormSwitchButton;
