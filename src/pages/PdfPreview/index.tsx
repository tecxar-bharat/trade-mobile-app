import { moderateScale } from "@common/constants";
import EButton from "@commonComponents/EButton";
import EHeader from "@commonComponents/EHeader";
import { LoggedUser } from "@db/schemas/loggedUser.model";
import { useRoute } from "@react-navigation/native";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  View
} from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";
import Pdf from "react-native-pdf";
import Share from "react-native-share";
import Toast from "react-native-toast-message";

const PdfView = (props: any) => {
  const route = useRoute();
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const { base64Str, url, description, fileName } = route?.params;
  const source = { uri: `data:application/pdf;base64,${base64Str}` };

  const pdfShareIos = async () => {
    try {
      await Share.open({
        url: `data:application/pdf;base64,${base64Str}`,
        filename: fileName,
      });
    } catch (error) {
      console.log("---", error);
    }
  };
  // const pdfShareAndroid = async () => {
  //   const currentUser = LoggedUser.getActiveUser(globalThis.realm);
  //   ReactNativeBlobUtil.config({
  //     addAndroidDownloads: {
  //       title: "Ledger Report",
  //       description: `${description}.pdf`,
  //       useDownloadManager: true,
  //       mime: "application/pdf",
  //       mediaScannable: true,
  //       notification: true,
  //       storeInDownloads: true,
  //     },
  //   })
  //     .fetch("GET", url, { Cookie: currentUser?.Cookie! })
  //     .then(() => {
  //       Toast.show({
  //         type: "success",
  //         text1: "Download Success!",
  //       });
  //     })
  //     .catch(() => {
  //       Toast.show({
  //         type: "error",
  //         text1: "Download Failed!",
  //       });
  //     });
  // };

  return (
    <View style={{ flex: 1 }}>
      <EHeader
        title={"PDF View"}
        rightIcon={
          <EButton
            style={{ padding: 5 }}
            height={moderateScale(30)}
            onPress={() => {
              pdfShareIos()
            }}
            title="Download"
          />
        }
      />
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={{ ...styles.pdf, backgroundColor: current.backgroundColor }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    verticalAlign: "top",
    alignSelf: "flex-start",
    display: "flex",
    flexDirection: "column",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  colorWhite: {},
});

export default PdfView;
