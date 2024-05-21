import accountService from "@services/account.service";
import { toNumber } from "@utils/constant";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AddAccount from "../AddAccount";
import { useRoute } from "@react-navigation/native";
import commonService from "@services/common.service";
import ELoader from "@commonComponents/ELoader";
import React = require("react");

interface IMCXFieldArray {
  id: number;
  symbol: string;
  name: string;
}

const EditUser = (porps: any) => {
  const route = useRoute();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    commonService
      .getuserMcxFormScripts()
      .then((res: any) => {
        if (res) {
          getAccountByIdFun(res.data.data);
        }
      })
      .catch(() => { });
  }, []);
  const getAccountByIdFun = async (mcxFieldData: IMCXFieldArray[]) => {
    await accountService
      .getAccountById(toNumber(route.params?.id))
      .then((res: any) => {
        res?.data?.data.segments.forEach((e: any) => {
          if (e.segment.slug === "nse_fut") {
            res.data.data.nseFut = true;
            res.data.data.maxPositionLimitFut = e.maxPositionLimit;
            res.data.data.brokerageFut = e.brokerage;
            res.data.data.intradayBrokerageFut = e.intradayBrokerage;
          }
        });
        res?.data?.data?.segments.forEach((e: any) => {
          if (e.segment.slug === "mcx") {
            res.data.data.nseMcx = true;
            res.data.data.brokerageMcx = e.brokerage;
            res.data.data.intradayBrokerageMcx = e.intradayBrokerage;
            res.data.data.maxPositionLimitMcx = e.maxPositionLimit;
            res.data.data.commissionType = e.commissionType;
            res.data.data.brokerageType = e.brokerageType;

            res.dataMcx_lots = mcxFieldData?.map((item: any) => {
              const newItem = {
                ...item,
              };
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const scriptIndex = e.scripts.findIndex(
                (i: any) => i.scriptId === item.id
              );
              if (scriptIndex > -1) {
                newItem.isChecked = true;
                newItem.brokerage = e.scripts[scriptIndex].brokerage;
                newItem.intradayBrokerage =
                  e.scripts[scriptIndex].intradayBrokerage;
              } else {
                newItem.isChecked = false;
              }
              return newItem;
            });
          }
        });
        res?.data?.data.segments.forEach((e: any) => {
          if (e.segment.slug === "nse_option") {
            res.data.data.nseOpt = true;
            res.data.data.intradayMultiplicationNseOpt =
              e.intradayMultiplication;
            res.data.data.deliveryMultiplicationNseOpt =
              e.deliveryMultiplication;
            res.data.data.maxPositionLimitOpt = e.maxPositionLimit;
            res.data.data.brokerageOpt = e.brokerage;
            res.data.data.intradayBrokerageOpt = e.intradayBrokerage;
          }
        });

        setData(res.data.data);
      });
    setLoading(false);
  };
  return (
    <React.Fragment>
      {loading ? (
        <ELoader loading={true} mode="fullscreen" size="medium" />
      ) : (
        <AddAccount
          title={"Edit User"}
          type="edit"
          role={"user"}
          userData={data}
          navigation={porps.navigation}
        />
      )}
    </React.Fragment>
  );
};

export default EditUser;
