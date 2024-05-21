import images from "@assets/images";
import { moderateScale } from "@common/constants";
import EButton from "@commonComponents/EButton";
import EHeader from "@commonComponents/EHeader";
import FormInput from "@fields/FormInput";
import FormMultiRadio from "@fields/FormMultiRadio";
import FormSelect from "@fields/FormSelect";
import { SCREENS } from "@navigation/NavigationKeys";
import { themeSelector } from "@reducers/theme.reducer";
import commonService from "@services/common.service";
import ledgerService from "@services/ledger.service";
import { useAppSelector } from "@store/index";
import { colors } from "@themes/index";
import { NumberValidation, toNumber } from "@utils/constant";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
const JVEntry = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [allUserList, setAllUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control, reset } = useForm({
    defaultValues: { caseType: "receipt", remarks: "" },

    mode: "all",
  });

  const onSubmit = async (payload: any) => {
    payload.caseType = "jv";
    payload.amount = toNumber(payload.amount);
    payload.date = moment(payload.date).format("YYYY-MM-DD");
    setLoading(true);
    await ledgerService
      .createJVEntry(payload)
      .then((res) => {
        if (res.data?.statusCode === 200 || res.data?.statusCode === 201) {
          setTimeout(() => {
            Toast.show({ type: "success", text1: res.data.message });
            reset({});
            props.navigation.goBack();
          }, 1000);
        } else {
          Toast.show({ type: "error", text1: res.data.message });
        }
      })
      .catch((error) => Toast.show({ type: "error", text1: error }));
    setLoading(true);
  };
  useEffect(() => {
    commonService.getUserNameList().then((e) => {
      setAllUserList(e.data.data as any);
    });
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: current.backgroundColor1,
      }}
    >
      <EHeader title="JV Entry" isHideBack={false} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          backgroundColor: current.backgroundColor,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          marginTop: 10,
        }}
      >
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView>
            <FormSelect
              control={control}
              labelKey="name"
              valueKey="id"
              required={"UserId is required"}
              type="select"
              name="debitAccountUserId"
              isClearable={true}
              label={"From Account"}
              options={allUserList}
              marginTop={10}
            />

            <FormSelect
              control={control}
              labelKey="name"
              valueKey="id"
              required={"UserId is required"}
              type="select"
              name="creditAccountUserId"
              isClearable={true}
              label={"To Account"}
              options={allUserList}
              marginTop={10}
            />

            <FormInput
              label={"Date"}
              control={control}
              name="date"
              required={"Date is required"}
              type="date"
              keyBoardType={"default"}
              maximumDate={new Date()}
            />
            <FormMultiRadio
              name="caseType"
              direction={"row"}
              control={control}
              options={[
                { id: "receipt", label: "Receipt" },
                { id: "payment", label: "Payment" },
              ]}
              labelKey="label"
              valueKey="id"
              radioSize={20}
              radioColor={current.primary}
              label={"Type"}
            />
            <FormInput
              control={control}
              keyboardType={"numeric"}
              required={"Amount required"}
              validate={NumberValidation}
              name="amount"
              inWords={"inWords"}
              label={"Amount"}
              placeholder={"Please Enter Amount"}
            />
            <FormInput
              control={control}
              name="remarks"
              inWords={"inWords"}
              label={"Remarks"}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <View
        style={[
          localStyles.touchableBtn,
          { backgroundColor: current.backgroundColor },
        ]}
      >
        <EButton
          title={"CLEAR"}
          bgColor={current.red}
          height={moderateScale(40)}
          containerStyle={{ width: "45%" }}
          onPress={() => reset({})}
        />
        <EButton
          title={"SUBMIT"}
          bgColor={current.green}
          color={current.white}
          height={moderateScale(40)}
          containerStyle={{ width: "45%" }}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          // onPress={onPressLogOut}
        />
      </View>
    </View>
  );
};
export default JVEntry;
const localStyles = StyleSheet.create({
  touchableBtn: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  submit: {
    backgroundColor: colors.dark.new_primary,
    width: "45%",
    borderRadius: 12,
    marginTop: 20,
  },
  cancel: {
    backgroundColor: colors.dark.red,
    width: "45%",
    borderRadius: 12,
    marginTop: 20,
  },
  submitandcancel: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    padding: 8,
    textAlign: "center",
  },
});
