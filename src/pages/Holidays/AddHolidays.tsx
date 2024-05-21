// Library Imports
import React, { useState } from "react";
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
import FormSelect from "@fields/FormSelect";
import holidaysService from "@services/holidays.service";
import FormMultiRadio from "@fields/FormMultiRadio";
import moment from "moment";
const AddHolidays = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const { control, handleSubmit, reset, watch } = useForm<{
    firstSession: boolean;
    secondSession: boolean;
    segmentId: undefined;
  }>({
    defaultValues: {
      firstSession: false,
      secondSession: false,
    },
    mode: "all",
  });

  const onSubmit = async (formData: any) => {
    const payload = {
      date: moment(formData.date).format("YYYY-MM-DD") ?? undefined,
      firstSession: formData.firstSession ?? null,
      secondSession: formData.secondSession ?? null,
      name: formData.name,
      segmentId: formData.segmentId,
    };
    setLoading(true);
    try {
      const res = await holidaysService.create(payload);
      Toast.show({ type: "success", text1: res.data.message });
      reset({});
      navigation.goBack();
    } catch (error) {
      Toast.show({ type: "error", text1: error.response.data.message[0] });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const segmentIdIdValue = watch("segmentId");
  const radioButtonsFreshLimit = [
    {
      label: "Yes",
      id: true,
    },
    {
      label: "No",
      id: false,
    },
  ];
  return (
    <ESafeAreaView>
      <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
        <EHeader title="Add Holidays" />
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
              <>
                {segmentIdIdValue === 3 && (
                  <>
                    <View style={{ marginTop: 10 }}>
                      <FormMultiRadio
                        name="firstSession"
                        control={control}
                        direction={"row"}
                        options={radioButtonsFreshLimit}
                        labelKey="label"
                        valueKey="id"
                        label={"First Session"}
                        radioColor={current.primary}
                      />
                      <FormMultiRadio
                        name="secondSession"
                        control={control}
                        direction={"row"}
                        options={radioButtonsFreshLimit}
                        labelKey="label"
                        valueKey="id"
                        label={"Second Session"}
                        radioColor={current.primary}
                      />
                    </View>
                  </>
                )}
              </>
            </View>
            <EButton
              title={"SUBMIT"}
              type={"S16"}
              bgColor={colors.dark.primary}
              containerStyle={localStyles.signBtnContainer}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </ESafeAreaView>
  );
};

export default AddHolidays;

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
