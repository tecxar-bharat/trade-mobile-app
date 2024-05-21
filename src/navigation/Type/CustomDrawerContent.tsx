import images from "@assets/images";
import IconArrowsSort from "@assets/svgs/IconArrowsSort";
import IconBuildingBank from "@assets/svgs/IconBuildingBank";
import IconCash from "@assets/svgs/IconCash";
import IconCircleMinus from "@assets/svgs/IconCircleMinus";
import IconClipboardText from "@assets/svgs/IconClipboardText";
import IconCurrencyRupee from "@assets/svgs/IconCurrencyRupee";
import IconGraph from "@assets/svgs/IconGraph";
import IconLayoutDashboard from "@assets/svgs/IconLayoutDashboard";
import IconLetterL from "@assets/svgs/IconLetterL";
import IconLetterM from "@assets/svgs/IconLetterM";
import IconList from "@assets/svgs/IconList";
import IconLogicOr from "@assets/svgs/IconLogicOr";
import IconPlaylistX from "@assets/svgs/IconPlaylistX";
import IconPoint from "@assets/svgs/IconPoint";
import IconReportMoney from "@assets/svgs/IconReportMoney";
import IconSettings from "@assets/svgs/IconSettings";
import IconSpeakerphone from "@assets/svgs/IconSpeakerphone";
import IconTimelineEventPlus from "@assets/svgs/IconTimelineEventPlus";
import IconTools from "@assets/svgs/IconTools";
import IconTransferIn from "@assets/svgs/IconTransferIn";
import IconTransferOut from "@assets/svgs/IconTransferOut";
import IconUser from "@assets/svgs/IconUser";
import IconUserBolt from "@assets/svgs/IconUserBolt";
import IconUserScan from "@assets/svgs/IconUserScan";
import IconUserUp from "@assets/svgs/IconUserUp";
import IconUsersGroup from "@assets/svgs/IconUsersGroup";
import IconHoliday from "@assets/svgs/IconHoliday";
import IconWallet from "@assets/svgs/IconWallet";
import IconArrowsJoin from "@assets/svgs/IconArrowsJoin";
import IconReceiptRupee from "@assets/svgs/IconReceiptRupee";
import { moderateScale } from "@common/constants";
import EText from "@components/common/EText";
import { LoggedUser } from "@db/schemas/loggedUser.model";
import { INavigation } from "@interfaces/common";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useAppDispatch, useAppSelector } from "@store/index";
import { socketActions } from "@store/reducers/socketReducer";
import {
  changeThemeAction,
  themeSelector,
} from "@store/reducers/theme.reducer";
import { colors, styles } from "@themes/index";
import { getAppName } from "@utils/helpers";
import * as React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SCREENS } from "../NavigationKeys";

