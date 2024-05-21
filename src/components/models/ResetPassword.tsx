import EButton from "@commonComponents/EButton";
import EText from "@commonComponents/EText";
import FormInput from "@fields/FormInput";
import authService from "@services/auth.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { colors } from "@themes/index";
import { toNumber } from "@utils/constant";
import React from "react";
import { useForm } from "react-hook-form";
import {
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import AntDesign from "react-native-vector-icons/AntDesign";
export interface IViewData {
  label: string;
  value: any;
}

interface CommonModalInterface {
  isVisible: boolean;
  onDismiss: () => void;
  viewData: any;
  onComplete: () => void;
  // tradeUserId: number;
}

const ResetPasswordModal = (props: CommonModalInterface) => {

  const current = useAppSelector((state) => themeSelector(state, 'current'));

  const { handleSubmit, control } = useForm<any>({
    mode: "onChange",
    defaultValues: {
      newPassword: "abcd1234",
    },
  });

  const onSubmit = async (payload: any) => {
    payload.userId = toNumber(props.viewData.id);
    await authService.resetPasswordByMaster(payload).then((res: any) => {
      if (res.data.statusCode === 200) {
        Toast.show({ type: "success", text1: res.data.message });
        props.onComplete();
      } else {
        Toast.show({ type: "error", text1: res.data.message });
      }
    });
  };
  return (
    <View>
      <Modal isVisible={props.isVisible} onDismiss={props.onDismiss}>
        <View style={styles.container}>
          <View style={styles.resetView}>
            <View style={{ flexDirection: "column" }}>
              <EText style={styles.resetText}>Reset Password</EText>
            </View>
            <TouchableOpacity onPress={props.onDismiss}>
              <AntDesign
                name="close"
                size={20}
                color={current.textColor}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            <FormInput
              control={control}
              required={true}
              type="password"
              name="newPassword"
              label={"Password"}
            />
            <EButton
              style={{ textAlign: "center", paddingHorizontal: 10 }}
              title={"Submit"}
              height={40}
              onPress={handleSubmit(onSubmit)}
              bgColor={current.primary}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default ResetPasswordModal;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.backgroundColor1,
    borderRadius: 10,
    paddingBottom: 10,
  },
  resetView: {
    // backgroundColor: colors.dark.primary,
    borderTopLeftRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 3,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopRightRadius: 10,
  },
  resetText: {
    fontWeight: "bold",
    fontSize: 18,
    padding: 5,
  },
  submitandcancel: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  btnView: {
    backgroundColor: "#2a9df4",
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  viewStyle: {
    fontSize: 14,
    color: "#FFFFFF",
  },
});
