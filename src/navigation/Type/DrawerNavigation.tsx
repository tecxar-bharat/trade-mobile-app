import { LoggedUser } from "@db/schemas/loggedUser.model";
import { SCREENS } from "@navigation/NavigationKeys";
import CustomDrawerContent from "@navigation/Type/CustomDrawerContent";
import CustomDrawerContentRight from "@navigation/Type/CustomDrawerContentRight";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as React from "react";
import BrokerTabNavigation from "../TabNavigation/Broker";
import MasterTabNavigation from "../TabNavigation/MasterAdminSuperAdmin";
import UserTabNavigation from "../TabNavigation/User";

const RightDrawer = createDrawerNavigator();

const RightDrawerScreen = () => {
  const userData = LoggedUser.getActiveUser(globalThis.realm);
  const currentRole = userData?.role.slug;
  return (
    <RightDrawer.Navigator
      id="RightDrawer"
      screenOptions={{
        drawerPosition: "right",
        headerShown: false,
        swipeEnabled: false,
      }}
      drawerContent={(props: any) => <CustomDrawerContentRight {...props} />}
    >
      {currentRole === "user" ? (
        <RightDrawer.Screen
          name={SCREENS.BottomTab}
          component={UserTabNavigation}
          options={{
            drawerLabel: "Home",
          }}
        />
      ) : currentRole === "broker" ? (
        <RightDrawer.Screen
          name={SCREENS.BottomTab}
          component={BrokerTabNavigation}
          options={{
            drawerLabel: "Home",
          }}
        />
      ) : currentRole === "master" ||
        currentRole === "admin" ||
        currentRole === "superadmin" ? (
        <RightDrawer.Screen
          name={SCREENS.BottomTab}
          component={MasterTabNavigation}
          options={{
            drawerLabel: "Home",
          }}
        />
      ) : null}
    </RightDrawer.Navigator>
  );
};

const LeftDrawer = createDrawerNavigator();

const LeftDrawerScreen = () => {
  return (
    <LeftDrawer.Navigator
      id="LeftDrawer"
      initialRouteName={"HomeDrawer"}
      useLegacyImplementation={false}
      screenOptions={() => {
        return {
          drawerPosition: "left",
          headerShown: false,
        };
      }}
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
    >
      <LeftDrawer.Screen name="HomeDrawer" component={RightDrawerScreen} />
    </LeftDrawer.Navigator>
  );
};

export default LeftDrawerScreen;
