import { Controller } from "react-hook-form";
import Input from "@fields/Input";
import strings from "@i18n/strings";
import { EmailValidation, MobileValidation, Number } from "@utils/validators";
import React, { Fragment } from "react";

const FormInput = (props: any) => {
  const {
    name,
    control,
    disable,
    onValueChange,
    setError,
    minLength,
    maxLength,
    required,
    validate,
    type,
    ...inputProps
  } = props;

  const rules: any = {};
  if (required) {
    if (typeof required === "string") {
      rules.required = required;
    } else {
      rules.required = `${inputProps.label ? `${inputProps.label} is` : ""
        } ${"required"}`;
    }
  }
  if (validate) {
    rules.validate = validate;
  }
  if (type === "email") {
    rules.validate = EmailValidation;
  }

  if (type === "mobile") {
    rules.validate = MobileValidation;
  }
  if (type === "number") {
    rules.validate = Number;
  }

  if (minLength) {
    rules.minLength = {
      value: minLength,
      message: `${strings.enterMinimum} ${minLength} ${strings.character}`,
    };
  }
  if (maxLength) {
    rules.maxLength = {
      value: maxLength,
      message: `${strings.enterMaximum} ${maxLength} ${strings.character}`,
    };
  }
  const setFieldError = (err: string) => {
    setError(name, { message: err });
  };

  return (
    <Controller
      control={control}
      {...(Object.keys(rules).length > 0
        ? {
          rules,
        }
        : { rules: undefined })}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const on_Change = (e: any) => {
          if (type === "location") {
            onChange(e.formatted_address);
          } else {
            onChange(e);
          }
          if (onValueChange) {
            onValueChange(e);
          }
        };
        return (
          <Fragment>
            <Input
              disabled={disable}
              onChange={on_Change}
              value={value}
              error={error}
              type={type}
              setError={setFieldError}
              required={rules.required ? true : false}
              {...inputProps}
            />
          </Fragment>
        );
      }}
      name={name}
    />
  );
};
export default FormInput;
