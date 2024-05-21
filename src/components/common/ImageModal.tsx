import FormInput from "@fields/FormInput";
import { getFileName } from "@utils/helpers";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Alert, TouchableOpacity, View } from "react-native";
import RNFS from "react-native-fs";
import ImageCropPicker from "react-native-image-crop-picker";
import Modal from "react-native-modal";
import { useAppSelector } from "../../store";
import { themeSelector } from "../../store/reducers/theme.reducer";
import CloseIcon from "./CloseIcon";
import EButton from "./EButton";
import EText from "./EText";
const ImageModal = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const {
    control,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      withdrawalProof: undefined,
    },
    mode: "all",
  });
  const openImagePicker = () => {
    ImageCropPicker.openPicker({
      mediaType: "photo",
    })
      .then((response) => {
        RNFS.readFile(response.path, "base64")
          .then((base64String) => {
            props.setImage({
              filename: getFileName(response),
              sourceURL: response.sourceURL,
              base64: base64String,
            });
          })
          .catch((error) => {
            Alert.alert("Error", "Failed to read image file");
          });
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to open image picker");
      });
  };
  useEffect(() => {
    reset({});
  }, [props.visible]);

  return (
    <View>
      <Modal isVisible={props.visible} onDismiss={props.onDismiss}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 5,
            }}
          >
            <EText type="m14">{props.title}</EText>
            <TouchableOpacity
              onPress={() => {
                props.onDismiss();
              }}
            >
              <CloseIcon />
            </TouchableOpacity>
          </View>

          <View
            style={{
              justifyContent: "space-between",
              padding: 5,
            }}
          >
            <FormInput
              required={"UTR Number is required"}
              control={control}
              name="transactionId"
              placeholder="Enter UTR Number"
              label={"UTR Number"}
            />
            <FormInput
              required={"Payment date required"}
              control={control}
              type="date"
              name="paymentDate"
              placeholder="Enter Date"
              label={"Payment Date"}
              maximumDate={new Date()}
            />

            <TouchableOpacity
              onPress={openImagePicker}
              style={{
                backgroundColor: current.primary,
                alignSelf: "flex-start",
                padding: 5,
                borderRadius: 6,
                marginTop: 5,
                marginBottom: 8
              }}
            >
              <EText color={current.white} type="r14">
                {"Choose Files"}
              </EText>
            </TouchableOpacity>
            {!props.image?.base64 && (
              <EText type="r12" color={current.red}>
                {props.errors}
              </EText>
            )}
            {props.image ? (
              <EText>{props.image?.filename}</EText>
            ) : (
              <EText color={current.textColor}>{"No File Found"}</EText>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={props.onDismiss}>
              <EText type='s16' style={{ color: "grey", marginRight: 10 }}>
                {"Cancel"}
              </EText>
            </TouchableOpacity>
            <View style={{ width: 120 }}>
              <EButton
                style={{ textAlign: "center", paddingHorizontal: 10 }}
                title={"CONFIRM"}
                height={40}
                onPress={handleSubmit(props.onPress)}
                bgColor={current.primary}
                loading={props.confirmLoading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default ImageModal;
