import { BuySellChip } from "@commonComponents/BuySellChip";
import EDivider from "@commonComponents/EDivider";
import EText from "@commonComponents/EText";
import ValueLabelComponent from "@commonComponents/ValueLabelComponent";
import { useAppSelector } from "@store/index";
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
const RenderItemBroker = ({
  item,
  setExpanded,
  expanded,
}: {
  item: any;
  setExpanded: any;
  expanded: any;
}) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));

  const onView = (item: any) => {
    if (expanded && expanded.id === item.id) {
      setExpanded(null);
    } else {
      setExpanded(item);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={{
          borderRadius: 6,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: current.backgroundColor,
          padding: 8,
          flex: 1,
          borderBottomWidth: 1,
          borderColor:
            current.value === "dark" ? current.bcolor : current.bcolor,
        }}
        // disabled={!type}
        onPress={() => onView(item)}
      >
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
      </TouchableOpacity>
      {expanded?.id === item?.id && (
        <Fragment>
          <View
            style={{
              backgroundColor: current.backgroundColor,
              padding: 10,
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
                    ? `${item.user.name} ( ${item.user.user_id} )`
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
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: false,
                    broker: false,
                  },
                },
                {
                  label: "Trade",
                  value:
                    item.deliveryType === "intraDay" ? "Intraday" : "Delivery",
                },
                { label: "Lot", value: item.lot },
                { label: "Qty", value: item.qty },
                { label: "Price", value: item.price, withComma: true },
                {
                  label: "Broker Brokerage",
                  value: item.brokerBrokerage,
                  withComma: true,
                  access: {
                    superadmin: true,
                    admin: false,
                    master: false,
                    user: false,
                    broker: true,
                  },
                },

                {
                  label: "Position",
                  value: item.position === "sell" ? "Sell" : "Buy",
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: false,
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
                    user: false,
                    broker: false,
                  },
                },
                {
                  label: "Total",
                  value: item.total,
                  withComma: true,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: false,
                    broker: false,
                  },
                },
                {
                  label: "Total Brokerage",
                  value: item.brokerage,
                  withComma: true,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: false,
                    broker: false,
                  },
                },
                {
                  label: "Net Total",
                  value: item.netTotal,
                  withComma: true,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: false,
                    broker: false,
                  },
                },
                {
                  label: "Executed",
                  value: moment(item.executedAt).format(dateFormat),
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: false,
                    broker: false,
                  },
                },
                {
                  label: "Status",
                  value: item.status,
                  isStatus: true,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: false,
                    broker: false,
                  },
                },
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
          <EDivider />
        </Fragment>
      )}
    </>
  );
};
export default RenderItemBroker;
