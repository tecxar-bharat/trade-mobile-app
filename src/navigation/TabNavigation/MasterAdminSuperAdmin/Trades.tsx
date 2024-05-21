import EHeader from "@commonComponents/EHeader";
import MenuButton from "@commonComponents/MenuButton";
import TabView from "@commonComponents/TabView";
import { LoggedUser } from "@db/schemas/loggedUser.model";
import { INavigation } from "@interfaces/common";
import MaxQtyLimitUser from "@pages/MaxQtyLimitUser";
import MaxQtyLimit from "@pages/QuantityScriptGroup/MaxQtyLimit";
import Trades from "@pages/Trades";
import BlockScript from "@pages/BlockedScript";
import SummaryReport from "@pages/SummaryReport";
import { useRoute } from "@react-navigation/native";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppSelector } from "@store/index";
import React from "react";
import { View } from "react-native";

const MasterTrades = ({ navigation }: INavigation) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const userData = LoggedUser.getActiveUser(globalThis.realm);
  const role = userData?.role?.slug;

  const route = useRoute();
  const selectedTabIndex = route?.params?.selectedTabIndex;

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      <EHeader
        title="Trades"
        isLeftIcon={<MenuButton navigation={navigation} />}
        showProfileButton={true}
        isHideBack={true}
      />
      <TabView
        tabs={[
          { key: "trades", label: "Trades", renderView: Trades },
          {
            key: "summaryReport",
            label: "Summary",
            renderView: () => <SummaryReport navigation={navigation} />,
          },
          {
            key: "maxQtyLimit",
            label: "Max Qty LImits",
            renderView:
              role === "superadmin"
                ? () => <MaxQtyLimit navigation={navigation} />
                : () => <MaxQtyLimitUser navigation={navigation} />,
          },
          {
            key: "blockScripts",
            label: "Block Scripts",
            renderView: BlockScript,
          },
        ]}
        currentIndex={selectedTabIndex}
        lazy={true}
        scrollEnabled={true}
      />
    </View>
  );
};
export default MasterTrades;
