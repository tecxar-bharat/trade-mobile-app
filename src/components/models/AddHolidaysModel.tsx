import { moderateScale } from "@common/constants";
import CloseIcon from "@commonComponents/CloseIcon";
import EButton from "@commonComponents/EButton";
import EText from "@commonComponents/EText";
import FormInput from "@fields/FormInput";
import FormSelect from "@fields/FormSelect";
import { themeSelector } from "@reducers/theme.reducer";
import holidaysService from "@services/holidays.service";
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
interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
}

const AddHolidayModal = ({ visible, onDismiss, onSuccess }: Props) => {
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

  const onSubmit = async (formData: any) => {
    setLoading(true);
    await holidaysService
      .create(formData)
      .then((res) => {
        Toast.show({ type: "success", text1: res.data.message });

        reset({});
        onDismiss();
      })
      .catch((error) =>
        Toast.show({ type: "error", text1: error.response.data.message[0] })
      );
    setLoading(false);
  };

  const segmentIdIdValue = watch("segmentId");

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
              {"Holiday"}
            </EText>
            <TouchableOpacity onPress={onDismiss}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.boarder} />
          <KeyboardAvoidingView>
            <ScrollView>
              <FormInput
                required={"Name is required"}
                control={control}
                name="name"
                placeholder="Enter Name"
                label={"Name"}
              />
              <FormInput
                required={"Date is required"}
                control={control}
                type="date"
                name="date"
                placeholder="Enter Date"
                label={"Date"}
              />
              <FormSelect
                control={control}
                labelKey="name"
                valueKey="id"
                required={"Segment is required"}
                type="select"
                name="segmentId"
                isClearable={true}
                label={"Segment"}
                options={[
                  { id: 1, name: "NSE" },
                  { id: 3, name: "MCX" },
                ]}
              />
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
export default AddHolidayModal;

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
