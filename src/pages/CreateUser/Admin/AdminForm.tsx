import EText from "@commonComponents/EText";
import FormSwitchButton from "@fields/FormSwitchButton";
import FormInput from "@fields/FormInput";
import { IAdminNameList } from "@interfaces/index";
import commonService from "@services/common.service";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { styles } from "../../../themes";
import { MobileValidation } from "@utils/validators";
const AdminForm = (props: any) => {
  const { control, watch, setValue } = props;
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [allAdminNameList, setAllAdminList] = useState<IAdminNameList[]>([]);
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const [disableManualTrade, setDisableManualTrade] = useState<boolean>(false);
  const [disableEditTrade, setDisableEditTrade] = useState<boolean>(false);
  const [disableDeleteTrade, setDisableDeleteTrade] = useState<boolean>(false);
  useEffect(() => {
    commonService.getAdminNameList().then((e) => {
      setAllAdminList(e.data.data as IAdminNameList[]);
    });
  }, []);
  const parentId: any = watch("parentId");
  useEffect(() => {
    const parent =
      allAdminNameList &&
      allAdminNameList.find((e: IAdminNameList) => e.id === parentId);
    if (parent) {
      //manual Trade condition
      if (!parent?.manual_trade) {
        setDisableManualTrade(true);
        setValue("manualTrade", false);
      } else {
        setDisableManualTrade(false);
      }
      //edit Trade condition
      if (!parent?.edit_trade) {
        setDisableEditTrade(true);
        setValue("editTrade", false);
      } else {
        setDisableEditTrade(false);
      }
      //delete Trade condition
      if (!parent?.delete_trade) {
        setDisableDeleteTrade(true);
        setValue("deleteTrade", false);
      } else {
        setDisableDeleteTrade(false);
      }
      setValue("maxUsers", parent.max_users);
    } else if (
      userData &&
      userData?.role.slug === "admin" &&
      !userData?.manualTrade
    ) {
      setDisableManualTrade(true);
      setValue("manualTrade", false);
    } else if (
      userData &&
      userData?.role.slug === "admin" &&
      !userData?.editTrade
    ) {
      setDisableEditTrade(true);
      setValue("editTrade", false);
    } else if (
      userData &&
      userData?.role.slug === "admin" &&
      !userData?.deleteTrade
    ) {
      setDisableDeleteTrade(true);
      setValue("deleteTrade", false);
    } else if (userData && userData?.maxUsers !== null) {
      setValue("maxUsers", userData && userData?.maxUsers);
    }
    // eslint-disable-next-line
  }, [parentId, allAdminNameList]);
  return (
    <View
      style={{
        paddingHorizontal: 16,
        borderTopWidth: 2,
        borderColor: current.bcolor,
        paddingBottom: 16,
      }}
    >
      <FormInput
        control={control}
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
      <FormInput
        control={control}
        required={"No of masters is required"}
        type="number"
        name="maxMasters"
        label={"No Of Masters"}
        keyboardType={"numeric"}
        placeholder={"No Of Masters"}
      />
      <FormInput
        control={control}
        type="number"
        required={"Max users per master is required"}
        name="maxUsers"
        label={"Max Users Per Master"}
        keyboardType={"numeric"}
        placeholder={"Max Users Per Master"}
      />
      {(userData?.role.slug === "superadmin" ||
        userData?.role.slug === "admin") && (
        <>
          <EText type="b14" style={{ marginRight: 10 }}>
            {"Permission"}
          </EText>
          <View>
            <FormSwitchButton
              control={control}
              type="checkbox"
              name="editTrade"
              label="Edit Trade"
              disable={disableEditTrade}
            />
            <FormSwitchButton
              control={control}
              type="checkbox"
              name="deleteTrade"
              label="Delete Trade"
              disable={disableDeleteTrade}
            />
            <FormSwitchButton
              control={control}
              type="checkbox"
              name="manualTrade"
              label="Manual Trade"
              disable={disableManualTrade}
            />
          </View>
        </>
      )}
    </View>
  );
};
export default AdminForm;
