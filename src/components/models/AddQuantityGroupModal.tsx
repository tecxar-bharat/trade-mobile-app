import CloseIcon from "@commonComponents/CloseIcon";
import EText from "@commonComponents/EText";
import FieldArrayQtyWise from "@commonComponents/FieldArrayQtyWise";
import FormInput from "@fields/FormInput";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  createBlockScriptGroup,
  getBlockScriptsGroup,
  updateBlockScriptsGroupById,
} from "@store/reducers/blockScriptReducer";
import { getAllScripts } from "@store/reducers/userReducer";
import { colors } from "@themes/index";
import { isBlank, toNumber } from "@utils/constant";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";

const AddQuantityGroupModal = (props: any) => {
  const viewData = props.viewData;
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    setError,
    getValues,
    clearErrors,
  } = useForm<any>({
    mode: "onChange",
    defaultValues: {
      name: viewData?.name ?? "",
      qtyScripts:
        viewData?.qtyScripts && viewData?.qtyScripts.length > 0
          ? viewData?.qtyScripts.map((item: any) => {
            const newItem: any = {};
            newItem.scriptId = item.scriptId;
            newItem.amount = item.qty;
            newItem.maxSize = item.maxQty;
            return newItem;
          })
          : [{}],
    },
  });
  React.useEffect(() => {
    dispatch(getAllScripts());
  }, []);
  useEffect(() => {
    if (viewData && viewData.id) {
      setValue("name", viewData.name);
      setValue(
        "qtyScripts",
        viewData?.qtyScripts.map((item: any) => {
          const newItem: any = {};
          newItem.scriptId = item.scriptId;
          newItem.amount = item.qty;
          newItem.maxSize = item.maxQty;
          return newItem;
        })
      );
    } else {
      reset();
    }
  }, [props]);

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

  const onSubmit = async (payload: any) => {
    payload.type = "qtyScript";
    payload.qtyScripts = payload.qtyScripts
      .filter((e: any) => e.scriptId)
      .map((e: any) => {
        return {
          scriptId: e.scriptId,
          qty: toNumber(e.amount),
          maxQty: toNumber(e.maxSize),
        };
      });
    const object = {
      payload,
      onSuccess,
      onError,
    };
    if (validateForm(payload)) {
      if (viewData && viewData.id) {
        payload.id = toNumber(viewData.id);
        dispatch(updateBlockScriptsGroupById(object));
      } else {
        dispatch(createBlockScriptGroup(object));
      }
    }
  };

  const onSuccess = (response: any) => {
    setTimeout(() => {
      Toast.show({
        type: "success",
        text1: response,
      });
      dispatch(
        getBlockScriptsGroup({
          page: props.page,
          rowPerPage: props.rowPerPage,
          groupType: "qtyScript",
        })
      );
      props.onDismiss();
    }, 1000);
  };

  const onError = (err: string) => {
    setTimeout(() => {
      Toast.show({
        type: "error",
        text1: err,
      });
    }, 1000);
  };
  return (
    <View>
      <Modal isVisible={props.isVisible} onDismiss={props.onDismiss}>
        <View
          style={{
            backgroundColor: current.cardBackround,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <EText style={{ color: current.white, fontSize: 18 }}>
              {`${viewData && viewData.id
                ? "Edit BlockScripts Group"
                : "Add BlockScripts Group"
                } `}
            </EText>
            <TouchableOpacity onPress={props.onDismiss}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.boarder} />
          <View>
            <FormInput
              name="name"
              required={"required"}
              control={control}
              label="Name"
              placeholder="Group Name"
            />
            <FieldArrayQtyWise
              control={control}
              qty="qty"
              name={"qtyScripts"}
              nseLotoption={true}
              watch={watch}
              setValue={setValue}
              clearErrors={clearErrors}
              getValues={getValues}
            />
          </View>
          <View style={styles.boarder} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={props.onDismiss}>
              <EText
                style={{
                  color: current.textOne,
                  fontSize: 14,
                  marginRight: 10,
                }}
              >
                CANCEL
              </EText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: current.red,
                borderRadius: 9,
                padding: 5,
              }}
              onPress={handleSubmit(onSubmit, onError)}
            >
              <EText style={{ color: current.white, fontSize: 14 }}>
                CONFIRM
              </EText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default AddQuantityGroupModal;

const styles = StyleSheet.create({
  boarder: {
    borderBottomColor: colors.dark.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    marginTop: 10,
  },
});
