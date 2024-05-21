import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { SCREENS } from "../../NavigationKeys";
import { ScreenRoute } from "../../NavigationRoutes";
import MyTabBar from "../TabBar";
import BrokerPortfolio from "./Portfolio";
import BrokerTrade from "./Trades";
import BrokerUserList from "./Users";
import BrokerReports from "./Reports";

const Tab = createBottomTabNavigator();
const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={SCREENS.WatchList}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen name={SCREENS.WatchList} component={ScreenRoute.WatchList} />
      <Tab.Screen name={SCREENS.Trades} component={BrokerTrade} />
      <Tab.Screen name={SCREENS.Position} component={BrokerPortfolio} />
      <Tab.Screen name={SCREENS.Users} component={BrokerUserList} />
      <Tab.Screen name={SCREENS.Reports} component={BrokerReports} />
    </Tab.Navigator>
  );
};

export default BottomTab;
