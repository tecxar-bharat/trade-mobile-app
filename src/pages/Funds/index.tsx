import { useAppSelector } from "@store/index";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { themeSelector } from "@reducers/theme.reducer";
import { moderateScale } from "@common/constants";
import EText from "@commonComponents/EText";
import { INavigation } from "@interfaces/common";
import Holding from "@pages/Portfolio/Holding";
import Deposit from "./Deposit";
import Withdrawal from "./Withdrawal";
import EHeader from "@commonComponents/EHeader";
import images from "@assets/images";
import MenuButton from "@commonComponents/MenuButton";
import { useRoute } from "@react-navigation/native";
import TabView from "@commonComponents/TabView";

const Report = ({ navigation }: INavigation) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const route = useRoute();
  const selectedTabIndex = route?.params?.selectedTabIndex;

  const DipositeRoute = () => {
    return <Deposit navigation={navigation} hideHeader={true} />;
  };

  const WithdrawalRoute = () => {
    return <Withdrawal navigation={navigation} hideHeader={true} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      <EHeader
        title="Funds"
        isLeftIcon={<MenuButton navigation={navigation} />}
        showProfileButton={true}
        isHideBack={true}
      />
      <TabView
        tabs={[
          { key: "deposit", label: "Deposit", renderView: DipositeRoute },
          {
            key: "withdrawal",
            label: "Withdrawal",
            renderView: WithdrawalRoute,
          },
        ]}
        currentIndex={selectedTabIndex}
      />
    </View>
  );
};

export default Report;
