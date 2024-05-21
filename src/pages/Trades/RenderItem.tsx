import { ActionButton } from "@commonComponents/ActionButtons";
import { BuySellChip } from "@commonComponents/BuySellChip";
import EDivider from "@commonComponents/EDivider";
import EText from "@commonComponents/EText";
import ValueLabelComponent from "@commonComponents/ValueLabelComponent";
import { GlobalDataSegments, GlobalSegmentsSlug } from "@interfaces/common";
import { SCREENS } from "@navigation/NavigationKeys";
import { useNavigation } from "@react-navigation/native";
import tradeService from "@services/trade.service";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { dateFormat } from "@utils/constant";
import {
  formatIndianAmount,
  getSymbolNameFromIdentifier,
  getTypeLabel,
} from "@utils/helpers";
import moment from "moment";
import React, { Fragment, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import Toast from "react-native-toast-message";
const RenderItem = ({
  item,
  isTradesList,
  refreshList,
  setExpanded,
  expanded,
}: {
  item: any;
  isTradesList?: boolean;
  refreshList?: () => void;
  setExpanded: any;
  expanded: any;
}) => {
  const navigation = useNavigation();
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const onView = (item: any) => {
    if (expanded && expanded.id === item.id) {
      setExpanded(null);
    } else {
      setExpanded(item);
    }
  };

  const deleteButton =
    ((userData?.role?.slug === "superadmin" || userData?.deleteTrade) &&
      item.status !== "open" &&
      item.type !== "cf" &&
      item.type !== "bf") ||
    ((userData?.role?.slug === "superadmin" ||
      userData?.role.slug === "user" ||
      userData?.deleteTrade) &&
      item.status === "open" &&
      item.type !== "cf" &&
      item.type !== "bf");
  const editButton =
    ((userData?.role?.slug === "superadmin" || userData?.editTrade) &&
      item.status !== "open" &&
      item.type !== "cf" &&
      item.type !== "bf") ||
    ((userData?.role?.slug === "superadmin" ||
      userData?.role.slug === "user" ||
      userData?.editTrade) &&
      item.status === "open" &&
      item.type !== "cf" &&
      item.type !== "bf");

  return (
    <>
      <TouchableOpacity
        style={{
          borderRadius: 6,

          backgroundColor: current.backgroundColor,
          padding: 8,
          flex: 1,
          borderBottomWidth: 1, //expandedId?.id === item.id ? 0 : 1,
          borderColor:
            current.value === "dark" ? current.bcolor : current.bcolor,
        }}
        // disabled={!type}
        onPress={() => onView(item)}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, justifyContent: "space-between", gap: 3 }}>
            <EText type="m16" style={{ color: current.textColor }}>
              {item?.script?.name}
            </EText>
            <EText type="m14" style={{ color: current.textColor }}>
              Lot:{item?.lot}
            </EText>
            <EText type="m14" style={{ color: current.greyDark }}>
              {moment(item?.createdAt).format(dateFormat)}
            </EText>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              flex: 1,
              justifyContent: "space-between",
              gap: 3,
            }}
          >
            <EText type="m16" style={{ color: current.textColor }}>
              {formatIndianAmount(item?.price)}
            </EText>
            <EText type="m14" style={{ color: current.textColor }}>
              QTY:{item?.qty}
            </EText>
            <BuySellChip position={item?.position} />
          </View>
        </View>
        {item?.status === "rejected" && (
          <EText type="r14" style={{ marginTop: 5 }} color={current.textColor}>
            {item?.comment}
          </EText>
        )}
      </TouchableOpacity>
      {expanded?.id === item.id && (
        <Fragment>
          <View
            style={{
              backgroundColor: current.backgroundColor,
              padding: 10,
              paddingBottom: ["superadmin", "admin"].includes(
                userData?.role?.slug
              )
                ? 0
                : 10,
              flexDirection: "row",
              alignItems: "center",
              borderColor:
                current.value === "dark"
                  ? current.backgroundColor
                  : current.bcolor,
            }}
          >
            <ValueLabelComponent
              fields={[
                {
                  label: "Order Time",
                  value: moment(item.createdAt).format(dateFormat),
                },
                {
                  label: "Admin",
                  value: item.adminName,
                  access: {
                    superadmin: true,
                    admin: false,
                    master: false,
                    user: false,
                    broker: false,
                  },
                },
                {
                  label: "Master",
                  value: item.masterName,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: false,
                    user: false,
                    broker: false,
                  },
                },
                {
                  label: "Client",
                  value: item.user.user_id
                    ? `${item.user.name} (${item.user.user_id})`
                    : "-",
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: false,
                    broker: true,
                  },
                },
                {
                  label: "Segment",
                  value: item.segment.name,
                  textTransform: "uppercase",
                },
                {
                  label: "Script",
                  value: getSymbolNameFromIdentifier(
                    item.instrument.identifier
                  ),
                },
                {
                  label: "Order Type",
                  value: item.subType ? item.subType : getTypeLabel(item.type),
                  textTransform: "capitalize",
                },
                {
                  label: "Trade",
                  value: item.deliveryType,
                  textTransform: "capitalize",
                },
                {
                  label: "Position",
                  value: item.position,
                  textTransform: "capitalize",
                },
                { label: "Lot", value: item.lot },
                { label: "Qty", value: item.qty },
                { label: "Order Price", value: item.price, withComma: true },
                {
                  label: "Brokerage",
                  value: item.brokerBrokerage,
                  withComma: true,
                  access: {
                    superadmin: false,
                    admin: false,
                    master: false,
                    user: false,
                    broker: true,
                  },
                },
                {
                  label: "Total Brokerage",
                  value: item.brokerage,
                  withComma: true,
                  access: {
                    superadmin: false,
                    admin: false,
                    master: true,
                    user: true,
                    broker: false,
                  },
                },

                {
                  label: "Net Price",
                  value: item.priceWithBrokerage,
                  withComma: true,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: true,
                    broker: true,
                  },
                },

                {
                  label: "Total",
                  value: item.total,
                  withComma: true,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: false,
                    user: false,
                    broker: false,
                  },
                },
                {
                  label: "Total Brokerage",
                  value: item.brokerage,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: false,
                    user: false,
                    broker: false,
                  },
                  withComma: true,
                },
                {
                  label: "Volume",
                  value: item.netTotal,
                  withComma: true,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: true,
                    broker: true,
                  },
                },
                {
                  label: "Executed",
                  value: moment(item.executedAt).format(dateFormat),
                },
                { label: "Status", value: item.status, isStatus: true },
                {
                  label: "Ip Address",
                  value:
                    item.ipAddress && item.ipAddress !== "System"
                      ? item.ipAddress
                      : "-",
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: false,
                    broker: false,
                  },
                },
                {
                  label: "Created By",
                  value: item.role && item.role !== "System" ? item.role : "-",
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: false,
                    broker: false,
                  },
                },
              ]}
            />
          </View>
          {(deleteButton || editButton) && isTradesList && (
            <ActionButton
              {...(editButton && {
                edit: "edit",
                Edited: () => {
                  let segmentSlug = "";
                  if (item.segment.refSlug === GlobalDataSegments.mcx) {
                    segmentSlug = GlobalSegmentsSlug.mcx;
                  } else if (item.instrument.identifier.startsWith("FUT")) {
                    segmentSlug = GlobalSegmentsSlug.nfoFut;
                  } else {
                    segmentSlug = GlobalSegmentsSlug.nseOpt;
                  }
                  navigation.navigate(SCREENS.EditTrade, {
                    refreshList,
                    item: {
                      ...item,
                      segmentSlug: segmentSlug,
                      identifier: item.instrument.identifier,
                    },
                  });
                },
              })}
              {...(deleteButton && {
                delete: "delete",
                deleted: async () => {
                  await tradeService
                    .updateTrade(item.id, {
                      status: "canceled",
                    })
                    .then((res: any) => {
                      Toast.show({ type: "success", text1: res.data.message });
                      if (refreshList) {
                        refreshList();
                        setExpanded(null);
                      }
                    });
                },
              })}
            />
          )}
          <EDivider />
        </Fragment>
      )}
    </>
  );
};
export default RenderItem;
