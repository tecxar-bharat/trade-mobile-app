import EHeader from "@commonComponents/EHeader";
import MenuButton from "@commonComponents/MenuButton";
import TabView from "@commonComponents/TabView";
import { INavigation } from "@interfaces/common";
import MaxQtyLimitUser from "@pages/MaxQtyLimitUser";
import BlockScriptListPage from "@pages/Settings/BlockScriptListPage";
import Trades from "@pages/Trades";
import { useRoute } from "@react-navigation/native";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppSelector } from "@store/index";
import React from "react";
import { View } from "react-native";

const UserTradeTab = ({ navigation }: INavigation) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const route = useRoute();
  const selectedTabIndex = route?.params?.selectedTabIndex;

  const MaxQtyLimitRoutes = () => {
    return <MaxQtyLimitUser navigation={navigation} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      <EHeader
        title="Trades"
        isLeftIcon={<MenuButton navigation={navigation} />}
        isHideBack={true}
        showProfileButton={true}
      />
      <TabView
        tabs={[
          { key: "trades", label: "Trades", renderView: Trades },
          {
            key: "maxQtyLimit",
            label: "Max Qty Limits",
            renderView: MaxQtyLimitRoutes,
          },
          {
            key: "blockedScripts",
            label: "Block Scripts",
            renderView: BlockScriptListPage,
          },
        ]}
        currentIndex={selectedTabIndex}
        scrollEnabled={true}
      />
    </View>
  );
};

export default UserTradeTab;
