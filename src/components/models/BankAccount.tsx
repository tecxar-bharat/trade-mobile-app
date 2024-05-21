import CloseIcon from "@commonComponents/CloseIcon";
import EButton from "@commonComponents/EButton";
import EText from "@commonComponents/EText";
import FormInput from "@fields/FormInput";
import FormSelect from "@fields/FormSelect";
import { themeSelector } from "@reducers/theme.reducer";
import bankAccountsService from "@services/bankAccounts.service";
import { useAppSelector } from "@store/index";
import { colors } from "@themes/index";
import { getFileName } from "@utils/helpers";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import RNFS from "react-native-fs";
import ImageCropPicker from "react-native-image-crop-picker";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import EvilIcons from "react-native-vector-icons/EvilIcons";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
  defaultValue: any;
}
interface ICashEntryForm {
  accountType: string;
  upiAddress: string | undefined;
  qrCode: string | undefined;
  bankName: string | undefined;
  ifscCode: string | undefined;
  accountNumber: string | undefined;
}

const BankAccount = ({
  visible,
  onDismiss,
  defaultValue,
  onSuccess,
}: Props) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [loading, setLoading] = useState(false);
  const [bankOption, setBankOption] = useState<boolean>(false);
  const [upiOption, setUpiOption] = useState<boolean>(false);
  const [qrOption, setQROPtion] = useState<boolean>(false);
  const [image, setImage] = useState({});
  const [error, setError] = useState<string>("");
  const { control, handleSubmit, reset, watch } = useForm<ICashEntryForm>({
    defaultValues: defaultValue ?? {
      accountType: "bank",
      upiAddress: undefined,
      qrCode: undefined,
      bankName: undefined,
      ifscCode: undefined,
      accountNumber: undefined,
    },
    mode: "all",
  });

  useEffect(() => {
    reset({});
  }, [visible]);

  const onSubmit = async (formData: any) => {
    if (qrOption) {
      if (!image?.base64) {
        setError("QrCode required.");
        return;
      }
      if (image?.base64) {
        formData.qrCode = `data:image/png;base64,${image?.base64}`;
      }
    }
    setLoading(true);
    if (defaultValue) {
      Object.assign(formData, { id: defaultValue.id });
      await bankAccountsService
        .updateBankAccount(formData)
        .then((res) => {
          Toast.show({ type: "success", text1: res.data.message });
          onDismiss();
          onSuccess();
        })
        .catch((error) => Toast.show({ type: "error", text1: error }));
    } else {
      await bankAccountsService.createBankAccount(formData).then((res) => {
        Toast.show({ type: "success", text1: res.data.message });
        reset({});
        onDismiss();
        onSuccess();
      });
      // .catch((error) => {
      //   Toast.show({ type: "error", text1: error.message });
      // });
    }
    setLoading(false);
  };

  const accountType = watch("accountType");
  const paymentOption = [
    {
      id: "bank",
      name: "Bank",
    },
    {
      id: "upiId",
      name: "UPI",
    },
    {
      id: "qrCode",
      name: "QR Code",
    },
  ];

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paymentOption.forEach((element: { id: string; name: string }) => {
      if (element.id === "bank") {
        if (accountType?.includes(element.id)) {
          setBankOption(true);
        } else {
          setBankOption(false);
        }
      } else if (element.id === "upiId") {
        if (accountType?.includes(element.id)) {
          setUpiOption(true);
        } else {
          setUpiOption(false);
        }
      } else if (element.id === "qrCode") {
        if (accountType?.includes(element.id)) {
          setQROPtion(true);
        } else {
          setQROPtion(false);
        }
      }
    });
  }, [accountType]);

  const openImagePicker = () => {
    ImageCropPicker.openPicker({
      mediaType: "photo",
    })
      .then((response) => {
        RNFS.readFile(response.path, "base64")
          .then((base64String) => {
            setImage({
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

  return (
    <View>
      <Modal
        isVisible={visible}
        onDismiss={onDismiss}
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
            <EText style={{ color: current.textColor, fontSize: 18 }}>
              {"Add"}
            </EText>
            <TouchableOpacity onPress={onDismiss}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.boarder} />
          <FormSelect
            name="accountType"
            control={control}
            required={"Please select Payment Type"}
            options={paymentOption}
            labelKey="name"
            valueKey="id"
            label={"Account Type"}
          />
          <KeyboardAvoidingView>
            <ScrollView>
              {upiOption && (
                <FormInput
                  control={control}
                  required={"UpiAddress required"}
                  type="text"
                  name="upiAddress"
                  label={"Upi Id"}
                />
              )}
              {bankOption && (
                <View>
                  <FormInput
                    control={control}
                    type="text"
                    name="accountHolderName"
                    label={"Account Holder Name"}
                    placeholder={"Enter Name"}
                    required={"Account holder name required"}
                  />
                  <FormInput
                    control={control}
                    type="text"
                    name="bankName"
                    label={"Bank Name"}
                    placeholder={"Enter Name"}
                    required={"Bank Name required"}
                  />
                  <FormInput
                    control={control}
                    type="text"
                    name="ifscCode"
                    label={"IFSC"}
                    placeholder={"Enter Name"}
                    required={"IFS Code required"}
                  />
                  <FormInput
                    control={control}
                    type="text"
                    name="accountNumber"
                    label={"Account Number"}
                    placeholder={"Enter Name"}
                    required={"Account Number required"}
                  />
                </View>
              )}
              {qrOption && (
                <>
                  <View style={{ flex: 1, marginTop: 10 }}>
                    <TouchableOpacity
                      onPress={openImagePicker}
                      style={{
                        backgroundColor: current.primary,
                        alignSelf: "flex-start",
                        padding: 5,
                        borderRadius: 6,
                      }}
                    >
                      <EText color={current.white}>{"Choose Files"}</EText>
                    </TouchableOpacity>
                    {!image?.base64 && (
                      <EText type="r12" color={current.red}>
                        {error}
                      </EText>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    {image ? (
                      <EText type="r12" color={current.textColor}>
                        {image?.filename}
                      </EText>
                    ) : (
                      <EText color={current.textColor}>{"No File Found"}</EText>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
          </KeyboardAvoidingView>

          <View style={styles.boarder} />
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              paddingHorizontal: 10,
              backgroundColor: current.backgroundColor,
              paddingBottom: 10,
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
                loading={loading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default BankAccount;

const styles = StyleSheet.create({
  boarder: {
    borderBottomColor: colors.dark.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    marginTop: 10,
  },
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
});
