import accountService from "@services/account.service";
import { toNumber } from "@utils/constant";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AddAccount from "../AddAccount";
import { useRoute } from "@react-navigation/native";
import ELoader from "@commonComponents/ELoader";
import React = require("react");

const EditAdmin = (props: any) => {
  const route = useRoute();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({});

  const getAccountByIdFun = async () => {
    await accountService
      .getAccountById(toNumber(route.params?.id))
      .then((res: any) => {
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
        <AddAccount
          title={"Edit Admin"}
          type="edit"
          role={"admin"}
          userData={data}
          navigation={props.navigation}
        />
      )}
    </React.Fragment>
  );
};

export default EditAdmin;
