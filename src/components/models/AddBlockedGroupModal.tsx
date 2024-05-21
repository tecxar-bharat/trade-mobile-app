import CloseIcon from "@commonComponents/CloseIcon";
import EText from "@commonComponents/EText";
import FormInput from "@fields/FormInput";
import FormMultiSelect from "@fields/FormMultiSelect";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  createBlockScriptGroup,
  getBlockScriptsGroup,
  updateBlockScriptsGroupById,
} from "@store/reducers/blockScriptReducer";
import { getAllScripts, userSelector } from "@store/reducers/userReducer";
import { colors } from "@themes/index";
import { toNumber } from "@utils/constant";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";

const AddBlockedGroupModal = (props: any) => {
  const viewData = props.viewData;
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const allScripts = useAppSelector((state) =>
    userSelector(state, "allScripts")
  );
  const dispatch = useAppDispatch();
  const { handleSubmit, control, setValue, reset } = useForm<any>({
    mode: "onChange",
    defaultValues: {
      name: viewData?.name ?? "",
      blockScriptIds: viewData?.scripts.map((e: any) => e.scriptId) ?? [],
    },
  });
  React.useEffect(() => {
    dispatch(getAllScripts());
  }, []);
  React.useEffect(() => {
    if (viewData && viewData.id) {
      setValue("name", viewData.name);
      setValue(
        "blockScriptIds",
        viewData.scripts.map((e: any) => e.scriptId)
      );
    } else {
      reset();
    }
  }, [props]);

  const onSubmit = async (payload: any) => {
    payload.type = "blockScript";
    payload.blockScriptIds = payload.blockScriptIds;
    const object = {
      payload,
      onSuccess,
      onError,
    };
    if (viewData && viewData.id) {
      payload.id = toNumber(viewData.id);
      dispatch(updateBlockScriptsGroupById(object));
    } else {
      dispatch(createBlockScriptGroup(object));
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
          groupType: "blockScript",
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
            <FormMultiSelect
              control={control}
              name="blockScriptIds"
              required={true}
              labelField="name"
              valueField="id"
              options={allScripts}
            />
            <FormInput
              name="name"
              required={"required"}
              control={control}
              placeholder="Group Name"
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
                cancel
              </EText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: current.red,
                borderRadius: 9,
                padding: 5,
              }}
              onPress={handleSubmit(onSubmit, () => onError)}
            >
              <EText style={{ color: current.white, fontSize: 14 }}>
                Confirm
              </EText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default AddBlockedGroupModal;

const styles = StyleSheet.create({
  boarder: {
    borderBottomColor: colors.dark.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    marginTop: 10,
  },
});
