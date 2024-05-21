import EHeader from "@commonComponents/EHeader";
import MenuButton from "@commonComponents/MenuButton";
import TabView from "@commonComponents/TabView";
import { INavigation } from "@interfaces/common";
import Ledger from "@pages/Reports/Ledger";
import BrokerageReportBroker from "@pages/Trades/BrokerageReportBroker";
import { useRoute } from "@react-navigation/native";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppSelector } from "@store/index";
import React from "react";
import { View } from "react-native";

const BrokerReports = ({ navigation }: INavigation) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));

  const route = useRoute();
  const selectedTabIndex = route?.params?.selectedTabIndex;

  const LedgerRoute = () => {
    return <Ledger navigation={navigation} />;
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
        tabs={[{ key: 'ledger', label: 'Ledger', renderView: LedgerRoute }, { key: 'brokerageReport', label: 'Brokerage Report', renderView: BrokerageReportBroker }]}
        currentIndex={selectedTabIndex} lazy={true}
      />
    </View>
  );
};
export default BrokerReports;
