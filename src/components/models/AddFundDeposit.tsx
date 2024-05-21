import { moderateScale } from "@common/constants";
import CloseIcon from "@commonComponents/CloseIcon";
import EButton from "@commonComponents/EButton";
import EText from "@commonComponents/EText";
import FormInput from "@fields/FormInput";
import FormSelect from "@fields/FormSelect";
import { themeSelector } from "@reducers/theme.reducer";
import payInPayoutService from "@services/payInPayout.service";
import { useAppSelector } from "@store/index";
import { colors } from "@themes/index";
import { NumberValidation } from "@utils/constant";
import { getFileName } from "@utils/helpers";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Image,
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

interface ICashEntryForm {
  amount: string;
  type: string;
  status: string;
  paymentProof?: string;
  transactionId: string;
  paymentDate: string;
  remarks?: string;
  bankAccountId: number;
}
interface Props {
  bankAccountData: IBankAccountListData[];
  visible: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
}
interface IResponsePayInPayOutListData {
  statusCode: number;
  message: string;
  data: IPayInPayOutData;
}
interface IPayInPayOutData {
  count: number;
  rows: IPayInPayOutListData[];
}
interface IBankAccountListData {
  id: number;
  userId: number;
  accountNumber: string;
  accountHolderName?: string;
  bankName: string;
  ifscCode: string;
  upiAddress: null;
  accountType: string;
  qrCode: null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  user: User;
}
interface IPayInPayOutListData {
  id: number;
  userId: number;
  type: string;
  amount: number;
  status: string;
  masterName: string;
  paymentProof: any;
  adminName: string;
  remarks?: string;
  transactionId: string;
  withdrawalType?: string;
  paymentDate: string;
  isApproved: string;
  approvedDateTime: string;
  bankAccountId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: string;
  user: User;
  bankAccount: BankAccount;
}

interface User {
  name: string;
}
interface BankAccount {
  accountType: string;
}

const AddFundDepositModal = ({
  bankAccountData,
  visible,
  onDismiss,
  onSuccess,
}: Props) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [loading, setLoading] = useState(false);
  const [accountTypeState, setAccountType] = useState<number>();
  const [error, setError] = useState<string>("");
  const [image, setImage] = useState({});
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    getValues,
  } = useForm<ICashEntryForm>({
    defaultValues: {
      amount: undefined,
      bankAccountId: undefined,
      type: undefined,
      paymentProof: undefined,
      transactionId: undefined,
      status: "pending",
    },
    mode: "all",
  });

  useEffect(() => {
    setAccountType(undefined);
    reset();
  }, [visible]);

  const images = watch;

  const onSubmit = async (formData: ICashEntryForm) => {
    if (!image?.base64) {
      setError("Payment proof is required.");
      return;
    }
    const payload = {
      amount: Number(formData.amount),
      transactionId: formData.transactionId,
      paymentDate: formData.paymentDate,
      bankAccountId: Number(formData.bankAccountId),
      paymentProof: `data:image/png;base64,${image?.base64}`,
      type: "deposit",
      remarks: formData.remarks,
      status: formData.status,
    };
    setLoading(true);
    bankAccountData.length > 0
      ? await payInPayoutService
          .createPayments(payload)
          .then((res) => {
            Toast.show({ type: "success", text1: res.data.message });
            reset({});
            setImage({});
            reset({});
            onSuccess();
            onDismiss();
          })
          .catch((error) =>
            Toast.show({ type: "error", text1: error.response.data.message[0] })
          )
      : Toast.show({
          type: "error",
          text1: "No Bank Details is associated please contact our master.",
        });

    setLoading(false);
  };

  const data = watch("bankAccountId");

  useEffect(() => {
    setValue("bankAccountId", data);
    setAccountType(Number(data));
  }, [data]);

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
              {"Fund Request"}
            </EText>
            <TouchableOpacity onPress={onDismiss}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.boarder} />
          <KeyboardAvoidingView>
            <ScrollView>
              {bankAccountData.length > 0 ? (
                <>
                  <View>
                    <FormSelect
                      control={control}
                      labelKey="accountType"
                      valueKey="id"
                      required={"Payment method require"}
                      type="select"
                      name="bankAccountId"
                      isClearable={true}
                      label={"Payment Method"}
                      options={
                        bankAccountData && bankAccountData.length > 0
                          ? bankAccountData.map((e: any) => {
                              return {
                                id: e.id,
                                accountType: e.accountType.toUpperCase(),
                              };
                            })
                          : []
                      }
                    />
                    {bankAccountData.map((item, index) => {
                      return (
                        <>
                          {item.accountType === "upiId" &&
                          accountTypeState == item.id ? (
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 5,
                                borderWidth: 1,
                                padding: 5,
                                borderRadius: 6,
                                borderColor: current?.bcolor,
                              }}
                            >
                              <EText color={current.greyText}>UpiID</EText>
                              <EText color={current.textColor}>
                                {item.upiAddress}
                              </EText>
                            </View>
                          ) : item.accountType === "bank" &&
                            accountTypeState == item.id ? (
                            <View
                              style={{
                                borderWidth: 1,
                                borderRadius: 6,
                                borderColor: current.bcolor,
                                padding: 5,
                                marginTop: 5,
                              }}
                            >
                              <View style={styles.box}>
                                <EText>{"A/C Holder"}</EText>
                                <EText>{item.accountHolderName}</EText>
                              </View>
                              <View style={styles.box}>
                                <EText>{"Bank Name"}</EText>
                                <EText>{item.bankName}</EText>
                              </View>
                              <View style={styles.box}>
                                <EText>{"A/c No."}</EText>
                                <EText>{item.accountNumber}</EText>
                              </View>

                              <View style={styles.box}>
                                <EText>{"IFSC Code"}</EText>
                                <EText>{item.ifscCode}</EText>
                              </View>
                            </View>
                          ) : (
                            <View style={{ alignItems: "center" }}>
                              {accountTypeState == item.id && (
                                <Image
                                  source={{
                                    uri: item?.qrCode ? item?.qrCode : "",
                                  }}
                                  resizeMode="contain"
                                  style={{
                                    height: moderateScale(100),
                                    width: moderateScale(100),
                                  }}
                                />
                              )}
                            </View>
                          )}
                        </>
                      );
                    })}
                  </View>
                </>
              ) : (
                <>
                  <View>
                    <EText color={current.textColor} type="m14">
                      {"No Bank Details is associated."}
                    </EText>
                  </View>
                </>
              )}
              <FormInput
                required={"Amount required"}
                control={control}
                name="amount"
                placeholder="Enter Amount"
                label={"Amount"}
                keyboardType={"numeric"}
                validate={NumberValidation}
              />
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
              <FormInput
                required={false}
                control={control}
                name="remarks"
                placeholder="Enter Remark"
                label={"Remark"}
              />
              <EText type="m14">{"Attachments"}</EText>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  margin: 5,
                }}
              >
                <View style={{ flex: 1 }}>
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
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  {image ? (
                    <EText type="r10" color={current.textColor}>
                      {image?.filename}
                    </EText>
                  ) : (
                    <EText color={current.textColor}>{"No File Found"}</EText>
                  )}
                </View>
              </View>
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
                onPress={() => {
                  reset({}), setImage({});
                }}
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
export default AddFundDepositModal;

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
