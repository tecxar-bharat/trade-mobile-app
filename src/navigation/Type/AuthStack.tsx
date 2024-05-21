import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { SCREENS } from "../NavigationKeys";
import { ScreenRoute } from "../NavigationRoutes";

export default function AuthStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={SCREENS.Login}
    >
      <Stack.Screen name={SCREENS.Login} component={ScreenRoute.Login} />
    </Stack.Navigator>
  );
}
