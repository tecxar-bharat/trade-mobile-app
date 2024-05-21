import { themeSelector } from "@reducers/theme.reducer";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import Modal from "react-native-modal";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { colors } from "@themes/index";
import EText from "@commonComponents/EText";
import { useAppDispatch, useAppSelector } from "@store/index";
import FormInput from "@fields/FormInput";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import payInPayoutService from "@services/payInPayout.service";
import FormMultiRadio from "@fields/FormMultiRadio";
import EButton from "@commonComponents/EButton";
import FormSelect from "@fields/FormSelect";
import CloseIcon from "@commonComponents/CloseIcon";
import { getAvailableBalance } from "@store/reducers/auth.reducer";
import { NumberIntValidation, NumberValidation } from "@utils/constant";
import { LoggedUser } from "@db/schemas/loggedUser.model";
import { formatIndianAmount } from "@utils/helpers";

interface ICashEntryForm {
  amount: string;
  type: string;
  status: string;
  bankAccountId: number;
  withdrawalType: string | undefined;
  accountNumber: string;
  accountHolderName: string;
  bankName: string;
  remarks?: string;
  ifscCode: string;
  upiAddress: string;
}
interface Props {
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

const AddWithdrawalModal = ({ visible, onDismiss, onSuccess }: Props) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [loading, setLoading] = useState(false);
  const [withdrawalState, setWithdrawal] = useState<string>();
  const userData = LoggedUser.getActiveUser(globalThis.realm);
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    getValues,
  } = useForm<ICashEntryForm>({
    defaultValues: {
      amount: undefined,
      status: "pending",
      withdrawalType: undefined,
      accountNumber: undefined,
      accountHolderName: undefined,
      bankName: undefined,
      ifscCode: undefined,
      remarks: undefined,
      upiAddress: undefined,
    },
    mode: "all",
  });

  useEffect(() => {
    setWithdrawal(undefined);
    reset();
  }, [visible]);

  const onSubmit = async (formData: ICashEntryForm) => {
    const payload = {
      amount: Number(formData.amount),
      withdrawalType: withdrawalState,
      accountNumber: formData.accountNumber,
      accountHolderName: formData.accountHolderName,
      bankName: formData.bankName,
      ifscCode: formData.ifscCode,
      upiAddress: formData.upiAddress,
      remarks: formData.remarks,
      type: "withdrawal",
      status: formData.status,
    };
    setLoading(true);

    await payInPayoutService
      .createPayments(payload)
      .then((res) => {
        Toast.show({ type: "success", text1: res.data.message });
        reset({});
        onSuccess();
        onDismiss();
      })
      .catch((error) =>
        Toast.show({ type: "error", text1: error.response.data.message[0] })
      );
    setLoading(false);
  };

  const data = watch("withdrawalType");

  useEffect(() => {
    setValue("withdrawalType", data);
    setWithdrawal(data);
  }, [data]);

  useEffect(() => {
    if (visible) {
      dispatch(getAvailableBalance());
    }
  }, [visible]);

  const validateBalance = (val: string) => {
    const isValidNumber = NumberValidation(val);
    if (isValidNumber === true) {
      if (userData && userData.balance) {
        if (parseFloat(val) > userData?.balance) {
          return `Insufficient Balance. Available Balance is ${formatIndianAmount(
            userData.balance
          )}`;
        }
        return true;
      } else {
        return `Insufficient Balance. Available Balance is 0`;
      }
    } else {
      return isValidNumber;
    }
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
              {"Withdraw Request"}
            </EText>
            <TouchableOpacity onPress={onDismiss}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.boarder} />
          <FormSelect
            control={control}
            labelKey="name"
            valueKey="id"
            required={"Payment method require"}
            type="select"
            name="withdrawalType"
            isClearable={true}
            label={"Payment Method"}
            options={[
              { id: "bank", name: "Bank" },
              { id: "upiId", name: "Upi" },
            ]}
          />
          <KeyboardAvoidingView>
            <ScrollView>
              <FormInput
                required={"Amount required"}
                control={control}
                keyboardType={"numeric"}
                name="amount"
                placeholder="Enter Amount"
                label={"Amount"}
                validate={validateBalance}
              />
              {withdrawalState === "upiId" && (
                <FormInput
                  control={control}
                  required={"UpiAddress required"}
                  type="text"
                  name="upiAddress"
                  label={"Upi Id"}
                />
              )}
              {withdrawalState === "bank" && (
                <View>
                  <FormInput
                    control={control}
                    type="text"
                    name="accountHolderName"
                    label={"Account Holder Name"}
                    placeholder={"Enter Name"}
                  />
                  <FormInput
                    control={control}
                    type="text"
                    name="bankName"
                    label={"Bank Name"}
                    placeholder={"Enter Name"}
                  />
                  <FormInput
                    control={control}
                    type="text"
                    name="accountNumber"
                    label={"Account Number"}
                    placeholder={"Enter Name"}
                    keyboardType={"numeric"}
                  />
                  <FormInput
                    control={control}
                    type="text"
                    name="ifscCode"
                    label={"IFSC"}
                    placeholder={"Enter Name"}
                  />
                </View>
              )}
              <FormInput
                required={false}
                control={control}
                name="remarks"
                placeholder="Enter Remark"
                label={"Remark"}
              />
            </ScrollView>
          </KeyboardAvoidingView>

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
          {/* <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => reset({})}
              style={{
                backgroundColor: current.red,
                borderRadius: 6,
                padding: 5,
                width: "45%",
              }}
            >
              <EText
                style={{
                  fontSize: 14,
                  textAlign: "center",
                  color: current.white,
                }}
              >
                Clear
              </EText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: current.green,
                borderRadius: 6,
                padding: 5,
                width: "45%",
              }}
            >
              <EText
                style={{
                  color: current.white,
                  fontSize: 14,
                  textAlign: "center",
                }}
                onPress={handleSubmit(onSubmit)}
              >
                Confirm
              </EText>
            </TouchableOpacity>
          </View> */}
        </View>
      </Modal>
    </View>
  );
};
export default AddWithdrawalModal;

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
