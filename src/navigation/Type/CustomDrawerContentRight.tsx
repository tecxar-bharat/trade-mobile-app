import { moderateScale } from "@common/constants";
import AnimatedLoadButton from "@commonComponents/AnimatedLoadButton";
import ApproveRejectModal from "@commonComponents/ApproveRejectModal";
import EButton from "@commonComponents/EButton";
import EDivider from "@commonComponents/EDivider";
import EText from "@components/common/EText";
import LinkAccountModal from "@components/models/LinkAccountModal";
import { LoggedUser } from "@db/schemas/loggedUser.model";
import { IMtMData, INavigation, IPosition } from "@interfaces/common";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  getAvailableBalance,
  logout,
  updateUserData,
} from "@store/reducers/auth.reducer";
import { socketActions } from "@store/reducers/socketReducer";
import {
  changeThemeAction,
  themeSelector,
} from "@store/reducers/theme.reducer";
import { colors, styles } from "@themes/index";
import { formatIndianAmount } from "@utils/helpers";
import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SCREENS } from "../NavigationKeys";
import DeleteModal from "@components/models/DeleteModal";
import IconDelete from "@assets/svgs/IconDelete";
import {
  getHoldingList,
  holdingSelector,
} from "@store/reducers/holdingReducer";
import { calculateTotalMtM } from "@pages/Portfolio/helpers";
import {
  getPositionList,
  positionSelector,
} from "@store/reducers/positionReducer";
import CookieManager from "@react-native-cookies/cookies";
import config from "@config/index";
import IconUser from "@assets/svgs/IconUser";
import IconTransform from "@assets/svgs/IconTransform";
import IconTablePlus from "@assets/svgs/IconTablePlus";
import IconCircles from "@assets/svgs/IconCircles";
import IconKey from "@assets/svgs/IconKey";

const UserTotalPNL = ({
  getHoldingAndPosition,
}: {
  getHoldingAndPosition: () => void;
}) => {
  const [holdingTotalMtM, setHoldingTotalMtM] = useState(0);
  const [positionTotalMtM, setPositionTotalMtM] = useState(0);

  const holdingM2MData = useAppSelector((state) =>
    holdingSelector(state, "m2mData")
  ) as IMtMData;
  const positionM2MData = useAppSelector((state) =>
    positionSelector(state, "m2mData")
  ) as IMtMData;

  useEffect(() => {
    getHoldingAndPosition();
  }, []);

  useEffect(() => {
    setHoldingTotalMtM(calculateTotalMtM(holdingM2MData));
  }, [holdingM2MData]);

  useEffect(() => {
    setPositionTotalMtM(calculateTotalMtM(positionM2MData));
  }, [positionM2MData]);

  return formatIndianAmount(holdingTotalMtM + positionTotalMtM);
};

