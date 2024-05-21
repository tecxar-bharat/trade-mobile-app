import images from "@assets/images";
import EHeader from "@commonComponents/EHeader";
import EText from "@commonComponents/EText";
import FormInput from "@fields/FormInput";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "@themes/index";
import { useForm } from "react-hook-form";
import FieldArrayQtyWise from "@commonComponents/FieldArrayQtyWise";
import Toast from "react-native-toast-message";
import { isBlank, toNumber } from "@utils/constant";
import blockScriptsService from "@services/blockScripts.service";
import { SCREENS } from "@navigation/NavigationKeys";
import EButton from "@commonComponents/EButton";
const Form = (props: any) => {
  const { viewData, navigation } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    setError,
    getValues,
    clearErrors,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<any>({
    mode: "onChange",
    defaultValues: {
      name: viewData?.name ?? "",
      defaultQt:
        viewData?.qtyScripts && viewData?.qtyScripts.length > 0
          ? viewData?.qtyScripts.length
          : 0,
      qtyScripts:
        viewData?.qtyScripts && viewData?.qtyScripts.length > 0
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            viewData?.qtyScripts.map((item: any) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const newItem: any = {};
              newItem.segmentId = item.segmentId;
              newItem.scriptId = item.scriptId;
              newItem.amount = item.qty;
              newItem.maxSize = item.maxQty;
              return newItem;
            })
          : [{}],
    },
  });
  const validateForm = (payload: any) => {
    let errorCount = 0;
    if (payload.qtyScripts.length === 0) {
      ++errorCount;
      Toast.show({ type: "error", text1: "Select At least one script" });
    } else {
      payload.qtyScripts.forEach((e: any, i: number) => {
        if (e.scriptId) {
          if (isBlank(e.qty)) {
            ++errorCount;
            setError(`qtyScripts.${i}.amount`, {
              message: "Required",
            });
          } else if (isBlank(e.maxQty)) {
            ++errorCount;
            setError(`qtyScripts.${i}.maxSize`, {
              message: "Required",
            });
          } else if (toNumber(e.qty) < toNumber(e.maxQty)) {
            ++errorCount;
            Toast.show({
              type: "error",
              text1: "Max Qty can not be grater than Qty",
            });
          }
        }
      });
    }
    if (errorCount > 0) {
      return false;
    }
    return true;
  };
  const defaultQt = watch("defaultQt");

  useEffect(() => {
    if (viewData && viewData.id) {
      setValue("name", viewData.name);
      setValue(
        "qtyScripts",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        viewData?.qtyScripts.map((item: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newItem: any = {};
          newItem.segmentId = item.segmentId;
          newItem.scriptId = item.scriptId;
          newItem.amount = item.qty;
          newItem.maxSize = item.maxQty;
          return newItem;
        })
      );
    } else {
      reset();
    }
  }, [viewData]);

  const onSubmit = async (payload: any) => {
    payload.type = "qtyScript";
    payload.qtyScripts = payload.qtyScripts
      .filter((e: any) => e.scriptId)
      .map((e: any) => {
        return {
          segmentId: e.segmentId,
          scriptId: e.scriptId,
          qty: toNumber(e.amount),
          maxQty: toNumber(e.maxSize),
        };
      });
    if (validateForm(payload)) {
      if (viewData && viewData.id) {
        payload.id = toNumber(viewData.id);
        setLoading(true);
        blockScriptsService
          .updateBlockScriptsGroupById(payload.id, payload)
          .then((res) => {
            if (res.data.statusCode === 200 || res.data.statusCode === 201) {
              setTimeout(() => {
                Toast.show({ type: "success", text1: res.data.message });
                navigation.navigate(SCREENS.MaxQtyLimit);
              }, 1000);
            } else {
              Toast.show({ type: "error", text1: res.data.message });
            }
          })
          .catch((error) => Toast.show({ type: "error", text1: error }));
        setLoading(false);
      } else {
        setLoading(true);
        blockScriptsService
          .createBlockScriptGroup(payload)
          .then((res) => {
            if (res.data.statusCode === 200 || res.data.statusCode === 201) {
              setTimeout(() => {
                Toast.show({ type: "success", text1: res.data.message });
                navigation.navigate(SCREENS.MaxQtyLimit);
              }, 1000);
            } else {
              Toast.show({ type: "error", text1: res.data.message });
            }
          })
          .catch((error) => Toast.show({ type: "error", text1: error }));
        setLoading(false);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor }}>
      <EHeader title={`${viewData && viewData.id ? "Edit" : "Add"} `} />
      <View
        style={{
          backgroundColor: current.cardBackround,
          paddingHorizontal: 10,
          flex: 1,
        }}
      >
        <FormInput
          name="name"
          required={"required"}
          control={control}
          label="Name"
          placeholder="Group Name"
        />
        <View style={{ flex: 1 }}>
          <FieldArrayQtyWise
            control={control}
            qty="qty"
            name={"qtyScripts"}
            nseLotoption={true}
            watch={watch}
            setValue={setValue}
            clearErrors={clearErrors}
            getValues={getValues}
            defaultQt={defaultQt}
            type={props.type}
          />
        </View>

        {/* <TouchableOpacity onPress={props.onDismiss}>
            <EText
              style={{
                color: current.textOne,
                fontSize: 14,
                marginRight: 10,
              }}
            >
              cancel
            </EText>
          </TouchableOpacity> */}
      </View>
      <View style={{ paddingHorizontal: 10 }}>
        <EButton
          style={{ textAlign: "center", paddingHorizontal: 10 }}
          title={"CONFIRM"}
          height={40}
          onPress={handleSubmit(onSubmit)}
          bgColor={current.primary}
          loading={loading}
        />
      </View>
    </View>
  );
};
export default Form;
