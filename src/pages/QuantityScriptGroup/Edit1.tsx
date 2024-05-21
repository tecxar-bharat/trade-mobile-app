import React from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { toNumber } from "@utils/constant";
import blockScriptsService from "@services/blockScripts.service";
import Form from "./Form";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import EHeader from "@commonComponents/EHeader";
import { ActionButton } from "@commonComponents/ActionButtons";
import { SCREENS } from "@navigation/NavigationKeys";
import IconDelete from "@assets/svgs/IconDelete";
import IconEdit from "@assets/svgs/IconEdit";
import FormInput from "@fields/FormInput";
import { useForm } from "react-hook-form";
const EditQuantityScriptGroup = (props: any) => {
  const route = useRoute();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({});
  const { viewData } = route?.params;
  const current = useAppSelector((state) => themeSelector(state, "current"));

  const { control, setValue } = useForm({
    defaultValues: {},
    mode: "onChange",
  });

  const getAccountByIdFun = async () => {
    await blockScriptsService
      .getBlockScriptsGroupById(toNumber(viewData?.id))
      .then((res) => {
        setData(res.data.data);
      });
    setLoading(false);
  };

  useEffect(() => {
    getAccountByIdFun();
  }, []);

  return (
    <>
      <EHeader title="Max Qty Limit" />
      {loading ? (
        <ELoader loading={true} mode="fullscreen" size="medium" />
      ) : (
        <>
          <View
            style={{
              paddingHorizontal: 16,
              backgroundColor: current.backgroundColor,
            }}
          >
            <FormInput
              control={control}
              name="name"
              placeholder="Enter Name"
              label={"Group Name"}
            />
          </View>

          <FlatList
            data={data?.qtyScripts}
            keyExtractor={(item, index) => `${item?.id}_${index}`}
            renderItem={({ item }: any) => {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: current.backgroundColor,
                    padding: 10,
                    borderBottomWidth: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderColor:
                      current.value === "dark"
                        ? current.backgroundColor
                        : current.bcolor,
                  }}
                >
                  <View>
                    <EText type="m16" color={current?.textColor}>
                      {item?.script?.name}
                    </EText>
                    <EText type="m16" color={current?.greyText}>
                      {item?.segment?.name}
                    </EText>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate(SCREENS.Form, {
                          id: item?.scriptId,
                        })
                      }
                    >
                      <IconEdit color={current.blue} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => console.log("--Delete", item?.scriptId)}
                    >
                      <IconDelete color={current.red} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          {/* <Form viewData={data} type="edit" navigation={props.navigation} /> */}
        </>
      )}
    </>
  );
};

export default EditQuantityScriptGroup;
