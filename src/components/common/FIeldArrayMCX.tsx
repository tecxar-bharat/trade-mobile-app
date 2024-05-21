import FormSwitchButton from "@fields/FormSwitchButton";
import FormInput from "@fields/FormInput";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppSelector } from "@store/index";
import { NumberValidation } from "@utils/constant";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { View } from "react-native";
import EText from "./EText";

const FieldArrayMCX = (props: any) => {
  const { name, control, watch, setValue, clearErrors, getValues } = props;
  const { fields } = useFieldArray({
    control,
    name,
  });
  const current = useAppSelector((state) => themeSelector(state, "current"));
  return (
    <View>
      <EText type='b18' style={{ color: current.white }}>
        Script
      </EText>
      {fields.map((row, index) => (
        <View key={row.id}>
          <View style={{ marginTop: 10 }}>
            <FormSwitchButton
              control={control}
              type="checkbox"
              name={`${name}.${index}.isChecked`}
              label={watch(`${name}.${index}.name`)}
              onValueChange={(val: boolean) => {
                if (val) {
                  setValue("mcx_brokerage_gold_checkbox", false);
                  setValue("mcx_brokerage_silver_checkbox", false);
                  setValue("mcx_brokerage_other_scripts_checkbox", false);
                  setValue("mcx_brokerage_gold", "");
                  setValue("mcx_brokerage_silver", "");
                  setValue("mcx_brokerage_other_scripts", "");
                  clearErrors(`${name}.${index}.isChecked`);
                } else {
                  setValue(`${name}.${index}.size`, "", {
                    shouldValidate: false,
                    shouldTouch: true,
                  });
                  setValue(`${name}.${index}.brokerage`, "", {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  setValue(`no_of_max_script_mcxOther`, "");
                  clearErrors("no_of_max_script");
                  clearErrors(`${name}.${index}.size`);
                  clearErrors(`${name}.${index}.brokerage`);
                }
              }}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 1, marginRight: 10 }}>
              <FormInput
                control={control}
                disable={!getValues(`${name}.${index}.isChecked`)}
                {...(getValues(`${name}.${index}.isChecked`) && {
                  validate: {
                    NumberValidation,
                  },
                })}
                name={`${name}.${index}.size`}
                label={"Max Lot"}
                placeholder={"Max Lot"}
                keyboardType={"numeric"}
                inWords={"inWords"}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormInput
                control={control}
                {...(watch(`${name}.${index}.isChecked`) && {
                  validate: {
                    NumberValidation,
                  },
                })}
                disable={!watch(`${name}.${index}.isChecked`)}
                name={`${name}.${index}.brokerage`}
                label={"Brokerage(Fix)"}
                placeholder={"Brokerage(Fix)"}
                keyboardType={"numeric"}
                inWords={"inWords"}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default FieldArrayMCX;
