import ELoader from "@commonComponents/ELoader";
import ESafeAreaView from "@components/common/ESafeAreaView";
import EText from "@components/common/EText";
import { realmContext } from "@db/index";
import AppNavigator from "@navigation/index";
import store, { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import LottieView from "lottie-react-native";
import React, { Fragment } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from "react-native";
import KeyboardManager from "react-native-keyboard-manager";
import Toast, { ToastProps } from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";

// import { Notification } from './db/schemas/notification.model';

const RNRoot = () => {
  const { RealmProvider } = realmContext;
  const queryClient = new QueryClient();

  if (Platform.OS === "ios") {
    KeyboardManager.setEnable(true);
    KeyboardManager.setEnableDebugging(false);
    KeyboardManager.setKeyboardDistanceFromTextField(10);
    KeyboardManager.setLayoutIfNeededOnUpdate(true);
    KeyboardManager.setEnableAutoToolbar(true);
    KeyboardManager.setToolbarDoneBarButtonItemText("Done");
    KeyboardManager.setToolbarManageBehavior("subviews"); // "subviews" | "tag" | "position"
    KeyboardManager.setToolbarPreviousNextButtonEnable(true);
    KeyboardManager.setToolbarTintColor("#000000"); // Only #000000 format is supported
    KeyboardManager.setToolbarBarTintColor("#FFFFFF"); // Only #000000 format is supported
    KeyboardManager.setToolbarShowPlaceholder(true);
    KeyboardManager.setKeyboardOverrideAppearance(false);
    KeyboardManager.setKeyboardAppearance("default"); // "default" | "light" | "dark"
    KeyboardManager.setResignOnTouchOutside(true);
    KeyboardManager.setShouldPlayInputClicks(true);
    KeyboardManager.resignFirstResponder();
  }

  return (
    <Provider store={store}>
      <RealmProvider
        fallback={() => (
          <ELoader loading={true} mode="fullscreen" size="large" />
        )}
      >
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </RealmProvider>
    </Provider>
  );
};

const MyStatusBar = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  return (
    <View
      style={{
        height: StatusBar.currentHeight,
        backgroundColor: current.backgroundColor1,
      }}
    >
      <SafeAreaView>
        <StatusBar
          barStyle={current.value === "dark" ? "light-content" : "dark-content"}
          translucent
          backgroundColor={current.backgroundColor1}
        />
      </SafeAreaView>
    </View>
  );
};

const App = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const toastConfig = {
    success: (props: ToastProps) => {
      return (
        <SafeAreaView
          style={{ flex: 1, display: "flex", flexDirection: "row" }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: current.green,
              marginHorizontal: 10,
              display: "flex",
              flexDirection: "row",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <LottieView
                source={require("./assets/animatedIcon/checkMark.json")}
                autoPlay
                loop
                style={{ width: 30, height: 30 }}
              />
            </View>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <EText type="b16" color="#fff">
                {props.text1}
              </EText>
              <EText color="#fff">{props.text2}</EText>
            </View>
          </View>
        </SafeAreaView>
      );
    },

    error: (props: ToastProps) => (
      <SafeAreaView style={{ flex: 1, display: "flex", flexDirection: "row" }}>
        <View
          style={{
            flex: 1,
            backgroundColor: current.redColor,
            marginHorizontal: 10,
            display: "flex",
            flexDirection: "row",
            borderRadius: 6,
            padding: 16,
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <LottieView
              source={require("./assets/animatedIcon/close.json")}
              autoPlay
              loop
              style={{ width: 30, height: 30 }}
            />
          </View>
          <View style={{ flex: 1, marginHorizontal: 10 }}>
            <EText type="b16" color="#fff">
              {props.text1}
            </EText>
            <EText color="#fff">{props.text2}</EText>
          </View>
        </View>
      </SafeAreaView>
    ),

    tradeToast: (mainProps: any) => {
      const { props } = mainProps;
      if (props.success) {
        return (
          <SafeAreaView
            style={{ flex: 1, display: "flex", flexDirection: "row" }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: current.greenColor,
                marginHorizontal: 10,
                display: "flex",
                flexDirection: "row",
                borderRadius: 6,
                padding: 16,
              }}
            >
              <View style={{ justifyContent: "center" }}>
                <LottieView
                  source={require("./assets/animatedIcon/checkMark.json")}
                  autoPlay
                  loop
                  style={{ width: 30, height: 30 }}
                />
              </View>
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <EText type="b16" color="#fff">
                  Trade Executed
                </EText>
                <EText color="#fff">Successfully for {props.script} of</EText>
                <EText type="b14" color="#fff">
                  {props.qty}
                  <EText type="r14" color="#fff">
                    ({props.lot}) at {props.price}
                  </EText>
                </EText>
              </View>
            </View>
          </SafeAreaView>
        );
      } else {
        return (
          <SafeAreaView
            style={{ flex: 1, display: "flex", flexDirection: "row" }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: current.red,
                marginHorizontal: 10,
                display: "flex",
                flexDirection: "row",
                borderRadius: 6,
                padding: 16,
              }}
            >
              <View style={{ justifyContent: "center" }}>
                <LottieView
                  source={require("./assets/animatedIcon/close.json")}
                  autoPlay
                  loop
                  style={{ width: 30, height: 30 }}
                />
              </View>
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <EText type="b16" color="#fff">
                  Trade Failed
                </EText>
                <EText color="#fff"> {props.errorMessage} </EText>
              </View>
            </View>
          </SafeAreaView>
        );
      }
    },
  };
  return (
    <Fragment>
      <SafeAreaView
        style={{ flex: 0, backgroundColor: current.backgroundColor1 }}
      />
      <ESafeAreaView
        style={{
          backgroundColor: current.backgroundColor,
          height: StatusBar.currentHeight,
        }}
      >
        <MyStatusBar />
        <AppNavigator />
        <Toast position="top" bottomOffset={20} config={toastConfig} />
      </ESafeAreaView>
    </Fragment>
  );
};

export default RNRoot;
