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
import { useAppSelector } from "@store/index";
import FormInput from "@fields/FormInput";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import payInPayoutService from "@services/payInPayout.service";
import FormMultiRadio from "@fields/FormMultiRadio";
import EButton from "@commonComponents/EButton";
import FormSelect from "@fields/FormSelect";
import { ILoginPayload } from "@interfaces/user.interface";
import authService from "@services/auth.service";
import { LoggedUser } from "@db/schemas/loggedUser.model";
import CloseIcon from "@commonComponents/CloseIcon";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
}

const LinkAccountModal = ({ visible, onDismiss, onSuccess }: Props) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<ILoginPayload>({
    defaultValues: {
      password: '',
      userId: ''
    },
    mode: "all",
  });

  const onSubmit = async (formData: ILoginPayload) => {
    setLoading(true)
    try {
      const res: any = await authService.login(formData)
      if (res && res.data) {
        const currentUser = LoggedUser.getActiveUser(globalThis.realm);
        const usersBySameId = LoggedUser.getById(globalThis.realm, res.data.data.userId);
        if (usersBySameId) {
          setError('Account is already linked.')
        }
        else {
          await LoggedUser.create(
            {
              ...res.data.data,
              alertSound: false,
              rememberMe: currentUser?.rememberMe ?? false,
              Cookie: res.headers['set-cookie']?.[0],
              isCurrentLoggedIn: false,
            },
            globalThis.realm,
          );
          reset();
          onDismiss();
        }
      }
      else {
        setError(res.response.data.message)
      }
    } catch (error: any) {
      setError(error.response.data.message)
    }
    setLoading(false)
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
              {"Link Account"}
            </EText>
            <TouchableOpacity onPress={onDismiss}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.boarder} />
          <KeyboardAvoidingView>
            <FormInput
              required={"UserId is required"}
              control={control}
              name="userId"
              placeholder="Enter userId"
              label={"UserId"}
              onValueChange={() => {
                setError("")
              }}
            />
            <FormInput
              name="password"
              required={true}
              type="password"
              control={control}
              label={"Password"}
              placeholder={"Enter Password"}
              onValueChange={() => {
                setError("")
              }}
            />


            {error ?
              <EText type='r14' color={current.red}>{error}</EText>
              : null}

          </KeyboardAvoidingView>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              backgroundColor: current.backgroundColor,
              paddingBottom: 10,
              marginTop: 16
            }}
          >
            <View style={{ flex: 1 }}>
              <EButton
                title={"CANCEL"}
                type="b16"
                bgColor={current.red}
                onPress={() => { reset({}); onDismiss() }}
                borderRadius={6}
                height={40}
                disabled={loading}
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
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default LinkAccountModal;

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
