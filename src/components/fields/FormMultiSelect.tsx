import { Controller } from "react-hook-form";
import strings from "@i18n/strings";
import React from "react";
import MultiSelect from "./MultiSelect";

const FormMultiSelect = (props: any) => {
  const {
    name,
    control,
    required,
    validate,
    onValueChange,
    options,
    ...inputProps
  } = props;
  const rules: any = {};
  if (required) {
    if (typeof required === "string") {
      rules.required = required;
    } else {
      rules.required = `${inputProps.label ? `${inputProps.label} is` : ""} ${strings.required
        }`;
    }
  }
  if (validate) {
    rules.validate = validate;
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
          <MultiSelect
            onChange={on_Change}
            value={value}
            required={required}
            onBlur={onBlur}
            error={error}
            options={options}
            {...inputProps}
          />
        );
      }}
      name={name}
    />
  );
};

export default FormMultiSelect;
