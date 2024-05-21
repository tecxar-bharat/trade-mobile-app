import EHeader from "@commonComponents/EHeader";
import MenuButton from "@commonComponents/MenuButton";
import TabView from "@commonComponents/TabView";
import { INavigation, IPosition } from "@interfaces/common";
import Holding from "@pages/Portfolio/Holding";
import { useRoute } from "@react-navigation/native";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppSelector } from "@store/index";
import React from "react";
import { View } from "react-native";
import Position from "./Position";
import { positionSelector } from "@store/reducers/positionReducer";
import { holdingSelector } from "@store/reducers/holdingReducer";
import EBadgeForTab from "@commonComponents/EBadge";

const PositionBadge = () => {
  const positionList = useAppSelector((state) =>
    positionSelector(state, "positionList")
  ) as IPosition[];

  if (positionList.length > 0) {
    return (
      <EBadgeForTab
        count={positionList.filter((qty) => qty.netQty !== 0).length}
      />
    );
  }
  return null;
};

const HoldingBadge = () => {
  const holdingList = useAppSelector((state) =>
    holdingSelector(state, "holdingList")
  ) as IPosition[];
  if (holdingList.length > 0) {
    return (
      <EBadgeForTab
        count={holdingList.filter((qty) => qty.netQty !== 0).length}
      />
    );
  }
  return null;
};

const Report = ({ navigation }: INavigation) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const route = useRoute();
  const selectedTabIndex = route?.params?.selectedTabIndex;

  const PositionRoute = () => {
    return <Position navigation={navigation} />;
  };
  const HoldingRoute = () => {
    return <Holding navigation={navigation} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      <EHeader
        title="Portfolio"
        isLeftIcon={<MenuButton navigation={navigation} />}
        showProfileButton={true}
        isHideBack={true}
      />
      <TabView
        tabs={[
          {
            key: "holdings",
            label: "Holdings",
            renderView: HoldingRoute,
            badge: <HoldingBadge />,
          },
          {
            key: "positions",
            label: "Positions",
            renderView: PositionRoute,
            badge: <PositionBadge />,
          },
        ]}
        lazy={false}
        currentIndex={selectedTabIndex}
      />
    </View>
  );
};

export default Report;
