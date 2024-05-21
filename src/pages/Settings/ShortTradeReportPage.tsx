import EListLayout from "@commonComponents/EListLayout";
import EText from "@commonComponents/EText";
import ValueLabelComponent from "@commonComponents/ValueLabelComponent";
import tradeService from "@services/trade.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { dateFormat } from "@utils/constant";
import { getSymbolNameFromIdentifier } from "@utils/helpers";
import moment from "moment";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View
} from "react-native";
import { useQuery } from "react-query";
const ShortTradeReport = () => {
  const [expanded, setExpanded] = useState(-1);
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [filteredData, setFilteredData] = useState({
    tradeDate: new Date(),
    tradeMinute: '5'
  });

  const { data, isLoading, refetch } = useQuery(
    ["shortTradeReport", filteredData],
    async () => {
      return await tradeService.getShortTradeReport(
        filteredData?.tradeDate ? moment(filteredData?.tradeDate).format("YYYY-MM-DD") : '',
        filteredData?.tradeMinute,
        filteredData?.scriptId,
        filteredData?.userId ?? filteredData?.brokerId ?? filteredData?.masterId ?? filteredData?.adminId,
      );
    }
  );

  const renderItem = ({ item, index }: any) => {
    return (
      <TouchableOpacity
        style={{
          paddingHorizontal: 10,
          marginBottom: 5,
          backgroundColor: current.cardBackround,
          padding: 8,
          borderBottomWidth: 1,
          borderColor:
            current.value === "dark"
              ? current.cardBackround
              : current.grayScale3,
        }}
        onPress={() => setExpanded((prev) => prev === index ? -1 : index)}
      >
        <View style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <EText type="r12">Client: </EText>

            <EText type="b12">
              {item.userId}
            </EText>

          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: 'flex-end'
            }}
          >
            <EText type="r12">First Trade Type: </EText>
            <EText type="b12" style={{ textTransform: 'uppercase' }}>
              {item.firstOrder}
            </EText>
          </View>
        </View>
        <View style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <EText type="r12">Symbol</EText>
            <EText type="b12">
              {getSymbolNameFromIdentifier(item.symbol)}
            </EText>
          </View>
        </View>

        {expanded === index ?

          <View style={{ marginTop: 8 }}>
            <ValueLabelComponent fields={[
              {
                label: 'Admin',
                value: item.adminName,
                access: {
                  superadmin: true,
                  admin: false,
                  master: false,
                  user: false,
                  broker: false,
                }
              },
              {
                label: 'Master',
                value: item.masterName,
                access: {
                  superadmin: true,
                  admin: true,
                  master: false,
                  user: false,
                  broker: false,
                }
              },
              {
                label: 'Sell Price',
                value: item.sellPrice,
                withComma: true,
              },
              {
                label: 'Sell Time',
                value: moment(item.sellExecutedAt, 'DD-MM-YYYY hh:mm:ss').format(dateFormat),
              },
              {
                label: 'Buy Price',
                value: item.buyPrice,
                withComma: true,
              },
              {
                label: 'Buy Qty',
                value: item.buyQty,
              },
              {
                label: 'Buy Time',
                value: moment(item.buyExecutedAt, 'DD-MM-YYYY hh:mm:ss').format(dateFormat),
              }
            ]} />
          </View>

          : null}



      </TouchableOpacity>
    );
  };

  const filterControls = useMemo(() => {
    return [
      {
        label: 'Admin',
        name: 'adminId',
        type: 'select',
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: false,
          user: false,
          broker: false,
        },
      },
      {
        label: 'Master',
        name: 'masterId',
        type: 'select',
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: false,
          user: false,
          broker: false,
        },
      },
      {
        label: 'Client',
        name: 'userId',
        type: 'select',
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: false,
          broker: false,
        },
      },
      {
        label: 'Segment',
        name: 'segmentId',
        type: 'select',
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
      {
        label: 'Script',
        name: 'scriptId',
        type: 'select',
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
      {
        label: 'Trade minute',
        name: 'tradeMinute',
        type: 'text',
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
      {
        label: 'DATE',
        name: 'tradeDate',
        type: 'date',
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
    ];
  }, []);

  return (
    <EListLayout config={filterControls} handleChangeFilter={setFilteredData}>
      <FlatList
        renderItem={renderItem}
        data={data?.data?.data}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        refreshControl={
          <RefreshControl
            tintColor={"#4885ED"}
            refreshing={isLoading}
            onRefresh={() => {
              refetch();
            }}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EText type="m16">No Data Found</EText>
          </View>
        }
      />
    </EListLayout>
  );
};
export default ShortTradeReport;