import { Controller } from "react-hook-form";
import MultiRadio from "./MultiRadio";

const FormMultiRadio = (props: any) => {
  const { name, control, onValueChange, required, disable, ...inputProps } =
    props;
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
          <MultiRadio
            disabled={disable}
            onChange={on_Change}
            value={value}
            onBlur={onBlur}
            required={required}
            error={error}
            {...inputProps}
          />
        );
      }}
      name={name}
    />
  );
};

export default FormMultiRadio;
