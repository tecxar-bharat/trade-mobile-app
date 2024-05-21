import { moderateScale } from "@common/constants";
import EHeader from "@commonComponents/EHeader";
import EText from "@commonComponents/EText";
import MenuButton from "@commonComponents/MenuButton";
import { INavigation } from "@interfaces/common";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppSelector } from "@store/index";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Ledger from "./Ledger";
import RejectedLogs from "./RejectedLogs";
import { useRoute } from "@react-navigation/native";
import TabView from "@commonComponents/TabView";

const Reports = ({ navigation }: INavigation) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const route = useRoute();
  const selectedTabIndex = route?.params?.selectedTabIndex;
  const LedgerRoute = () => {
    return <Ledger navigation={navigation} />;
  };

  const RejectedLogsRoute = () => {
    return <RejectedLogs />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      <EHeader
        title="Reports"
        isLeftIcon={<MenuButton navigation={navigation} />}
        showProfileButton={true}
        isHideBack={true}
      />
      <TabView
        tabs={[
          {
            key: "rejectedLogs",
            label: "Rejected Logs",
            renderView: RejectedLogsRoute,
          },
          {
            key: "ledger",
            label: "Ledger",
            renderView: LedgerRoute,
          },
        ]}
        currentIndex={selectedTabIndex}
      />
    </View>
  );
};

export default Reports;
