import { ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { toNumber } from "@utils/constant";
import blockScriptsService from "@services/blockScripts.service";
import Form from "./Form";
import ELoader from "@commonComponents/ELoader";
import React = require("react");

const EditQuantityScriptGroup = (props: any) => {
  const route = useRoute();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({});
  const { viewData } = route?.params;

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
    <React.Fragment>
      {loading ? (
        <ELoader loading={true} mode="fullscreen" size="medium" />
      ) : (
        <Form viewData={data} type="edit" navigation={props.navigation} />
      )}
    </React.Fragment>
  );
};

export default EditQuantityScriptGroup;