const CustomDrawerContent = (props: INavigation) => {
  const dispatch = useAppDispatch();

  const [balanceLoading, setBalanceLoading] = React.useState(false);
  const [addAccountModal, setAddAccountModal] = useState(false);
  const [switchUserConfirmation, setSwitchUserConfirmation] =
    useState<LoggedUser | null>(null);
  const [deleteAccount, setDeleteAccount] = useState<LoggedUser | null>(null);
  const [expandedSwitchUser, setExpandedSwitchUser] = useState(false);

  const userData = LoggedUser.getActiveUser(globalThis.realm);
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const loggedUser = LoggedUser.all(globalThis.realm);
  const [data, setData] = useState<LoggedUser[]>([]);
  const [pnlLoading, setPNLLoading] = useState(false);

  useEffect(() => {
    loggedUser.addListener(loggedUserWatcher);
    return () => {
      loggedUser.removeListener(loggedUserWatcher);
    };
  }, []);

  const loggedUserWatcher = (res) => {
    setData(JSON.parse(JSON.stringify(res)));
  };

  const Logout = async () => {
    console.log("----in disconnect");
    dispatch(socketActions.disconnect());
    await dispatch(logout());

    setTimeout(() => {
      globalThis.realm.write(() => {
        globalThis.realm.deleteAll();
      });
    }, 1000);
  };

  const getHoldingAndPosition = async () => {
    setPNLLoading(true);

    await dispatch(
      getPositionList({
        deliveryType: "intraDay",
      })
    );

    await dispatch(
      getHoldingList({
        deliveryType: "delivery",
      })
    );

    setPNLLoading(false);
  };

  const menu = [
    {
      icon: <IconTablePlus color={current.primary} />,
      label: "Link Account",
      onPress: () => setAddAccountModal(true),
    },
    {
      icon: <IconCircles color={current.primary} />,
      label: "Rules",
      onPress: () => props.navigation.navigate(SCREENS.RulesAndRegulationsPage),
    },
    {
      icon: <IconKey color={current.primary} />,
      label: "Change Password",
      onPress: () => props.navigation.navigate(SCREENS.ChangePassword),
    },
  ];

  const onConfirmToSwitch = () => {
    setTimeout(async () => {
      if (switchUserConfirmation) {
        LoggedUser.setAsCurrentUser(
          switchUserConfirmation?.id!,
          globalThis.realm
        );
        const sessionValue = switchUserConfirmation.Cookie.split("=")[1];
        await CookieManager.set(config.socketUrl, {
          name: "session",
          value: sessionValue,
        });
        setTimeout(() => {
          dispatch(updateUserData(switchUserConfirmation));
          props.navigation.reset({
            index: 0,
            routes: [{ name: SCREENS.Splash, params: { from: "switchUser" } }],
          });
          setSwitchUserConfirmation(null);
        }, 1000);
      }
    }, 200);
  };

  const onConfirmDelete = async () => {
    if (deleteAccount) {
      await LoggedUser.delete(deleteAccount?.id!, globalThis.realm);
    }
    setDeleteAccount(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor }}>
      <DrawerContentScrollView {...props} style={{ flex: 1 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            paddingHorizontal: 10,
            marginTop: 16,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              backgroundColor: current.primaryLight,
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
            }}
          >
            <IconUser color={current.primary} />
          </View>
          <View
            style={{
              marginLeft: 8,
            }}
          >
            <EText type="b14">{userData?.name}</EText>
            <EText type="s12">
              {userData?.userId} ({userData?.role.name})
            </EText>
          </View>
        </View>

        {userData?.role?.slug === "user" && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              paddingHorizontal: 10,
              marginTop: 10,
            }}
          >
            <View
              style={{
                backgroundColor: current.primaryLight,
                width: 50,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
              }}
            >
              <AnimatedLoadButton
                loading={pnlLoading}
                onPress={async () => {
                  setPNLLoading(true);
                  await dispatch(getAvailableBalance());
                  setTimeout(() => {
                    setPNLLoading(false);
                  }, 1000);
                }}
              />
            </View>
            <View
              style={{
                marginLeft: 8,
              }}
            >
              <EText type="b14">P&L</EText>
              <EText type="s12">
                <UserTotalPNL getHoldingAndPosition={getHoldingAndPosition} />
              </EText>
            </View>
          </View>
        )}

        {userData?.role?.slug === "user" && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              paddingHorizontal: 10,
              marginTop: 10,
            }}
          >
            <View
              style={{
                backgroundColor: current.primaryLight,
                width: 50,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
              }}
            >
              <AnimatedLoadButton
                loading={balanceLoading}
                onPress={async () => {
                  setBalanceLoading(true);
                  await dispatch(getAvailableBalance());
                  setTimeout(() => {
                    setBalanceLoading(false);
                  }, 1000);
                }}
              />
            </View>
            <View
              style={{
                marginLeft: 8,
              }}
            >
              <EText type="b14">Balance</EText>
              <EText type="s12">
                {userData?.balance
                  ? formatIndianAmount(userData?.balance)
                  : formatIndianAmount(0)}
              </EText>
            </View>
          </View>
        )}
        <EDivider style={{ marginTop: 10 }} />
        {data.length > 0 && (
          <React.Fragment>
            <TouchableOpacity
              onPress={() => setExpandedSwitchUser((prev) => !prev)}
              style={{
                display: "flex",
                flexDirection: "row",
                paddingHorizontal: 10,
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: current.primaryLight,
                  width: 50,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <IconTransform color={current.primary} />
              </View>
              <View
                style={{
                  flex: 1,
                  marginLeft: 8,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <EText type="b14">Switch Account</EText>
                <Ionicons
                  name={
                    expandedSwitchUser
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={moderateScale(20)}
                  color={current.primary}
                />
              </View>
            </TouchableOpacity>
            {expandedSwitchUser && (
              <React.Fragment>
                {data.map((e, iindex) => {
                  return (
                    <React.Fragment>
                      <TouchableOpacity
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingHorizontal: 10,
                          marginTop: 16,
                          marginBottom: 10,
                          marginLeft: 16,
                        }}
                        onPress={() => {
                          setSwitchUserConfirmation(e);
                        }}
                      >
                        <View
                          style={{
                            marginLeft: 8,
                            flex: 1,
                          }}
                        >
                          <EText type="b14">{e?.name}</EText>
                          <EText type="s12">
                            {e?.userId} ({e?.role.name})
                          </EText>
                        </View>

                        <TouchableOpacity
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onPress={() => setDeleteAccount(e)}
                        >
                          <IconDelete color={current.red} />
                        </TouchableOpacity>
                      </TouchableOpacity>
                      {iindex < data.length - 1 ? <EDivider /> : null}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            )}
            <EDivider style={{ marginTop: 10 }} />
            <ApproveRejectModal
              onPress={onConfirmToSwitch}
              visible={switchUserConfirmation !== null}
              title="Switch account"
              message={`Are you sure you want to switch to ${
                switchUserConfirmation ? switchUserConfirmation.name : ""
              } ?`}
              onDismiss={() => setSwitchUserConfirmation(null)}
            />

            <DeleteModal
              onPress={onConfirmDelete}
              visible={deleteAccount !== null}
              title={"Delete"}
              onDismiss={() => setDeleteAccount(null)}
              deleteLabel={deleteAccount?.name}
            />
          </React.Fragment>
        )}

        {menu.map((e) => {
          return (
            <TouchableOpacity
              onPress={e.onPress}
              style={{
                display: "flex",
                flexDirection: "row",
                paddingHorizontal: 10,
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: current.primaryLight,
                  width: 50,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                {e.icon}
              </View>
              <View
                style={{
                  marginLeft: 8,
                }}
              >
                <EText type="b14">{e.label}</EText>
              </View>
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>
      <View style={{ padding: 16 }}>
        <EButton
          style={{
            paddingHorizontal: 10,
          }}
          type="b16"
          title={"Logout"}
          onPress={Logout}
          bgColor={current.primary}
          icon={
            <MaterialIcons
              size={22}
              name={"logout"}
              color={current.white}
              style={{ padding: 5, aspectRatio: 1 }}
            />
          }
        />
      </View>
      <LinkAccountModal
        visible={addAccountModal}
        onDismiss={() => setAddAccountModal(false)}
        onSuccess={() => setAddAccountModal(false)}
      />
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
    borderRadius: 8,
    backgroundColor: "#FE7765",
  },
  userImage: {
    width: moderateScale(50),
    height: moderateScale(50),
    // flex: 1,
  },
});
export default CustomDrawerContent;
