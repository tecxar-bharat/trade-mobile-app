import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import SplashScreen from "react-native-splash-screen";

// Local Imports
import ELoader from "@commonComponents/ELoader";
import ESafeAreaView from "@commonComponents/ESafeAreaView";
import { SCREENS } from "@navigation/NavigationKeys";
import { useRoute } from "@react-navigation/native";
import { setDefaultEmailPassword, whoAmI } from "@reducers/auth.reducer";
import { resetInstrument } from "@reducers/instrumentReducer";
import { resetLedger } from "@reducers/ledgerReducer";
import {
  clearMarketData
} from "@reducers/marketReducer";
import { socketActions } from "@reducers/socketReducer";
import { changeThemeAction } from "@reducers/theme.reducer";
import { useAppDispatch } from "@store/index";

import { realmContext } from "@db/index";
import { resetUser } from "@reducers/userReducer";
import { resetPosition } from "@store/reducers/positionReducer";
import { colors, styles } from "@themes/index";
import { initialStorageValueGet } from "@utils/asyncstorage";

const Splash = ({ navigation }) => {
  const route = useRoute();
  const { useRealm } = realmContext;
  const realm = useRealm();
  const dispatch = useAppDispatch();
  const asyncProcess = async () => {
    console.log("-----1")
    if (route?.params && route?.params.from === "switchUser") {
      dispatch(socketActions.disconnect());
      dispatch(resetInstrument());
      dispatch(resetLedger());
      dispatch(resetUser());
      dispatch(clearMarketData());
      dispatch(resetPosition());
    }
    try {
      let asyncData = await initialStorageValueGet();

      let { themeColor, logInCred } = asyncData;

      if (asyncData) {
        if (themeColor) {
          if (themeColor === "light") {
            dispatch(changeThemeAction(colors.light));
          } else {
            dispatch(changeThemeAction(colors.dark));
          }
        }
        if (logInCred) {
          dispatch(setDefaultEmailPassword(logInCred));
        }

        console.log("-----21")
        dispatch(whoAmI())
          .then((res: any) => {
            console.log("-----22")
            if (res && res.payload && res.payload.data) {
              if (
                res.payload.data.changePasswordRequire &&
                (!res.payload.data.role.slug === "user" ||
                  res.payload.data.role.slug === "broker")
              ) {
                console.log("-----2")
                navigation.navigate({
                  index: 0,
                  routes: [{ name: SCREENS.ChangePassword }],
                });
              } else {
                console.log("-----3")
                navigation.reset({
                  index: 0,
                  routes: [{ name: SCREENS.Drawer }],
                });
              }
            } else {
              console.log("-----4")
              navigation.replace(SCREENS.Login);
              setTimeout(() => {
                realm.write(() => {
                  realm.deleteAll();
                });
              }, 1000);
            }
          })
          .catch(() => {
            console.log("-----5")
            navigation.replace(SCREENS.Login);
          });
      }
    } catch (e) {
      console.log("-----23")
      console.log("error ", e);
    }
  };

  useEffect(() => {
    SplashScreen.hide();
    asyncProcess();
  }, []);

  return (
    <ESafeAreaView style={localStyles.container}>
      <ELoader loading={true} size="large" mode={"fullscreen"} />
    </ESafeAreaView>
  );
};

export default Splash;

const localStyles = StyleSheet.create({
  container: {
    ...styles.itemsCenter,
    ...styles.flex,
    ...styles.justifyCenter,
  },
});
