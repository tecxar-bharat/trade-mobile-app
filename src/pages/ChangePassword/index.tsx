// Library Imports
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import EButton from "@commonComponents/EButton";
import EHeader from "@commonComponents/EHeader";
import ESafeAreaView from "@commonComponents/ESafeAreaView";
import { SCREENS } from "@navigation/NavigationKeys";
import { colors, styles } from "@themes/index";
import { IChangePassword } from "@interfaces/user.interface";
import FormInput from "@fields/FormInput";
import { useAppDispatch, useAppSelector } from "@store/index";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { changePassword, authSelector, logout } from "@reducers/auth.reducer";
import images from "@assets/images";
import { themeSelector } from "@reducers/theme.reducer";
import {
  deviceHeight,
  deviceWidth,
  getHeight,
  moderateScale,
} from "@common/constants";
const ChangePassword = (props: any) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => authSelector(state, "loading"));
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const { control, handleSubmit } = useForm({
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    mode: "onBlur",
  });
  const onSubmit = async (formData: IChangePassword) => {
    let object = {
      payload: formData,
      onSuccess,
      onError,
    };
    if (formData.newPassword === formData.confirmPassword) {
      await dispatch(changePassword(object));
    } else {
      Toast.show({
        type: "error",
        text1: "New password and confirm password does not match",
      });
    }
  };
  const onSuccess = (message: any) => {
    setTimeout(async () => {
      Toast.show({
        type: "success",
        text1: message,
      });
      if (userData?.changePasswordRequire) {
        await dispatch(logout());

        props.navigation.reset({
          index: 0,
          routes: [{ name: SCREENS.Login }],
        });

        setTimeout(() => {
          globalThis.realm.write(() => {
            globalThis.realm.deleteAll();
          });
        }, 1000);
      } else {
        props.navigation.navigate(SCREENS.Drawer);
      }
    }, 1000);
  };
  const onError = (err: any) => {
    setTimeout(() => {
      Toast.show({
        type: "error",
        text1: err,
      });
    }, 1000);
  };
  const onLocalError = (err: any) => {
    console.log("onError", err);
  };

  return (
    <ESafeAreaView>
      <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
        <EHeader
          title="Change Password"
          isHideBack={userData?.changePasswordRequire!}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: current.backgroundColor,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          <View style={localStyles.mainContainer}>
            <View style={{ flex: 1 }}>
              <FormInput
                name="oldPassword"
                required={true}
                type="password"
                control={control}
                label={"Old Password"}
                placeholder={"Old Password"}
              />
              <FormInput
                name="newPassword"
                required={true}
                type="password"
                control={control}
                label={"New Password"}
                placeholder={"New Password"}
              />
              <FormInput
                name="confirmPassword"
                required={true}
                type="password"
                control={control}
                label={"Confirm Password"}
                placeholder={"Confirm Password"}
              />
            </View>
            <EButton
              title={"SUBMIT"}
              type={"S16"}
              bgColor={colors.light.new_primary}
              containerStyle={localStyles.signBtnContainer}
              onPress={handleSubmit(onSubmit, onLocalError)}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </ESafeAreaView>
  );
};

export default ChangePassword;

const localStyles = StyleSheet.create({
  mainContainer: {
    ...styles.ph20,
    flexDirection: "column",
    flex: 1,
  },
  divider: {
    ...styles.rowCenter,
    ...styles.mv30,
  },
  orContainer: {
    height: getHeight(1),
    width: "30%",
  },
  signBtnContainer: {
    ...styles.center,
    width: "100%",
    ...styles.mv20,
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
    height: deviceHeight - getHeight(600),
    width: deviceWidth - moderateScale(40),
  },
  rendetItemConatiner: {
    // width: deviceWidth,
    // ...styles.ph20,
    ...styles.center,
    // borderWidth: 1,
    flex: 1,
  },
});

// export default ChangePassword;
