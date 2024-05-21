import CloseIcon from "@commonComponents/CloseIcon";
import EButton from "@commonComponents/EButton";
import EText from "@commonComponents/EText";
import FormInput from "@fields/FormInput";
import FormSelect from "@fields/FormSelect";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  createAnnouncement,
  updateAnnouncementById,
} from "@store/reducers/announcementReducer";
import { colors } from "@themes/index";
import { toNumber } from "@utils/constant";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import EvilIcons from "react-native-vector-icons/EvilIcons";

const AnnouncementModal = (props: any) => {
  const data = props.data;
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const dispatch = useAppDispatch();
  const { handleSubmit, control, setValue, reset } = useForm<any>({
    defaultValues: {
      message: data?.message ?? "",
      category: data?.category ?? "",
    },
    mode: "onChange",
  });
  useEffect(() => {
    if (data && data.id) {
      setValue("message", data.message);
      setValue("category", data.category);
    } else {
      reset();
    }
  }, [data]);
  const onSubmit = async (payload: any) => {
    const object = {
      payload,
      onSuccess,
      onError,
    };
    if (data && data.id) {
      payload.id = toNumber(data.id);
      await dispatch(updateAnnouncementById(object));
    } else {
      await dispatch(createAnnouncement(object));
    }

  };
  const onSuccess = (response: any) => {
    setTimeout(() => {
      Toast.show({
        type: "success",
        text1: response,
      });
      if (props.refreshList) {
        props.refreshList()
      }
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
  const announcementOptions = [
    {
      name: "Outer",
      id: "outer",
    },
    {
      name: "Inner",
      id: "inner",
    },
  ];
  return (
    <View>
      <Modal
        isVisible={props.isVisible}
        onDismiss={props.onDismiss}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View
          style={{
            backgroundColor: current.backgroundColor,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <EText style={{ fontSize: 18 }}>{`Add Announcement`}</EText>
            <TouchableOpacity onPress={props.onDismiss}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.boarder} />
          <View>
            <FormInput
              name="message"
              required={"required"}
              control={control}
              label="Announcement"
              placeholder="Announcement"
            />
            <FormSelect
              control={control}
              labelKey="name"
              valueKey="id"
              required={"Category required"}
              type="select"
              name="category"
              isClearable={true}
              label={"Category"}
              options={announcementOptions}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              // borderBottomWidth: StyleSheet.hairlineWidth,
              backgroundColor: current.backgroundColor,
              marginVertical: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <EButton
                title={"CLEAR"}
                type="b16"
                bgColor={current.red}
                onPress={() => reset({})}
                borderRadius={6}
                height={40}
              />
            </View>
            <View style={{ flex: 1 }}>
              <EButton
                onPress={handleSubmit(onSubmit)}
                title="SUBMIT"
                bgColor={current.green}
                type="b16"
                borderRadius={6}
                height={40}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default AnnouncementModal;

const styles = StyleSheet.create({
  boarder: {
    borderBottomColor: colors.dark.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 6,
    marginTop: 10,
  },
});
