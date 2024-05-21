import { Controller } from "react-hook-form";
import MultiCheckBox from "./MultiCheckbox";
import React from "react";

const FormMultiCheckbox = (props: any) => {
  const { name, control, onValueChange, required, ...inputProps } = props;

  const rules: any = {};
  if (required) {
    rules.required = required;
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
          <MultiCheckBox
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

export default FormMultiCheckbox;
