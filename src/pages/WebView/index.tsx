import EHeader from "@commonComponents/EHeader";
import { LoggedUser } from "@db/schemas/loggedUser.model";
import { useRoute } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { WebView as WebViewComponent } from "react-native-webview";

const WebView = () => {
  const route = useRoute();
  const { uri } = route?.params;
  const userData = LoggedUser.getActiveUser(globalThis.realm);
  return (
    <View style={{ flex: 1 }}>
      <EHeader title={"PDF View"} />
      <WebViewComponent
        source={{
          uri: uri,
          headers: { Cookies: userData?.Cookie },
        }}
        style={{ flex: 1 }}
        sharedCookiesEnabled={true}
      />
    </View>
  );
};

export default WebView;
