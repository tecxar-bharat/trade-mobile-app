import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { SCREENS } from "../../NavigationKeys";
import { ScreenRoute } from "../../NavigationRoutes";
import MyTabBar from "../TabBar";

const Tab = createBottomTabNavigator();
const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={SCREENS.WatchList}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen name={SCREENS.WatchList} component={ScreenRoute.WatchList} />
      <Tab.Screen name={SCREENS.Trades} component={ScreenRoute.UserTradeTab} />
      <Tab.Screen name={SCREENS.Position} component={ScreenRoute.Position} />
      <Tab.Screen name={SCREENS.Funds} component={ScreenRoute.Funds} />
      <Tab.Screen name={SCREENS.Reports} component={ScreenRoute.Reports} />
    </Tab.Navigator>
  );
};

export default BottomTab;
