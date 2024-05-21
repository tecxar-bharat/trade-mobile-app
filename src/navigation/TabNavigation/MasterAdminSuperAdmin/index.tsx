import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCREENS } from "../../NavigationKeys";
import { ScreenRoute } from "../../NavigationRoutes";
import MyTabBar from "../TabBar";
import MasterPortfolio from "./Portfolio";
import BrokerReports from "./Reports";
import MasterTrades from "./Trades";

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={SCREENS.WatchList}
        tabBar={(props) => <MyTabBar {...props} />}
      >
        <Tab.Screen
          name={SCREENS.WatchList}
          component={ScreenRoute.WatchList}
        />
        <Tab.Screen name={SCREENS.Position} component={MasterPortfolio} />
        <Tab.Screen
          name={SCREENS.Dashboard}
          component={ScreenRoute.Dashboard}
        />
        <Tab.Screen name={SCREENS.Trades} component={MasterTrades} />
        <Tab.Screen name={SCREENS.Reports} component={BrokerReports} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};
export default BottomTab;
