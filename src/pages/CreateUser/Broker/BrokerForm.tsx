import FormInput from "@fields/FormInput";
import FormSelect from "@fields/FormSelect";
import { IAdminNameList } from "@interfaces/index";
import commonService from "@services/common.service";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { MobileValidation } from "@utils/validators";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
const BrokerForm = (props: any) => {
  const { control, setValue } = props;
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [allMasterNameList, setAllMasterNameList] = useState<IAdminNameList[]>(
    []
  );

  const userData = useAppSelector((state) => authSelector(state, "userData"));

  useEffect(() => {
    commonService
      .getMasterNameList()
      .then(({ data }: any) => {
        setAllMasterNameList(data.data);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (userData?.role?.slug === 'master') {
      setValue('parentId', userData.id);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <View
      style={{
        borderTopWidth: 2,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
        borderColor: current.bcolor,
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
        disabled={userData?.role?.slug === 'master' ? true : false}
        options={allMasterNameList}
      />
      <FormInput
        control={control}
        required={"Please Enter Name"}
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
  );
};
export default BrokerForm;
