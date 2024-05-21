import EText from "@commonComponents/EText";
import FormSwitchButton from "@fields/FormSwitchButton";
import FormInput from "@fields/FormInput";
import FormMultiCheckbox from "@fields/FormMultiCheckbox";
import FormSelect from "@fields/FormSelect";
import { IAdminNameList } from "@interfaces/index";
import commonService from "@services/common.service";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { MaxMultiplicationValidation } from "@utils/constant";
import { MobileValidation, PercentageValidation } from "@utils/validators";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { styles } from "../../../themes";
export interface IAccountTypes {
  id: number;
  name: string;
}
const MasterForm = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [allAdminNameList, setAllAdminList] = useState<IAdminNameList[]>([]);
  const { control, watch, setValue, clearErrors } = props;
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const [allAccountTypeOptions, setAllAccountTypeOptions] = useState<
    IAccountTypes[]
  >([]);
  const parentId: any = watch("parentId");

  useEffect(() => {
    commonService.getAdminNameList().then((e) => {
      setAllAdminList(e.data.data as IAdminNameList[]);
    });
    commonService.getMasterAccountTypes().then((e: any) => {
      setAllAccountTypeOptions(e.data.data as IAccountTypes[]);
      if (props.type !== "edit") {
        const ids = e.data.data.map((ee: any) => {
          return ee.id;
        });
        setValue("quantityGroups", ids);
      }
    });
  }, []);
  const nseOptValue: string = watch("nseOpt");
  const nseFutValue: string = watch("nseFut");
  const nseMcxValue: string = watch("nseMcx");

  useEffect(() => {
    clearErrors("nseMcx");
  }, [nseOptValue, nseFutValue, nseMcxValue]);
  useEffect(() => {
    clearErrors("nseOptMinLotWiseBrokerage");
    clearErrors("nseOptIntradayMultiplication");
    clearErrors("nseOptDeliveryMultiplication");
  }, [nseOptValue]);
  useEffect(() => {
    clearErrors("minMcxBrokeragePercentage");
    clearErrors("minMcxBrokerage");
  }, [nseMcxValue]);

  useEffect(() => {
    clearErrors("minBrokerage");
  }, [nseFutValue]);
  useEffect(() => {
    const parent =
      allAdminNameList &&
      allAdminNameList.find((e: IAdminNameList) => e.id === parentId);
    if (parent) {
      setValue("maxUsers", parent.max_users);
    } else if (userData && userData?.maxUsers !== null) {
      setValue("maxUsers", userData && userData?.maxUsers);
    }
    // eslint-disable-next-line
  }, [parentId, allAdminNameList]);

  useEffect(() => {
    if (userData?.role?.slug === 'admin') {
      setValue('parentId', userData?.id);
    }
    // eslint-disable-next-line
  }, []);


  return (
    <View
      style={{
        paddingHorizontal: 16,
        borderColor: current.bcolor,
        borderTopWidth: 2,
        paddingBottom: 16
      }}
    >
      <EText type="b16" style={{ marginVertical: 15 }}>
        Basic Details
      </EText>
      <FormSelect
        control={control}
        labelKey="name"
        valueKey="id"
        required={"Admin id required"}
        type="select"
        name="parentId"
        label={"Admin"}
        options={allAdminNameList}
        disabled={userData?.role?.slug === 'admin' ? true : false}
      />
      <FormInput
        control={control}
        required={"Name is required"}
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

      <FormInput
        control={control}
        required={"value is required"}
        name="deliveryMultiplication"
        validate={MaxMultiplicationValidation}
        label={"MAX DELIVERY MULTIPLICATION "}
        keyboardType={"numeric"}
      />
      <FormInput
        control={control}
        required={"value is required"}
        name="intradayMultiplication"
        validate={MaxMultiplicationValidation}
        label={"MAX INTRADAY MULTIPLICATION"}
        keyboardType={"numeric"}
      />

      <FormInput
        control={control}
        name="maxUsers"
        required={"Max users is required"}
        label={"Max. Users"}
        keyboardType={"numeric"}
        placeholder={"Enter Max Users"}
      />
      <FormInput
        control={control}
        name="partnershipPercentage"
        required={"Partnership percentage is required"}
        validate={PercentageValidation}
        label={"Partnership Percentage"}
        keyboardType={"numeric"}
        placeholder={"Enter Partnership Percentage"}
      />
      <EText type="b16" style={{ marginVertical: 10 }}>
        ADDITIONAL DETAILS
      </EText>
      <View>
        <FormMultiCheckbox
          control={control}
          label={"Account Types"}
          name="quantityGroups"
          options={allAccountTypeOptions}
          labelKey="name"
          valueKey="id"
        />
        <EText type="m16" style={{ marginBottom: 10 }}>
          Market Type
        </EText>
        <FormSwitchButton name="nseOpt" control={control} label={"NSEOPT"} />
        {nseOptValue && (
          <View>
            <FormInput
              control={control}
              name="nseOptMinLotWiseBrokerage"
              label={"MIN LOT WISE BROKERAGE"}
              keyboardType={"numeric"}
              placeholder={"Enter Min Lot Wise Brokerage"}
            />
            <FormInput
              control={control}
              name="nseOptIntradayMultiplication"
              validate={MaxMultiplicationValidation}
              label={"MAX INTRADAY MULTIPLICATION"}
              keyboardType={"numeric"}
            />
            <FormInput
              control={control}
              name="nseOptDeliveryMultiplication"
              validate={MaxMultiplicationValidation}
              label={"MAX DELIVERY MULTIPLICATION"}
              keyboardType={"numeric"}
            />
          </View>
        )}
        <FormSwitchButton name="nseFut" control={control} label={"NSEFUT"} />
        {nseFutValue && (
          <View>
            <FormInput
              control={control}
              name="minBrokerage"
              required={"Min % Wise Brokerage is required"}
              label={"MIN % WISE BROKERAGE"}
              keyboardType={"numeric"}
              placeholder={"Enter Min % Wise Brokerage"}
            />
          </View>
        )}
        <FormSwitchButton name="nseMcx" control={control} label={"MCXFUT"} />
        {nseMcxValue && (
          <View>
            <FormInput
              control={control}
              name="minMcxBrokeragePercentage"
              required={"Min lot Wise Brokerage is required"}
              label={"MIN LOT WISE BROKERAGE"}
              keyboardType={"numeric"}
            />
            <FormInput
              control={control}
              name="minMcxBrokerage"
              required={"Min % Wise Brokerage is required"}
              label={"MIN % WISE BROKERAGE"}
              keyboardType={"numeric"}
            />
          </View>
        )}
      </View>
    </View>
  );
};
export default MasterForm;
