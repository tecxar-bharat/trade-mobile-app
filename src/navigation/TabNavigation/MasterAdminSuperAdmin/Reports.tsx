import EHeader from "@commonComponents/EHeader";
import MenuButton from "@commonComponents/MenuButton";
import TabView, { ITabs } from "@commonComponents/TabView";
import { INavigation } from "@interfaces/common";
import CashLedgerPage from "@pages/Finance/CashLedgerPage";
import LedgerPage from "@pages/Finance/LedgerPage";
import ShortTradeReport from "@pages/Settings/ShortTradeReportPage";
import BrokerageReportBroker from "@pages/Trades/BrokerageReportBroker";
import UplineBill from "@pages/UplineBill";
import { useRoute } from "@react-navigation/native";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

const MasterReports = ({ navigation }: INavigation) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const [tabs, setTabs] = useState<ITabs[]>([]);
  const route = useRoute();
  const selectedTabIndex = route?.params?.selectedTabIndex;
  const role = userData?.role?.slug;

  const LedgerRoute = () => {
    return <LedgerPage navigation={navigation} />;
  };

  useEffect(() => {
    if (role === "master") {
      setTabs([
        { key: "ledger", label: "Ledger", renderView: LedgerRoute },
        {
          key: "brokerDetail",
          label: "Broker Report",
          renderView: BrokerageReportBroker,
        },
        { key: "uplineReport", label: "Upline Report", renderView: UplineBill },
      ]);
    } else if (role === "admin") {
      setTabs([
        { key: "ledger", label: "Ledger", renderView: LedgerRoute },
        {
          key: "cashLedger",
          label: "Cash Ledger",
          renderView: () => <CashLedgerPage navigation={navigation} />,
        },
        {
          key: "brokerDetail",
          label: "Broker Report",
          renderView: BrokerageReportBroker,
        },
      ]);
    } else {
      setTabs([
        { key: "ledger", label: "Ledger", renderView: LedgerRoute },
        {
          key: "cashLedger",
          label: "Cash Ledger",
          renderView: () => <CashLedgerPage navigation={navigation} />,
        },
        {
          key: "brokerDetail",
          label: "Broker Report",
          renderView: BrokerageReportBroker,
        },
        {
          key: "shortTradeReport",
          label: "Short Trade",
          renderView: ShortTradeReport,
        },
      ]);
    }
  }, [role]);

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      <EHeader
        title="Reports"
        isLeftIcon={<MenuButton navigation={navigation} />}
        showProfileButton={true}
        isHideBack={true}
      />

      {tabs.length > 0 ? (
        <TabView
          tabs={tabs}
          currentIndex={selectedTabIndex}
          lazy={true}
          scrollEnabled={role !== "admin"}
        />
      ) : null}
    </View>
  );
};
export default MasterReports;
