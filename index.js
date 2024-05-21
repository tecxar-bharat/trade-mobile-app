/**
 * @format
 */

import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";
import RNRoot from "./src";

if (typeof global.crypto !== "object") {
  global.crypto = {
    getRandomValues: (array) =>
      array.map(() => Math.floor(Math.random() * 256)),
  };
}

messaging().requestPermission();
notifee.requestPermission();
AppRegistry.registerComponent(appName, () => RNRoot);
