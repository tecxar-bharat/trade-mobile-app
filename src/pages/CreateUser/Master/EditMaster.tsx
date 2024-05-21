import accountService from "@services/account.service";
import { toNumber } from "@utils/constant";
import { Fragment, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AddAccount from "../AddAccount";
import { useRoute } from "@react-navigation/native";
import ELoader from "@commonComponents/ELoader";
import React = require("react");

const EditMaster = (porps: any) => {
  const route = useRoute();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({});

  const getAccountByIdFun = async () => {
    await accountService
      .getAccountById(toNumber(route.params?.id))
      .then((res: any) => {
        res.data.data.quantityGroups = res?.data?.data?.groups.map((e: any) => {
          return e.groupId;
        });
        res.data.data.nseOpt = res?.data?.data?.nseOptMinLotWiseBrokerage
          ? true
          : false;
        res.data.data.nseFut = res?.data?.data?.minBrokerage ? true : false;
        res.data.data.nseMcx = res?.data?.data?.minMcxBrokeragePercentage
          ? true
          : false;
        setData(res.data.data);
      });
    setLoading(false);
  };
  useEffect(() => {
    getAccountByIdFun();
  }, []);
  return (
    <Fragment>
      {loading ? (
        <ELoader loading={true} mode="fullscreen" size="medium" />
      ) : (
        <AddAccount
          title={"Edit Master"}
          type="edit"
          role={"master"}
          userData={data}
          navigation={porps.navigation}
        />
      )}
    </Fragment>
  );
};

export default EditMaster;
