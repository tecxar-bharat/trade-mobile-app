import React, { useEffect } from "react";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import StackNavigation from "./Type/StackNavigation";
import GlobalComponent from "./GlobalComponent";
import { realmContext } from "@db/index";

export default function AppNavigator() {
  const navigationRef = createNavigationContainerRef();

  const { useRealm } = realmContext;
  const realm = useRealm();
  useEffect(() => {
    globalThis.realm = realm;
  }, [realm]);

  return (
    <NavigationContainer ref={navigationRef}>
      <GlobalComponent navigation={navigationRef}>
        <StackNavigation />
      </GlobalComponent>
    </NavigationContainer>
  );
}
