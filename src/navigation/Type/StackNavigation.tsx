import React from "react";
import { ScreenRoute } from "../NavigationRoutes";
import { SCREENS } from "../NavigationKeys";
import AuthStack from "./AuthStack";
import { createStackNavigator } from "@react-navigation/stack";

export default function StackNavigation() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={SCREENS.Splash}
    >
      <Stack.Screen name={SCREENS.Splash} component={ScreenRoute.Splash} />
      <Stack.Screen name={SCREENS.Auth} component={AuthStack} />
      <Stack.Screen name={SCREENS.Login} component={ScreenRoute.Login} />
      <Stack.Screen name={SCREENS.Drawer} component={ScreenRoute.Drawer} />
      {/* Create User Screens */}
      <Stack.Screen name={SCREENS.Admin} component={ScreenRoute.Admin} />
      <Stack.Screen name={SCREENS.Master} component={ScreenRoute.Master} />
      <Stack.Screen name={SCREENS.User} component={ScreenRoute.User} />
      <Stack.Screen name={SCREENS.Broker} component={ScreenRoute.Broker} />
      <Stack.Screen
        name={SCREENS.ChangePassword}
        component={ScreenRoute.ChangePassword}
      />
      <Stack.Screen
        name={SCREENS.SummaryReport}
        component={ScreenRoute.SummaryReport}
      />
      <Stack.Screen
        name={SCREENS.AddAccount}
        component={ScreenRoute.AddAccount}
      />
      <Stack.Screen
        name={SCREENS.BlockedScript}
        component={ScreenRoute.BlockedScript}
      />
      <Stack.Screen
        name={SCREENS.BrokerBill}
        component={ScreenRoute.BrokerBill}
      />
      <Stack.Screen
        name={SCREENS.UplineBill}
        component={ScreenRoute.UplineBill}
      />

      {/* Utility Screen */}
      <Stack.Screen
        name={SCREENS.AutoSquareOff}
        component={ScreenRoute.AutoSquareOff}
      />
      <Stack.Screen
        name={SCREENS.CashEntryList}
        component={ScreenRoute.CashEntryList}
      />
      <Stack.Screen
        name={SCREENS.RejectedLogs}
        component={ScreenRoute.RejectedLogs}
      />
      <Stack.Screen
        name={SCREENS.TradeLogs}
        component={ScreenRoute.TradeLogs}
      />
      <Stack.Screen
        name={SCREENS.UserLogsList}
        component={ScreenRoute.UserLogsList}
      />
      <Stack.Screen
        name={SCREENS.RulesAndRegulationsPage}
        component={ScreenRoute.RulesAndRegulationsPage}
      />
      <Stack.Screen
        name={SCREENS.JVLedgerPage}
        component={ScreenRoute.JVLedgerPage}
      />
      <Stack.Screen
        name={SCREENS.JVEntryPage}
        component={ScreenRoute.JVEntryPage}
      />
      <Stack.Screen
        name={SCREENS.CashLedgerPage}
        component={ScreenRoute.CashLedgerPage}
      />
      <Stack.Screen
        name={SCREENS.CashEntryPage}
        component={ScreenRoute.CashEntryPage}
      />
      <Stack.Screen
        name={SCREENS.DepositeLedgerPage}
        component={ScreenRoute.DepositeLedgerPage}
      />
      <Stack.Screen
        name={SCREENS.DepositeEntryPage}
        component={ScreenRoute.DepositeEntryPage}
      />
      <Stack.Screen
        name={SCREENS.AnnouncementsPage}
        component={ScreenRoute.AnnouncementsPage}
      />
      <Stack.Screen
        name={SCREENS.MCXSymbolsPage}
        component={ScreenRoute.MCXSymbolsPage}
      />
      <Stack.Screen
        name={SCREENS.ShortTradeReportPage}
        component={ScreenRoute.ShortTradeReportPage}
      />
      <Stack.Screen
        name={SCREENS.BlockScriptListPage}
        component={ScreenRoute.BlockScriptListPage}
      />
      <Stack.Screen
        name={SCREENS.BlockScriptGroupPage}
        component={ScreenRoute.BlockScriptGroupPage}
      />
      <Stack.Screen
        name={SCREENS.QuantityScriptListPage}
        component={ScreenRoute.QuantityScriptListPage}
      />
      <Stack.Screen
        name={SCREENS.QuantityScriptGroupPage}
        component={ScreenRoute.QuantityScriptGroupPage}
      />
      <Stack.Screen
        name={SCREENS.LedgerPage}
        component={ScreenRoute.LedgerPage}
      />
      <Stack.Screen name={SCREENS.Script} component={ScreenRoute.Script} />
      <Stack.Screen name={SCREENS.BuySell} component={ScreenRoute.BuySell} />
      <Stack.Screen
        name={SCREENS.EditAdmin}
        component={ScreenRoute.EditAdmin}
      />
      <Stack.Screen
        name={SCREENS.EditMaster}
        component={ScreenRoute.EditMaster}
      />
      <Stack.Screen name={SCREENS.EditUser} component={ScreenRoute.EditUser} />
      <Stack.Screen
        name={SCREENS.EditBroker}
        component={ScreenRoute.EditBroker}
      />
      <Stack.Screen
        name={SCREENS.MaxQtyLimit}
        component={ScreenRoute.MaxQtyLimit}
      />
      <Stack.Screen name={SCREENS.Form} component={ScreenRoute.Form} />
      <Stack.Screen
        name={SCREENS.EditQuantityScriptGroup}
        component={ScreenRoute.EditQuantityScriptGroup}
      />
      <Stack.Screen name={SCREENS.Deposit} component={ScreenRoute.Deposit} />
      <Stack.Screen
        name={SCREENS.Withdrawal}
        component={ScreenRoute.Withdrawal}
      />
      <Stack.Screen
        name={SCREENS.ImageShow}
        component={ScreenRoute.ImageShow}
      />
      <Stack.Screen
        name={SCREENS.BackAccount}
        component={ScreenRoute.BackAccount}
      />
      <Stack.Screen
        name={SCREENS.MaxQtyLimitUser}
        component={ScreenRoute.MaxQtyLimitUser}
      />
      <Stack.Screen name={SCREENS.Holding} component={ScreenRoute.Holding} />
      <Stack.Screen
        name={SCREENS.PositionTrade}
        component={ScreenRoute.PositionTrade}
      />
      <Stack.Screen
        name={SCREENS.ClosePosition}
        component={ScreenRoute.ClosePosition}
      />
      <Stack.Screen
        name={SCREENS.EditTrade}
        component={ScreenRoute.EditTrade}
      />
      <Stack.Screen
        name={SCREENS.LedgerBroker}
        component={ScreenRoute.LedgerBroker}
      />
      <Stack.Screen name={SCREENS.PdfView} component={ScreenRoute.PdfView} />
      <Stack.Screen name={SCREENS.WebView} component={ScreenRoute.WebView} />
      <Stack.Screen name={SCREENS.Holidays} component={ScreenRoute.Holidays} />
      <Stack.Screen
        name={SCREENS.AddHolidays}
        component={ScreenRoute.AddHolidays}
      />
    </Stack.Navigator>
  );
}
