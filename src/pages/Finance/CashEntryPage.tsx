import images from "@assets/images";
import { moderateScale } from "@common/constants";
import EButton from "@commonComponents/EButton";
import EHeader from "@commonComponents/EHeader";
import EText from "@commonComponents/EText";
import FormInput from "@fields/FormInput";
import FormMultiRadio from "@fields/FormMultiRadio";
import FormSelect from "@fields/FormSelect";
import SelectCommon from "@fields/Select";
import { IAdminNameList } from "@interfaces/common";
import { SCREENS } from "@navigation/NavigationKeys";
import { getAdminNameList } from "@reducers/adminReducer";
import { authSelector } from "@reducers/auth.reducer";
import { brokerSelector, getUserBrokerNameList } from "@reducers/brokerReducer";
import {
  cashBookSelector,
  flushState,
  getBalanceByUserId,
  setUserId,
} from "@reducers/cashBookReducer";
import { createLedger, updateLedgerById } from "@reducers/ledgerReducer";
import { getMasterNameList } from "@reducers/masterReducer";
import { themeSelector } from "@reducers/theme.reducer";
import commonService from "@services/common.service";
import ledgerService from "@services/ledger.service";
import { useAppDispatch, useAppSelector } from "@store/index";
import { colors } from "@themes/index";
import { NumberValidation, toNumber } from "@utils/constant";
import { formatIndianAmount } from "@utils/helpers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Platform } from "react-native";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
const CashEntry = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [dataList, setDataList] = useState<IAdminNameList[]>([]);
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control, clearErrors, reset, watch } = useForm({
    defaultValues: {
      userType: undefined,
      userId: null,
      caseType: "receipt",
      amount: "",
      remarks: "",
      date: null,
    },
    mode: "onChange",
  });

  const userTypeOptions = [
    {
      name: "Admin",
      id: "admin",
    },
    {
      name: "Master",
      id: "master",
    },
    {
      name: "Broker",
      id: "broker",
    },
    {
      name: "User",
      id: "user",
    },
  ];

  const onSubmit = async (payload: any) => {
    if (payload.caseType === "receipt") {
      payload.credit = toNumber(payload.amount);
      payload.debit = null;
      payload.date = moment(payload.date).format("YYYY-MM-DD");
    } else {
      payload.debit = toNumber(payload.amount);
      payload.credit = null;
      payload.date = moment(payload.date).format("YYYY-MM-DD");
    }
    setLoading(true);
    await ledgerService
      .createLedger(payload)
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

  const caseTypeOption = [
    {
      label: "Receipt",
      id: "receipt",
    },
    {
      label: "Payment",
      id: "payment",
    },
  ];

  const userType = watch("userType");

  useEffect(() => {
    switch (userType) {
      case "admin":
        commonService.getAdminNameList().then((e) => {
          setDataList(e.data.data as IAdminNameList[]);
        });
        break;
      case "master":
        commonService.getMasterNameList().then((e) => {
          setDataList(e.data.data as IAdminNameList[]);
        });
        break;
      case "broker":
        commonService.getBrokerNameList().then((e) => {
          setDataList(e.data.data as IAdminNameList[]);
        });
        break;
      case "user":
        commonService.getUserNameList().then((e) => {
          setDataList(e.data.data as IAdminNameList[]);
        });
        break;
      default:
        break;
    }
  }, [userType]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: current.backgroundColor1,
      }}
    >
      <EHeader title="Cash Entry" isHideBack={false} />
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            <FormSelect
              control={control}
              labelKey="name"
              valueKey="id"
              required={"UserType is required"}
              type="select"
              name="userType"
              isClearable={false}
              label={"User Type"}
              options={userTypeOptions}
              marginTop={10}
            />
            <FormSelect
              control={control}
              labelKey="name"
              valueKey="id"
              required={"User is required"}
              type="select"
              name="userId"
              isClearable={true}
              label={"User"}
              options={dataList}
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
              label={"Type"}
              required={"Please select case type"}
              control={control}
              customLabelClass="customLabel"
              direction={"row"}
              options={caseTypeOption}
              labelKey="label"
              valueKey="id"
              radioColor={current.primary}
            />

            <FormInput
              control={control}
              keyboardType={"numeric"}
              required={true}
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
              placeholder={"Please Enter Remarks"}
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
          color={current.white}
          containerStyle={{ width: "45%" }}
          onPress={() => reset({})}
        />
        <EButton
          title={"SUBMIT"}
          bgColor={current.green}
          color={current.white}
          containerStyle={{ width: "45%" }}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          // onPress={onPressLogOut}
        />
      </View>
    </View>
  );
};
export default CashEntry;
const localStyles = StyleSheet.create({
  touchableBtn: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBottom: 10,
    paddingHorizontal: 16,
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