const CustomDrawerContent = (props: INavigation) => {
  const [expanded, setExpanded] = React.useState<string>("");
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(socketActions.startConnecting());
  }, []);

  const userData = LoggedUser.getActiveUser(globalThis.realm);
  const userRole = userData?.role?.slug;
  const current = useAppSelector((state) => themeSelector(state, "current"));
  let menu = [];

  if (userRole === "user") {
    menu.push(
      {
        name: "Market Watch",
        route: SCREENS.WatchList,
        icon: (
          <Image source={images.MarketIcon} style={{ height: 24, width: 24 }} />
        ),
      },
      {
        name: "Trades",
        icon: <IconGraph color={current.textColor} />,
        subRoutes: [
          {
            name: "Trade",
            route: SCREENS.Trades,
            selectedTabIndex: 0,
            icon: <IconList color={current.textColor} />,
          },
          {
            name: "Position",
            route: SCREENS.Position,
            selectedTabIndex: 1,
            icon: <IconPoint color={current.textColor} />,
          },
          {
            name: "Holdings",
            route: SCREENS.Position,
            selectedTabIndex: 0,
            icon: <IconPoint color={current.textColor} />,
          },
          {
            name: "MaxQty Limit",
            route: SCREENS.Trades,
            selectedTabIndex: 1,
            icon: <IconArrowsSort color={current.textColor} />,
          },
          {
            name: "Block Scripts",
            route: SCREENS.Trades,
            selectedTabIndex: 2,
            icon: <IconCircleMinus color={current.textColor} />,
          },
        ],
      },
      {
        name: "Funds",
        icon: <IconCurrencyRupee color={current.textColor} />,
        subRoutes: [
          {
            name: "Deposit",
            route: SCREENS.Funds,
            selectedTabIndex: 0,
            icon: <IconTransferIn color={current.textColor} />,
          },
          {
            name: "Withdrawal",
            route: SCREENS.Funds,
            selectedTabIndex: 1,
            icon: <IconTransferOut color={current.textColor} />,
          },
        ],
      },
      {
        name: "Reports",
        icon: <IconReportMoney color={current.textColor} />,
        subRoutes: [
          {
            name: "Rejected Logs",
            route: SCREENS.Reports,
            selectedTabIndex: 0,
            icon: <IconPlaylistX color={current.textColor} />,
          },
          {
            name: "Ledger",
            route: SCREENS.Reports,
            selectedTabIndex: 1,
            icon: <IconLetterL color={current.textColor} />,
          },
        ],
      }
    );
  } else if (userRole === "broker") {
    menu.push(
      {
        name: "Market Watch",
        route: SCREENS.WatchList,
        icon: (
          <Image source={images.MarketIcon} style={{ height: 24, width: 24 }} />
        ),
      },
      {
        name: "Trades",
        icon: <IconGraph color={current.textColor} />,
        subRoutes: [
          {
            name: "Trade",
            route: SCREENS.Trades,
            icon: <IconList color={current.textColor} />,
          },
          {
            name: "Position",
            route: SCREENS.Position,
            selectedTabIndex: 1,
            icon: <IconPoint color={current.textColor} />,
          },
          {
            name: "Holdings",
            route: SCREENS.Position,
            selectedTabIndex: 0,
            icon: <IconPoint color={current.textColor} />,
          },
        ],
      },
      // {
      //   name: "Users",
      //   icon: <IconWallet color={current.textColor} />,
      //   subRoutes: [
      //     {
      //       name: "User",
      //       route: SCREENS.User,
      //       icon: <IconUser color={current.textColor} />,
      //     },
      //   ],
      // },
      {
        name: "Reports",
        icon: <IconReceiptRupee color={current.textColor} />,
        subRoutes: [
          {
            name: "Ledger",
            route: SCREENS.Reports,
            selectedTabIndex: 0,
            icon: <IconLetterL color={current.textColor} />,
          },
          {
            name: "Brokerage Report",
            route: SCREENS.Reports,
            selectedTabIndex: 1,
            icon: <IconUserScan color={current.textColor} />,
          },
        ],
      }
    );
  } else if (userRole === "master") {
    menu.push(
      {
        name: "Dashboard",
        route: SCREENS.Dashboard,
        icon: <IconLayoutDashboard color={current.textColor} />,
      },
      {
        name: "Market Watch",
        route: SCREENS.WatchList,
        icon: (
          <Image source={images.MarketIcon} style={{ height: 24, width: 24 }} />
        ),
      },
      {
        name: "Trades",
        icon: <IconGraph color={current.textColor} />,
        subRoutes: [
          {
            name: "Trades",
            route: SCREENS.Trades,
            selectedTabIndex: 0,
            icon: <IconList color={current.textColor} />,
          },
          {
            name: "Position",
            route: SCREENS.Position,
            selectedTabIndex: 1,
            icon: <IconPoint color={current.textColor} />,
          },
          {
            name: "Holding",
            route: SCREENS.Position,
            selectedTabIndex: 0,
            icon: <IconPoint color={current.textColor} />,
          },
          {
            name: "Summary Report",
            route: SCREENS.Trades,
            selectedTabIndex: 1,
            icon: <IconClipboardText color={current.textColor} />,
          },
          {
            name: "Max Qty Limits",
            route: SCREENS.Trades,
            selectedTabIndex: 2,
            icon: <IconArrowsSort color={current.textColor} />,
          },
          {
            name: "Block Scripts",
            route: SCREENS.Trades,
            selectedTabIndex: 3,
            icon: <IconCircleMinus color={current.textColor} />,
          },
        ],
      },
      {
        name: "Users",
        icon: <IconWallet color={current.textColor} />,
        subRoutes: [
          {
            name: "User",
            route: SCREENS.User,
            icon: <IconUser color={current.textColor} />,
          },
          {
            name: "Broker",
            route: SCREENS.Broker,
            icon: <IconUserScan color={current.textColor} />,
          },
          {
            name: "Add Account",
            route: SCREENS.AddAccount,
            icon: <IconTimelineEventPlus color={current.textColor} />,
          },
        ],
      },
      {
        name: "Funds",
        icon: <IconCurrencyRupee color={current.textColor} />,
        subRoutes: [
          {
            name: "Deposit",
            route: SCREENS.Deposit,
            icon: <IconTransferIn color={current.textColor} />,
          },
          {
            name: "Withdrawal",
            route: SCREENS.Withdrawal,
            icon: <IconTransferOut color={current.textColor} />,
          },
        ],
      },
      {
        name: "Reports",
        icon: <IconReceiptRupee color={current.textColor} />,
        subRoutes: [
          {
            name: "Ledger",
            route: SCREENS.Reports,
            selectedTabIndex: 0,
            icon: <IconLetterL color={current.textColor} />,
          },
          {
            name: "Broker Report",
            route: SCREENS.Reports,
            selectedTabIndex: 1,
            icon: <IconUserScan color={current.textColor} />,
          },
          {
            name: "Upline Report",
            route: SCREENS.Reports,
            selectedTabIndex: 2,
            icon: <IconUserUp color={current.textColor} />,
          },
          // {
          //   name: "JV",
          //   route: SCREENS.JVEntryPage,
          //   icon: <IconArrowsJoin color={current.textColor} />,
          // },
          // {
          //   name: "Cash Entry",
          //   route: SCREENS.CashEntryPage,
          //   icon: <IconCash color={current.textColor} />,
          // },
        ],
      },
      {
        name: "Utilities",
        icon: <IconTools color={current.textColor} />,
        subRoutes: [
          {
            name: "Trade Edit/Delete Logs",
            route: SCREENS.TradeLogs,
            icon: <IconList color={current.textColor} />,
          },
          {
            name: "Rejected Logs",
            route: SCREENS.RejectedLogs,
            icon: <IconPlaylistX color={current.textColor} />,
          },
          {
            name: "User Login Logs",
            route: SCREENS.UserLogsList,
            icon: <IconUsersGroup color={current.textColor} />,
          },
        ],
      }
    );
  } else if (userRole === "admin") {
    menu.push(
      {
        name: "Dashboard",
        route: SCREENS.Dashboard,
        icon: <IconLayoutDashboard color={current.textColor} />,
      },
      {
        name: "Market Watch",
        route: SCREENS.WatchList,
        icon: (
          <Image source={images.MarketIcon} style={{ height: 24, width: 24 }} />
        ),
      },
      {
        name: "Trades",
        icon: <IconGraph color={current.textColor} />,
        subRoutes: [
          {
            name: "Trades",
            route: SCREENS.Trades,
            selectedTabIndex: 0,
            icon: <IconList color={current.textColor} />,
          },
          {
            name: "Position",
            route: SCREENS.Position,
            selectedTabIndex: 1,
            icon: <IconPoint color={current.textColor} />,
          },
          {
            name: "Holding",
            route: SCREENS.Position,
            selectedTabIndex: 0,
            icon: <IconPoint color={current.textColor} />,
          },
          {
            name: "Summary Report",
            route: SCREENS.Trades,
            selectedTabIndex: 1,
            icon: <IconClipboardText color={current.textColor} />,
          },
          {
            name: "Max Qty Limits",
            route: SCREENS.Trades,
            selectedTabIndex: 2,
            icon: <IconArrowsSort color={current.textColor} />,
          },
          {
            name: "Block Scripts",
            route: SCREENS.Trades,
            selectedTabIndex: 3,
            icon: <IconCircleMinus color={current.textColor} />,
          },
        ],
      },
      {
        name: "Users",
        icon: <IconWallet color={current.textColor} />,
        subRoutes: [
          {
            name: "Master",
            route: SCREENS.Master,
            icon: <IconLetterM color={current.textColor} />,
          },
          {
            name: "User",
            route: SCREENS.User,
            icon: <IconUser color={current.textColor} />,
          },
          {
            name: "Broker",
            route: SCREENS.Broker,
            icon: <IconUserScan color={current.textColor} />,
          },
          {
            name: "Add Account",
            route: SCREENS.AddAccount,
            icon: <IconTimelineEventPlus color={current.textColor} />,
          },
        ],
      },
      {
        name: "Funds",
        icon: <IconCurrencyRupee color={current.textColor} />,
        subRoutes: [
          {
            name: "Deposit",
            route: SCREENS.Deposit,
            icon: <IconTransferIn color={current.textColor} />,
          },
          {
            name: "Withdrawal",
            route: SCREENS.Withdrawal,
            icon: <IconTransferOut color={current.textColor} />,
          },
        ],
      },
      {
        name: "Reports",
        icon: <IconReceiptRupee color={current.textColor} />,
        subRoutes: [
          {
            name: "Ledger",
            route: SCREENS.Reports,
            selectedTabIndex: 0,
            icon: <IconLetterL color={current.textColor} />,
          },
          {
            name: "Broker Report",
            route: SCREENS.Reports,
            selectedTabIndex: 2,
            icon: <IconUserScan color={current.textColor} />,
          },
          {
            name: "Cash Ledger",
            route: SCREENS.Reports,
            selectedTabIndex: 1,
            icon: <IconPoint color={current.textColor} />,
          },
          {
            name: "JV",
            route: SCREENS.JVEntryPage,
            icon: <IconArrowsJoin color={current.textColor} />,
          },
          {
            name: "Cash Entry",
            route: SCREENS.CashEntryPage,
            icon: <IconCash color={current.textColor} />,
          },
        ],
      },
      {
        name: "Utilities",
        icon: <IconTools color={current.textColor} />,
        subRoutes: [
          {
            name: "Trade Edit/Delete Logs",
            route: SCREENS.TradeLogs,
            icon: <IconList color={current.textColor} />,
          },
          {
            name: "Rejected Logs",
            route: SCREENS.RejectedLogs,
            icon: <IconPlaylistX color={current.textColor} />,
          },
          {
            name: "User Login Logs",
            route: SCREENS.UserLogsList,
            icon: <IconUsersGroup color={current.textColor} />,
          },
        ],
      }
    );
  } else {
    menu.push(
      {
        name: "Dashboard",
        route: SCREENS.Dashboard,
        icon: <IconLayoutDashboard color={current.textColor} />,
      },
      {
        name: "Market Watch",
        route: SCREENS.WatchList,
        icon: (
          <Image source={images.MarketIcon} style={{ height: 24, width: 24 }} />
        ),
      },
      {
        name: "Trades",
        icon: <IconGraph color={current.textColor} />,
        subRoutes: [
          {
            name: "Trades",
            route: SCREENS.Trades,
            selectedTabIndex: 0,
            icon: <IconList color={current.textColor} />,
          },
          {
            name: "Position",
            route: SCREENS.Position,
            selectedTabIndex: 1,
            icon: <IconPoint color={current.textColor} />,
          },
          {
            name: "Holding",
            route: SCREENS.Position,
            selectedTabIndex: 0,
            icon: <IconPoint color={current.textColor} />,
          },
          {
            name: "Summary Report",
            route: SCREENS.Trades,
            selectedTabIndex: 1,
            icon: <IconClipboardText color={current.textColor} />,
          },

          {
            name: "Max Qty Limits",
            route: SCREENS.Trades,
            selectedTabIndex: 2,
            icon: <IconArrowsSort color={current.textColor} />,
          },
          {
            name: "Block Scripts",
            route: SCREENS.Trades,
            selectedTabIndex: 3,
            icon: <IconCircleMinus color={current.textColor} />,
          },
        ],
      },
      {
        name: "Users",
        icon: <IconWallet color={current.textColor} />,
        subRoutes: [
          {
            name: "Admin",
            route: SCREENS.Admin,
            icon: <IconUserBolt color={current.textColor} />,
          },
          {
            name: "Master",
            route: SCREENS.Master,
            icon: <IconLetterM color={current.textColor} />,
          },
          {
            name: "User",
            route: SCREENS.User,
            icon: <IconUser color={current.textColor} />,
          },
          {
            name: "Broker",
            route: SCREENS.Broker,
            icon: <IconUserScan color={current.textColor} />,
          },
          {
            name: "Add Account",
            route: SCREENS.AddAccount,
            icon: <IconTimelineEventPlus color={current.textColor} />,
          },
        ],
      },
      {
        name: "Funds",
        icon: <IconCurrencyRupee color={current.textColor} />,
        subRoutes: [
          {
            name: "Deposit",
            route: SCREENS.Deposit,
            icon: <IconTransferIn color={current.textColor} />,
          },
          {
            name: "Withdrawal",
            route: SCREENS.Withdrawal,
            icon: <IconTransferOut color={current.textColor} />,
          },
          {
            name: "Bank Account",
            route: SCREENS.BackAccount,
            icon: <IconBuildingBank color={current.textColor} />,
          },
        ],
      },
      {
        name: "Reports",
        icon: <IconReceiptRupee color={current.textColor} />,
        subRoutes: [
          {
            name: "Ledger",
            route: SCREENS.Reports,
            selectedTabIndex: 0,
            icon: <IconLetterL color={current.textColor} />,
          },
          {
            name: "Cash Ledger",
            route: SCREENS.Reports,
            selectedTabIndex: 1,
            icon: <IconPoint color={current.textColor} />,
          },
          {
            name: "Broker Report",
            route: SCREENS.Reports,
            selectedTabIndex: 2,
            icon: <IconUserScan color={current.textColor} />,
          },
          {
            name: "Short Trade Report",
            route: SCREENS.Reports,
            selectedTabIndex: 3,
            icon: <IconArrowsSort color={current.textColor} />,
          },
          {
            name: "JV",
            route: SCREENS.JVEntryPage,
            icon: <IconArrowsJoin color={current.textColor} />,
          },
          {
            name: "Cash Entry",
            route: SCREENS.CashEntryPage,
            icon: <IconCash color={current.textColor} />,
          },
        ],
      },
      {
        name: "Utilities",
        icon: <IconTools color={current.textColor} />,
        subRoutes: [
          {
            name: "Trade Edit/Delete Logs",
            route: SCREENS.TradeLogs,
            icon: <IconList color={current.textColor} />,
          },
          {
            name: "Rejected Logs",
            route: SCREENS.RejectedLogs,
            icon: <IconPlaylistX color={current.textColor} />,
          },
          {
            name: "Auto Square off logs",
            route: SCREENS.AutoSquareOff,
            icon: <IconLogicOr color={current.textColor} />,
          },
          {
            name: "User Login Logs",
            route: SCREENS.UserLogsList,
            icon: <IconUsersGroup color={current.textColor} />,
          },
          {
            name: "Holiday",
            route: SCREENS.Holidays,
            icon: <IconHoliday color={current.textColor} />,
          },
        ],
      },
      {
        name: "Settings",
        icon: <IconSettings color={current.textColor} />,
        subRoutes: [
          {
            name: "Announcements",
            route: SCREENS.AnnouncementsPage,
            icon: <IconSpeakerphone color={current.textColor} />,
          },

          // { name: "MCX Symbols", route: SCREENS.MCXSymbolsPage, icon: <IconHexagons color={current.textColor} /> },
        ],
      }
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor }}>
      <DrawerContentScrollView
        {...props}
        style={{ flex: 1, padding: 8, paddingTop: 16 }}
      >
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Image
            source={images.TradeAppLogo}
            resizeMode="center"
            style={{
              ...localStyles.userImage,
              marginLeft: 4,
            }}
          />
          <EText
            type="s22"
            style={{
              ...styles.selfCenter,
              marginLeft: 8,
            }}
          >
            {getAppName()}
          </EText>
        </View>
        {menu.map((e) => {
          return (
            <React.Fragment>
              <TouchableOpacity
                onPress={() => {
                  if (e.subRoutes) {
                    if (expanded === e.name) {
                      setExpanded("");
                    } else {
                      setExpanded(e.name);
                    }
                  } else {
                    props.navigation.navigate(e.route);
                  }
                }}
                style={{
                  flexDirection: "row",
                  height: 50,
                  alignItems: "center",
                }}
              >
                <View style={{ width: 25, alignItems: "center" }}>
                  {e.icon ? e.icon : null}
                </View>
                <EText type="r16" style={{ flex: 1, marginLeft: 10 }}>
                  {e.name}
                </EText>

                {e.subRoutes && e.subRoutes?.length > 0 && (
                  <View style={{ marginHorizontal: 10 }}>
                    <Ionicons
                      name={
                        expanded === e.name
                          ? "chevron-up-outline"
                          : "chevron-down-outline"
                      }
                      size={moderateScale(20)}
                      color={current.primary}
                    />
                  </View>
                )}
              </TouchableOpacity>
              {e.subRoutes && e.subRoutes.length > 0 && expanded === e.name && (
                <React.Fragment>
                  <View
                    style={{
                      height: 1,
                      marginHorizontal: 5,
                      backgroundColor: current.bcolor,
                    }}
                  />
                  {e.subRoutes.map((i, index) => {
                    return (
                      <View style={{ paddingHorizontal: 10 }}>
                        <TouchableOpacity
                          onPress={() => {
                            props.navigation.navigate(i.route, {
                              selectedTabIndex: i.selectedTabIndex,
                            });
                          }}
                          style={{
                            flexDirection: "row",
                            height: 50,
                            paddingLeft: 10,
                            alignItems: "center",
                          }}
                        >
                          <View style={{ width: 25, alignItems: "center" }}>
                            {i.icon ? i.icon : null}
                          </View>
                          <EText type="r16" style={{ flex: 1, marginLeft: 10 }}>
                            {i.name}
                          </EText>
                        </TouchableOpacity>
                        {index < e.subRoutes.length - 1 && (
                          <View
                            style={{
                              height: 0.5,
                              marginHorizontal: 5,
                              backgroundColor: current.bcolor,
                            }}
                          />
                        )}
                      </View>
                    );
                  })}
                </React.Fragment>
              )}
              <View
                style={{
                  height: 1,
                  marginHorizontal: 5,
                  backgroundColor: current.bcolor,
                }}
              />
            </React.Fragment>
          );
        })}
      </DrawerContentScrollView>
    </View>
  );
};
export const RenderThemeIcon = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const dispatch = useAppDispatch();
  return (
    <TouchableOpacity
      onPress={() => {
        if (current.value === "light") {
          dispatch(changeThemeAction(colors.dark));
        } else {
          dispatch(changeThemeAction(colors.light));
        }
      }}
    >
      <View style={{ position: "relative" }}>
        {current.value === "light" ? (
          <Entypo name="moon" size={20} color={"black"} />
        ) : (
          <Entypo name="light-up" size={25} color={"#FFFFFF"} />
        )}
      </View>
    </TouchableOpacity>
  );
};
const localStyles = StyleSheet.create({
  LogOutButtonContainer: {
    ...styles.selfCenter,
    height: 40,
    alignItems: "center",
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    width: 150,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#FE7765",
  },
  userImage: {
    width: moderateScale(40),
    height: moderateScale(40),
    // flex: 1,
  },
});
export default CustomDrawerContent;
