import EHeader from "@commonComponents/EHeader";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppSelector } from "@store/index";
import React from "react";
import { Platform, View } from "react-native";
import Pdf from 'react-native-pdf';

const TradeBook = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor }}>
      <EHeader title="Rules"
      //  rightIcon={
      //     <EButton
      //       style={{ padding: 5 }}
      //       height={moderateScale(30)}
      //       onPress={() => {
      //         Platform.OS === "ios" ? pdfShareIos() : pdfShareAndroid();
      //       }}
      //       title="Download"
      //     />
      //   } 

      />
      <Pdf
        source={Platform.OS === 'ios' ? require("../../assets/pdf/terms_and_conditions.pdf") : { uri: 'bundle-assets://terms_and_conditions.pdf' }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={{ flex: 1, width: '100%', height: '100%' }} />
    </View>
  );
};

export default TradeBook;
