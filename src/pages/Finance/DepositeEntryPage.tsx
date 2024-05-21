import images from "@assets/images";
import EHeader from "@commonComponents/EHeader";
import EText from "@commonComponents/EText";
import FormInput from "@fields/FormInput";
import FormMultiRadio from "@fields/FormMultiRadio";
import SelectCommon from "@fields/Select";
import { getAdminNameList } from "@reducers/adminReducer";
import { authSelector } from "@reducers/auth.reducer";
import { getUserBrokerNameList } from "@reducers/brokerReducer";
import {
  cashBookSelector,
  createCashBook,
  flushState,
  getBalanceByUserId,
  setUserId,
} from "@reducers/cashBookReducer";
import { getMasterNameList } from "@reducers/masterReducer";
import { themeSelector } from "@reducers/theme.reducer";
import {
  getUserNameList,
  updateAccountById,
  userSelector,
} from "@reducers/userReducer";
import { useAppDispatch, useAppSelector } from "@store/index";
import { colors } from "@themes/index";
import {
  NumberValidation,
  toNumber,
} from "@utils/constant";
import { formatIndianAmount } from "@utils/helpers";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
const DepositEntry = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const { handleSubmit, control } = useForm({
    defaultValues: {
      ...props?.userData,
      caseType: "deposit",
      date: new Date(),
    },
    mode: "onChange",
  });

  const allUserNameList = useAppSelector((state) =>
    userSelector(state, "allUserNameList")
  );
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const AdminId = useAppSelector((state) => cashBookSelector(state, "AdminId"));
  const MasterId = useAppSelector((state) =>
    cashBookSelector(state, "MasterId")
  );
  const UserId = useAppSelector((state) => cashBookSelector(state, "UserId"));
  const balanceOfUser = useAppSelector((state) =>
    cashBookSelector(state, "balanceOfUser")
  );
  const [loading, setLoading] = useState<boolean>(false);
  console.log("loading::: ", loading);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (userData?.role.slug === "superadmin") {
      dispatch(getAdminNameList());
    } else if (userData?.role.slug === "admin") {
      dispatch(getMasterNameList({ userId: userData && userData.id }));
    } else if (userData?.role.slug === "master") {
      dispatch(getUserBrokerNameList({}));
    }
    return () => {
      dispatch(flushState());
    };
  }, []);
  useEffect(() => {
    if (AdminId) {
      dispatch(getMasterNameList({ userId: AdminId }));
    } else {
      dispatch(getMasterNameList({}));
    }
  }, [AdminId, dispatch]);

  useEffect(() => {
    if (MasterId) {
      dispatch(getUserNameList({ userId: MasterId }));
    } else {
      dispatch(getUserNameList({}));
    }
  }, [MasterId, dispatch]);
  useEffect(() => {
    if (UserId) {
      dispatch(getBalanceByUserId({ userId: UserId, type: "deposit" }));
    }
  }, [UserId]);
  const onSubmit = async (payload: any) => {
    payload.userId =
      (UserId && UserId) || (MasterId && MasterId) || AdminId || AdminId;
    if (payload.caseType === "withdraw") {
      payload.debit = toNumber(payload.debit);
      payload.credit = null;
    } else {
      payload.credit = toNumber(payload.debit);
      payload.debit = null;
    }
    const object = {
      payload,
      onSuccess,
      onError,
    };
    if (props.userData && props.userData.id) {
      payload.userId = props.userData.userId;
      payload.id = toNumber(props.userData.id);
      setLoading(true);
      dispatch(updateAccountById(object));
      setLoading(false);
    } else {
      setLoading(true);
      dispatch(createCashBook(object));
      setLoading(false);
    }
  };
  const onSuccess = (message: string) => {
    setTimeout(() => {
      Toast.show({
        type: "success",
        text1: message,
      });
      dispatch(flushState());
    }, 1000);
    props.navigation.goBack();
  };
  const onError = (err: any) => {
    Toast.show({ type: "error", text1: err });
  };
  const caseTypeOption = [
    {
      label: "Deposit",
      id: "deposit",
    },
    {
      label: "Withdraw",
      id: "withdraw",
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: current.backgroundColor,
      }}
    >
      <EHeader
        title="Deposit Entry"
        isHideBack={false}
      />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView>
            <SelectCommon
              labelKey="name"
              valueKey="id"
              className="customPadding-right mb-3 userBox"
              label={"User ID"}
              type="select"
              required={userData?.role.slug === "master" ? true : false}
              placeholder="Select Client"
              value={UserId}
              isClearable={true}
              options={
                MasterId
                  ? allUserNameList
                  : userData?.role.slug === "master"
                    ? allUserNameList
                    : []
              }
              onChange={(val: number) => dispatch(setUserId(val))}
            />
            <EText style={{ marginTop: 5 }} type="b14">
              {UserId ? formatIndianAmount(balanceOfUser) : ""}
            </EText>
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
            />

            <FormInput
              label={"Date"}
              control={control}
              name="date"
              required={true}
              type="date"
              keyBoardType={"default"}
            />
            <FormInput
              control={control}
              keyboardType={"numeric"}
              required={true}
              validate={NumberValidation}
              name="debit"
              inWords={"inWords"}
              label={"Amount"}
              placeholder={"Please Enter Amount"}
            />
            <FormInput
              control={control}
              required={true}
              keyboardType={"numeric"}
              name="remarks"
              inWords={"inWords"}
              label={"Remarks"}
              placeholder={"Please Enter Remarks"}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <View style={localStyles.touchableBtn}>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit, onError)}
          style={localStyles.submit}
        >
          <EText style={localStyles.submitandcancel}>Submit</EText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={localStyles.cancel}
        >
          <EText style={localStyles.submitandcancel}>Cancel</EText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default DepositEntry;
const localStyles = StyleSheet.create({
  touchableBtn: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 10,
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
