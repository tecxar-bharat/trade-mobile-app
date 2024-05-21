import FormInput from "@fields/FormInput";
import FormSelect from "@fields/FormSelect";
import { ISegmentSummary } from "@interfaces/account.interface";
import { IAllScripts } from "@interfaces/common";
import accountService from "@services/account.service";
import commonService from "@services/common.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { NumberValidation, isBlank } from "@utils/constant";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useQuery } from "react-query";

const FieldArrayQtyWise = (props: any) => {
  const {
    name,
    control,
    watch,
    setValue,
    clearErrors,
    nseLotoption,
    getValues,
    defaultQt,
    type,
  } = props;
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });
  const fieldArray = watch(name);

  const [fieldArrayValue, setFieldArrayValue] = useState<any>([]);
  const [selectedScript, setSelectedScript] = useState<number[]>([]);
  const [allSegmentList, setAllSegmentList] = useState<ISegmentSummary[]>([]);
  const [allScripts, setAllScriptList] = useState<IAllScripts[]>([]);
  const current = useAppSelector((state) => themeSelector(state, "current"));

  useEffect(() => {
    if (fieldArray && fieldArray.length > 0) {
    } else {
      setSelectedScript([]);
    }
  }, [fieldArray]);

  useEffect(() => {
    accountService
      .getSegments()
      .then((e) => {
        setAllSegmentList(e.data.data as ISegmentSummary[]);
      })
      .catch(() => { });
  }, []);
  useQuery([`scriptList`], async () => {
    return commonService.getAllScripts().then((res: any) => {
      setAllScriptList(res?.data?.data);
    });
  });
  const setSelected = (index: number, val: any) => {
    const data = getValues(name);
    data[index].scriptId = val ? val.id : null;
    setFieldArrayValue(data);
    setSelectedScript(
      data.filter((e: any) => !isBlank(e.scriptId)).map((e: any) => e.scriptId)
    );
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        {fields.map((row: any, index: number) => {
          return (
            <View key={row.id}>
              <FormSelect
                control={control}
                labelKey="name"
                valueKey="id"
                name={`${name}.${index}.segmentId`}
                placeholder="Segment"
                disable={index < defaultQt ? true : false}
                isClearable={type === "edit" ? false : true}
                type="select"
                menuPlacement="auto"
                options={allSegmentList}
                label={"Segment"}
                textTransform="uppercase"
              />
              <View>
                <FormSelect
                  control={control}
                  labelKey="name"
                  valueKey="id"
                  disable={index < defaultQt ? true : false}
                  name={`${name}.${index}.scriptId`}
                  placeholder="Script"
                  type="select"
                  isClearable={type === "edit" ? false : true}
                  label={"Script"}
                  options={allScripts.filter(
                    (e) =>
                      !selectedScript.includes(e.id) ||
                      e.id === fieldArrayValue[index]?.scriptId
                  )}
                  onValueChange={(val: { id: number }) => {
                    setValue(`${name}.${index}.scriptId`, val ? val.id : null);
                    setSelected(index, val);
                    if (!val) {
                      setValue(`${name}.${index}.amount`, "");
                      clearErrors(`${name}.${index}.amount`);
                      clearErrors(`${name}.${index}.maxSize`);
                      setValue(`${name}.${index}.maxSize`, "");
                    }
                  }}
                />
              </View>

              <View>
                <FormInput
                  control={control}
                  {...(watch(`${name}.${index}.scriptId`) && {
                    validate: {
                      NumberValidation,
                    },
                  })}
                  disable={!watch(`${name}.${index}.scriptId`)}
                  name={`${name}.${index}.amount`}
                  placeholder={"Qty"}
                  keyboardType={"numeric"}
                  label={"Qty/Lot"}
                />
              </View>
              {nseLotoption && (
                <View>
                  <FormInput
                    control={control}
                    {...(watch(`${name}.${index}.scriptId`) && {
                      validate: {
                        NumberValidation,
                      },
                    })}
                    disable={!watch(`${name}.${index}.scriptId`)}
                    name={`${name}.${index}.maxSize`}
                    placeholder={"Max Place Order"}
                    keyboardType={"numeric"}
                    label={"Max Place Order"}
                  />
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {index === fields.length - 1 && (
                  <TouchableOpacity
                    onPress={() =>
                      append({ scriptId: null, amount: null, maxSize: null })
                    }
                  >
                    <AntDesign
                      name="plussquareo"
                      size={25}
                      color={current?.primary}
                    />
                  </TouchableOpacity>
                )}
                {fields.length > 1 && (
                  <TouchableOpacity onPress={() => remove(index)}>
                    <AntDesign
                      name="closesquareo"
                      size={25}
                      color={current?.red}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FieldArrayQtyWise;
