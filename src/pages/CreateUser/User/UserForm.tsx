import EText from "@commonComponents/EText";
import FieldArrayMCX from "@commonComponents/FIeldArrayMCX";
import FormInput from "@fields/FormInput";
import FormMultiRadio from "@fields/FormMultiRadio";
import FormSelect from "@fields/FormSelect";
import { IAdminNameList } from "@interfaces/index";
import commonService from "@services/common.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { MaxMultiplicationValidation } from "@utils/constant";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { IAccountTypes } from "../Master/MasterForm";
import { MobileValidation, PercentageValidation } from "@utils/validators";
import FormSwitchButton from "@fields/FormSwitchButton";
import { authSelector } from "@store/reducers/auth.reducer";
const UserForm = (props: any) => {
  const {
    control,
    watch,
    setValue,
    getValues,
    setNseOption,
    setNseFut,
    setMcx,
    clearErrors,
  } = props;

  const current = useAppSelector((state) => themeSelector(state, "current"));

  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const [brokerOptions, setBrokerOptions] = useState<IAdminNameList[]>([]);
  const [allMasterNameList, setAllMasterNameList] = useState<IAdminNameList[]>(
    []
  );
  const [allBrokerNameList, setAllBrokerNameList] = useState<IAdminNameList[]>(
    []
  );
  const [allAccountTypeOptions, setAllAccountTypeOptions] = useState<
    IAccountTypes[]
  >([]);
  const parentId = watch("parentId");
  const brokerIdValue = watch("brokerId");

  useEffect(() => {
    commonService
      .getMasterNameList()
      .then(({ data }: any) => {
        setAllMasterNameList(data.data);
      })
      .catch(() => {});

    commonService
      .getBrokerNameList()
      .then(({ data }: any) => {
        setAllBrokerNameList(data.data);
      })
      .catch(() => {});
  }, []);
  const getAccountByIdFun = async () => {
    if (parentId) {
      await commonService.getUserAccountTypes(parentId).then((e) => {
        setAllAccountTypeOptions(e.data.data as IAccountTypes[]);
      });
      setBrokerOptions(
        allBrokerNameList.filter((e: any) => e.parent_id === masterId)
      );
    }
  };
  useEffect(() => {
    getAccountByIdFun();
    // eslint-disable-next-line
  }, [parentId, allBrokerNameList]);

  const nseOptValue: string = watch("nseOpt");
  const nseFutValue: string = watch("nseFut");
  const nseMcxValue: string = watch("nseMcx");
  const commissionType: string = watch("commissionType");
  const brokerageType: string = watch("brokerageType");

  useEffect(() => {
    clearErrors("nseMcx");
  }, [nseOptValue, nseFutValue, nseMcxValue]);

  useEffect(() => {
    clearErrors("maxPositionLimitOpt");
    clearErrors("brokerageOpt");
    clearErrors("intradayBrokerageOpt");
    clearErrors("deliveryMultiplicationNseOpt");
    clearErrors("intradayMultiplicationNseOpt");
  }, [nseOptValue]);
  useEffect(() => {
    clearErrors("maxPositionLimitMcx");
    clearErrors("commissionType");
    clearErrors("brokerageType");
    clearErrors("brokerageMcx");
    clearErrors("intradayBrokerageMcx");
  }, [nseMcxValue]);

  useEffect(() => {
    clearErrors("maxPositionLimitFut");
    clearErrors("brokerageFut");
    clearErrors("intradayBrokerageFut");
  }, [nseFutValue]);
  useEffect(() => {
    if (nseFutValue) {
      setNseFut(true);
    } else {
      setNseFut(false);
    }
  }, [nseFutValue]);
  useEffect(() => {
    if (nseMcxValue) {
      setMcx(true);
    } else {
      setMcx(false);
    }
  }, [nseMcxValue]);
  useEffect(() => {
    if (nseOptValue) {
      setNseOption(true);
    } else {
      setNseOption(false);
    }
  }, [nseOptValue]);

  useEffect(() => {
    if (props.type !== "edit") {
      commonService
        .getuserMcxFormScripts()
        .then((res: any) => {
          if (res) {
            setValue("Mcx_lots", res?.data.data);
          }
        })
        .catch(() => {
          setValue("Mcx_lots", []);
        });
    }
  }, []);

  useEffect(() => {
    if (userData?.role?.slug === "master") {
      setValue("parentId", userData.id);
    }
    // eslint-disable-next-line
  }, []);

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
    <View style={{ flex: 1 }}>
      <View
        style={{
          borderColor: current.bcolor,
          ...styles.container,
        }}
      >
        <FormSelect
          control={control}
          labelKey="name"
          valueKey="id"
          required={"Parent id required"}
          type="select"
          name="parentId"
          label={"Master"}
          disabled={userData?.role?.slug === "master" ? true : false}
          options={allMasterNameList}
        />
        <FormSelect
          control={control}
          labelKey="name"
          valueKey="id"
          type="select"
          name="brokerId"
          label={"Broker"}
          options={brokerOptions}
          marginTop={10}
        />
        <FormInput
          control={control}
          required={true}
          type="text"
          name="name"
          label={"Name"}
          placeholder={"Enter Name"}
        />
        <FormInput
          control={control}
          required={"Mobile number is required"}
          validate={MobileValidation}
          name="mobile"
          keyboardType={"numeric"}
          label={"Mobile Number"}
          placeholder={"Enter Number"}
        />
      </View>
      <View
        style={{
          borderColor: current.bcolor,
          ...styles.container,
        }}
      >
        <FormSelect
          control={control}
          labelKey="name"
          valueKey="id"
          required={"Account Type is required"}
          type="select"
          name="quantityScriptGroupId"
          label={"Account Types"}
          options={allAccountTypeOptions}
        />
        <EText type="m14" style={{ marginTop: 5, marginBottom: 5 }}>
          {"Market Type"}
        </EText>
        <FormSwitchButton name="nseOpt" control={control} label={"NSEOPT"} />
        {nseOptValue && (
          <View>
            <FormInput
              control={control}
              name="maxPositionLimitOpt"
              label={"MAX SCRIPT LIMIT"}
              keyboardType={"numeric"}
              placeholder={"Enter Number"}
            />
            <FormInput
              control={control}
              validate={MaxMultiplicationValidation}
              name="intradayMultiplicationNseOpt"
              label={"INTRADAY MULTIPLICATION"}
              keyboardType={"numeric"}
              required={"Please enter value"}
              placeholder={"Enter Number"}
            />
            <FormInput
              control={control}
              validate={MaxMultiplicationValidation}
              name="deliveryMultiplicationNseOpt"
              label={"DELIVERY MULTIPLICATION"}
              required={"Please enter value"}
              keyboardType={"numeric"}
              placeholder={"Enter Number"}
            />
            <EText type="m14">{"NSEOPT (Lot Wise)"}</EText>
            <FormInput
              control={control}
              name="brokerageOpt"
              required={"NSEOPT Deliviry Commission is required"}
              label={"DELIVERY COMMISSION"}
              keyboardType={"numeric"}
              placeholder={"Enter Number"}
            />
            <FormInput
              control={control}
              name="intradayBrokerageOpt"
              required={"NSEOPT Intraday Commission is required"}
              label={"INTRADAY COMMISSION"}
              keyboardType={"numeric"}
              placeholder={"Enter Number"}
            />
            {brokerIdValue && (
              <View>
                <FormInput
                  control={control}
                  labelKey="name"
                  valueKey="id"
                  required={"Brokerage Percentage is required"}
                  label={"BROKER BROKERAGE (Intra.)(%)"}
                  name="nseOptBrokeragePercentage"
                  keyboardType={"numeric"}
                />
                <FormInput
                  control={control}
                  labelKey="name"
                  valueKey="id"
                  required={"Delivery Brokerage Percentage is required"}
                  label={"BROKER BROKERAGE (Del.)(%)"}
                  name="nseOptBrokeragePercentageDelivery"
                  keyboardType={"numeric"}
                />
              </View>
            )}
          </View>
        )}
        <FormSwitchButton name="nseFut" control={control} label={"NSEFUT"} />
        {nseFutValue && (
          <View>
            <FormInput
              control={control}
              name="maxPositionLimitFut"
              label={"NSEFUT SCRIPT LIMIT"}
              keyboardType={"numeric"}
              placeholder={"Enter Number"}
            />
            <EText type="m14">{"NSEFUT (Amount Wise)"}</EText>
            <FormInput
              control={control}
              name="brokerageFut"
              required={"Delivery Commssion is required"}
              label={"DELIVERY COMMISSION (%)"}
              keyboardType={"numeric"}
              placeholder={"Enter Number"}
            />
            <FormInput
              control={control}
              name="intradayBrokerageFut"
              required={"Intraday Commission is required"}
              label={"INTRADAY COMMISSION (%)"}
              keyboardType={"numeric"}
              placeholder={"Enter Number"}
            />
            {brokerIdValue && (
              <View>
                <FormInput
                  control={control}
                  labelKey="name"
                  valueKey="id"
                  required={"Brokerage Percentage is required"}
                  label={"BROKER BROKERAGE (Intra.)(%)"}
                  name="brokeragePercentage"
                  keyboardType={"numeric"}
                />
                <FormInput
                  control={control}
                  labelKey="name"
                  valueKey="id"
                  required={"Delivery Brokerage Percentage is required"}
                  label={"BROKER BROKERAGE (Del.)(%)"}
                  name="brokeragePercentageDelivery"
                  keyboardType={"numeric"}
                />
              </View>
            )}
          </View>
        )}
        <FormSwitchButton name="nseMcx" control={control} label={"NSEMCX"} />
        {nseMcxValue && (
          <View>
            <FormInput
              control={control}
              name="maxPositionLimitMcx"
              label={"MAX SCRIPT LIMIT"}
              keyboardType={"numeric"}
              placeholder={"Enter Number"}
            />
            <FormSelect
              control={control}
              labelKey="name"
              valueKey="id"
              required={"Commission Type is required"}
              type="select"
              name="commissionType"
              label={"SELECT COMMISSION TYPE"}
              options={[
                { id: "script_wise", name: "Script wise" },
                {
                  id: "all",
                  name: "Same for all",
                },
              ]}
            />
            <FormSelect
              control={control}
              labelKey="name"
              valueKey="id"
              required={"select brokerage type"}
              type="select"
              name="brokerageType"
              label={"SELECT BROKERAGE TYPE"}
              marginTop={10}
              options={[
                { id: "amount", name: "Amount wise" },
                {
                  id: "lot",
                  name: "Lot wise",
                },
              ]}
            />
            <EText type="m14" style={{ marginTop: 5 }}>
              {brokerageType === "amount"
                ? "MCXFUT (Amount Wise)"
                : "MCXFUT (Lot Wise)"}
            </EText>
            <FormInput
              control={control}
              name="brokerageMcx"
              required={"MCXFUT Delivery Commission is required"}
              label={`DELIVERY COMMISSION ${
                brokerageType === "amount" ? "(%)" : ""
              }`}
              keyboardType={"numeric"}
              placeholder={"Enter Number"}
            />
            <FormInput
              control={control}
              name="intradayBrokerageMcx"
              required={"MCXFUT Intraday Commission is required"}
              label={`INTRADAY COMMISSION ${
                brokerageType === "amount" ? "(%)" : ""
              }`}
              keyboardType={"numeric"}
              placeholder={"Enter Number"}
            />
            {commissionType === "script_wise" && (
              <View>
                <FieldArrayMCX
                  control={control}
                  name={"Mcx_lots"}
                  required={"Please enter lot"}
                  watch={watch}
                  setValue={setValue}
                  clearErrors={clearErrors}
                  getValues={getValues}
                />
              </View>
            )}
            {brokerIdValue && (
              <View>
                <FormInput
                  control={control}
                  labelKey="name"
                  valueKey="id"
                  required={"Brokerage Percentage is required"}
                  label={"BROKER BROKERAGE (Intra.)(%)"}
                  name="mcxBrokeragePercentage"
                  keyboardType={"numeric"}
                />
                <FormInput
                  control={control}
                  labelKey="name"
                  valueKey="id"
                  required={"Delivery Brokerage Percentage is required"}
                  label={"BROKER BROKERAGE (Del.)(%)"}
                  name="mcxBrokeragePercentageDelivery"
                  keyboardType={"numeric"}
                />
              </View>
            )}
          </View>
        )}
      </View>
      <View
        style={{
          borderColor: current.bcolor,
          ...styles.container,
          paddingBottom: 0,
        }}
      >
        <EText type="m14">{"Other Details"}</EText>
        <FormInput
          control={control}
          name="otherM2mPercentage"
          validate={PercentageValidation}
          required={"Please enter percentage"}
          label={"LOSS ALERT PERCENTAGE"}
          keyboardType={"numeric"}
          placeholder={"Enter Number"}
        />
        <FormInput
          control={control}
          name="deliveryMultiplication"
          required={"Please enter value"}
          label={"Delivery Multiplication"}
          validate={MaxMultiplicationValidation}
          keyboardType={"numeric"}
          placeholder={"Enter Number"}
        />

        <FormInput
          control={control}
          name="intradayMultiplication"
          required={"Please enter value"}
          validate={MaxMultiplicationValidation}
          label={"Intraday Multiplication"}
          keyboardType={"numeric"}
          placeholder={"Enter Number"}
        />
        <View style={styles.radioButton}>
          <FormMultiRadio
            name="orderBetweenHighLow"
            label={"Order Between High and Low"}
            control={control}
            direction={"column"}
            options={radioButtonsFreshLimit}
            labelKey="label"
            valueKey="id"
            radioColor={current.primary}
          />
        </View>
        <View style={styles.radioButton}>
          <FormMultiRadio
            name="isLimitAllow"
            label={"Is Fresh Limit Allow?"}
            control={control}
            direction={"column"}
            options={radioButtonsFreshLimit}
            labelKey="label"
            valueKey="id"
            radioColor={current.primary}
          />
        </View>
        <View style={styles.radioButton}>
          <FormMultiRadio
            name="isApplyAutoSquareOff"
            label={"Apply Auto Square Off?"}
            control={control}
            direction={"column"}
            options={radioButtonsFreshLimit}
            labelKey="label"
            valueKey="id"
            radioColor={current.primary}
          />
        </View>
        <View style={styles.radioButton}>
          <FormMultiRadio
            name="isApplyIntradayAutoSquareOff"
            label={"Apply Intraday Auto Square Off?"}
            control={control}
            direction={"column"}
            options={radioButtonsFreshLimit}
            labelKey="label"
            valueKey="id"
            radioColor={current.primary}
          />
        </View>
        <View style={styles.radioButton}>
          <FormMultiRadio
            name="onlyPositionSquareOff"
            label={"Only Position Square Off?"}
            control={control}
            direction={"column"}
            options={radioButtonsFreshLimit}
            labelKey="label"
            valueKey="id"
            radioColor={current.primary}
          />
        </View>
      </View>
    </View>
  );
};
export default UserForm;

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 2,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  radioButton: {
    marginBottom: 16,
  },
});
