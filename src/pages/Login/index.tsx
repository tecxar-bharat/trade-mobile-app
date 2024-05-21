// Library Imports
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
// Local Imports
import images from "@assets/images";
import {
  LOG_IN_CRED,
  deviceHeight,
  deviceWidth,
  getHeight,
  moderateScale,
} from "@common/constants";
import EButton from "@components/common/EButton";
import FormInput from "@fields/FormInput";
import SwitchButton from "@fields/SwitchButton";
import { ILoginPayload } from "@interfaces/user.interface";
import { SCREENS } from "@navigation/NavigationKeys";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  authSelector,
  loginUser,
  setDefaultEmailPassword,
} from "@store/reducers/auth.reducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { styles } from "@themes/index";
import { removeUserDetail } from "@utils/asyncstorage";
import { setAsyncStorageData } from "@utils/helpers";
import { useForm } from "react-hook-form";
import { Image } from "react-native";
import Toast from "react-native-toast-message";
const Login = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const userData = useAppSelector((state) => authSelector(state, "userData"));

  const defaultEmail = useAppSelector((state) =>
    authSelector(state, "defaultEmail")
  ) as string;

  const defaultPassword = useAppSelector((state) =>
    authSelector(state, "defaultPassword")
  ) as string;

  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector((state) =>
    authSelector(state, "isAuthenticated")
  );
  const loading = useAppSelector((state) =>
    authSelector(state, "loading")
  ) as boolean;

  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const { control, handleSubmit } = useForm({
    defaultValues: { userId: defaultEmail, password: defaultPassword },
    mode: "onBlur",
  });

  const onSubmit = async (formData: ILoginPayload) => {
    if (rememberMe) {
      await setAsyncStorageData(LOG_IN_CRED, formData);
      dispatch(setDefaultEmailPassword(formData));
    } else {
      await removeUserDetail(LOG_IN_CRED);
      dispatch(setDefaultEmailPassword({ userId: "", password: "" }));
    }
    let object = {
      payload: { ...formData, rememberMe },
      onError,
    };
    await dispatch(loginUser(object));
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (
        userData?.changePasswordRequire &&
        (userData.role.slug === "user" || userData.role.slug === "broker")
      ) {
        props.navigation.reset({
          index: 0,
          routes: [{ name: SCREENS.ChangePassword }],
        });
      } else {
        props.navigation.reset({
          index: 0,
          routes: [{ name: SCREENS.Drawer }],
        });
      }
    }
  }, [isAuthenticated]);
  const onError = (err: any) => {
    Toast.show({
      type: "error",
      text1: err,
    });
  };
  const onLocalError = (err: any) => {
    console.log("onError", err);
  };

  useEffect(() => {
    if (defaultEmail) {
      setRememberMe(true);
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: current.white }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={localStyles.mainContainer}>
          <View style={{ alignItems: "center" }}>
            <Image
              source={images.LoginLogo}
              style={{
                height: 140,
                width: 118,
              }}
              resizeMode="contain"
            />
          </View>
          <>
            <FormInput
              name="userId"
              required={"userId is required"}
              type="text"
              control={control}
              label={"UserId"}
              placeholder="Enter Your User Id"
            />

            <FormInput
              name="password"
              required={"Password is required"}
              type="password"
              control={control}
              label={"Password"}
              placeholder="Enter password"
            />

            <SwitchButton
              label="Remember me on this device"
              value={rememberMe}
              onChange={() => setRememberMe((prev) => !prev)}
            />

            <EButton
              title={"Log In"}
              containerStyle={localStyles.signBtnContainer}
              onPress={handleSubmit(onSubmit, onLocalError)}
              loading={loading}
              bgColor={current.primary}
            />
          </>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;

const localStyles = StyleSheet.create({
  signBtnContainer: {
    ...styles.mt20,
  },
  mainContainer: {
    ...styles.ph20,
    marginTop: 30
  },
  divider: {
    ...styles.rowCenter,
    ...styles.mv30,
  },
  orContainer: {
    height: getHeight(1),
    width: "30%",
  },
  signUpContainer: {
    ...styles.rowCenter,
    ...styles.mv10,
  },
  inputContainerStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    ...styles.ph15,
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  checkboxContainer: {
    ...styles.rowCenter,
    ...styles.mb20,
  },
  socialBtnContainer: {
    ...styles.rowCenter,
    ...styles.mv20,
  },
  socialBtn: {
    ...styles.center,
    height: getHeight(60),
    width: moderateScale(90),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    ...styles.mh10,
  },
  imageStyle: {
    height: deviceHeight - getHeight(680),
    width: deviceWidth - moderateScale(40),
  },
});
