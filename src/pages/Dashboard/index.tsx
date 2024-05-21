/* eslint-disable react/react-in-jsx-scope */
import TabView from "@commonComponents/TabView";
import EHeader from "@components/common/EHeader";
import MenuButton from "@components/common/MenuButton";
import { INavigation } from "@interfaces/common";
import MtMAlerts from "@pages/MtMRoute";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import React from "react";
import { View } from "react-native";
import DashboardComponent from "./DashboardComponent";

const Dashboard = ({ navigation }: INavigation) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));

  const CompletedRoute = () => {
    return <DashboardComponent type={"completed"} />;
  };
  const PendingRoute = () => {
    return <DashboardComponent type={"pending"} />;
  };
  const RejectedRoute = () => {
    return <DashboardComponent type={"rejected"} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      <EHeader
        title="Dashboard"
        isLeftIcon={<MenuButton navigation={navigation} />}
        showProfileButton
        isHideBack={true}
      />

      <TabView
        tabs={[
          { key: "completed", label: "Completed", renderView: CompletedRoute },
          { key: "pending", label: "Pending", renderView: PendingRoute },
          { key: "mtm", label: "M2M Alerts", renderView: MtMAlerts },
          { key: "rejected", label: "Rejected", renderView: RejectedRoute },
        ]}
        scrollEnabled={true}
      />
    </View>
  );
};
export default Dashboard;
