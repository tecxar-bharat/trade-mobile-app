// Library Imports
import ESafeAreaView from "@commonComponents/ESafeAreaView";
import EText from "@commonComponents/EText";
import { useAppDispatch, useAppSelector } from "@store/index";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import ValueLabelComponent from "@commonComponents/ValueLabelComponent";
import { LoggedUser } from "@db/schemas/loggedUser.model";
import {
  flushState,
  ledgerSelector,
  setValanId,
} from "@reducers/ledgerReducer";
import { themeSelector } from "@reducers/theme.reducer";
import { getBrokerNameList } from "@reducers/userReducer";
import ledgerService from "@services/ledger.service";
import { getLastNineWeeksDates } from "@utils/constant";
import { formatIndianAmount, toFixed } from "@utils/helpers";
import { useQuery } from "react-query";
const BrokerBill = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [filteredData, setFilteredData] = useState<any>({});

  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [rowData, setRowData] = useState<any[]>([]);
  const userData = LoggedUser.getActiveUser(globalThis.realm);
  const userSlug = userData?.role?.slug;
  const startDate = useAppSelector((state) =>
    ledgerSelector(state, "startDate")
  );
  const endDate = useAppSelector((state) => ledgerSelector(state, "endDate"));

  const dispatch = useAppDispatch();
  const [valanOptions, setValanOptions] = useState<any>([]);
  useEffect(() => {
    setValanOptions(getLastNineWeeksDates());
    dispatch(getBrokerNameList({}));
    return () => {
      dispatch(flushState());
    };
  }, []);

  useEffect(() => {
    if (valanOptions && valanOptions.length > 0) {
      dispatch(setValanId(valanOptions[valanOptions.length - 2]));
    }
  }, [valanOptions]);

  const renderItem = ({ item }: any) => {
    if (userSlug === "broker") {
      return (
        <View
          style={{
            marginVertical: 4,
            borderRadius: 6,
            elevation: 5,
            backgroundColor: current.cardBackround,
            padding: 5,
            borderWidth: 1,
            borderColor:
              current.value === "dark"
                ? current.cardBackround
                : current.grayScale3,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1 }}>
              <EText type="r14" color={current.textColor}>{`Client: `}</EText>
              <EText type="r14" color={current.textColor}>{`Segment: `}</EText>
              <EText
                type="r14"
                color={current.textColor}
              >{`Brokerage: `}</EText>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
              }}
            >
              <EText type="r14" color={current.textColor}>
                {item.userName}
              </EText>
              <EText type="r14" color={current.textColor}>
                {item.segmentName}
              </EText>
              <EText type="r14" color={current.textColor}>
                {item.brokerBrokerage}
              </EText>
            </View>
          </View>
          {/* <ValueLabelComponent
            fields={[
              { label: "Client", value: item.userName },
              { label: "Segment", value: item.segmentName },
              {
                label: "Brokerage",
                value: item.brokerBrokerage,
                withComma: true,
              },
            ]}
          /> */}
        </View>
      );
    }
    return (
      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 2,
          borderRadius: 10,
          elevation: 5,
          backgroundColor: current.cardBackround,
          padding: 5,
          borderWidth: 1,
          borderColor:
            current.value === "dark"
              ? current.cardBackround
              : current.grayScale3,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <EText type="r12">{`Admin: `}</EText>
              <EText type="s12">{item.adminName}</EText>
            </View>

            <View style={{ flexDirection: "row" }}>
              <EText type="r12">{`Master: `}</EText>
              <EText type="s12">{item.masterName}</EText>
            </View>

            <View style={{ flexDirection: "row" }}>
              <EText type="r12">{`Client: `}</EText>
              <EText type="s12">{item.userName}</EText>
            </View>
          </View>

          <View style={{ width: 100 }}>
            <EText type="b14" style={{ textAlign: "center" }}>
              {item.segmentName}
            </EText>
          </View>

          <View style={{ alignItems: "flex-end", flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <EText type="r12">{`Total: `}</EText>
              <EText type="s12">
                {formatIndianAmount(item?.brokerage ?? 0)}
              </EText>
            </View>

            <View style={{ flexDirection: "row" }}>
              <EText type="r12">{`Master: `}</EText>
              <EText type="s12">
                {formatIndianAmount(item?.masterBrokerage ?? 0)}(
                {toFixed(item.brokeragePercentage ?? 0)})
              </EText>
            </View>

            <View style={{ flexDirection: "row" }}>
              <EText type="r12">{`Broker: `}</EText>
              <EText type="s12">
                {formatIndianAmount(item?.brokerBrokerage ?? 0)} (
                {toFixed(item.brokerBrokeragePercentage ?? 0)})
              </EText>
            </View>

            <View style={{ flexDirection: "row" }}>
              <EText type="r12">{`Broker2: `}</EText>
              <EText type="s12">
                {formatIndianAmount(item?.broker1Brokerage ?? 0)} (
                {toFixed(item.brokerBrokeragePercentage1 ?? 0)})
              </EText>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const filterControls = useMemo(() => {
    return [
      {
        label: "Valan",
        name: "valanId",
        type: "select",
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
        label: "Broker",
        name: "brokerId",
        type: "select",
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: false,
          broker: false,
        },
      },
    ];
  }, []);
  const { error, refetch, data, isLoading } = useQuery(
    ["brokerBills", endDate, startDate, filteredData],
    async () => {
      return await ledgerService.getAllBrokerBillOfUsers(startDate, endDate);
    }
  );
  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  };
  useEffect(() => {
    if (!isLoading && !error && data?.data?.data?.rows) {
      if (page === 1) {
        setRowData(data.data.data.rows);
      } else {
        setRowData((prevData) => [...prevData, ...data.data.data.rows]);
      }
    }
  }, [data, isLoading, error, page]);

  return (
    <ESafeAreaView>
      <View
        style={{
          flex: 1,
          backgroundColor: current.backgroundColor1,
        }}
      >
        <View
          style={{
            flex: 1,
            paddingTop: 10,
            marginTop: 10,
            backgroundColor: current.backgroundColor,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
            }}
          >
            {/* <View style={{ flex: 1 }}>
              <EInput
                placeHolder={"Search"}
                keyBoardType={"default"}
                placeholderStyle={{ color: current.red, top: 0 }}
                value={search}
                height={30}
                onChangeText={(text: string) => setSearchStr(text)}
                filterData={() => setShow(!show)}
                rightAccessory={() => (
                  <ListFilter
                    title="Filter By"
                    handleChangeFilter={setFilteredData}
                    config={filterControls}
                    defaultValue={filteredData}
                  />
                )}
                insideLeftIcon={() => (
                  <Ionicons
                    name="search"
                    size={moderateScale(20)}
                    color={current.greyDark}
                  />
                )}
                inputContainerStyle={[
                  {
                    backgroundColor: current.backgroundColor,
                    borderColor:
                      current.value === "light"
                        ? current.bcolor
                        : current.bcolor,
                    borderWidth: 1,
                    elevation: 10,
                    marginTop: -30,
                  },
                ]}
              />
            </View> */}
          </View>
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <FlatList
              data={rowData}
              contentContainerStyle={{ paddingBottom: 80 }}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              ListEmptyComponent={ListEmptyComponent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        </View>
      </View>
      {/* <MasterUserModal
        visible={show}
        onDismiss={() => setShow(false)}
        title={"Filter Data"}
        type={"Broker Bill"}
        onFilter={(filterData: any) => onCallFilter(filterData)}
      /> */}
    </ESafeAreaView>
  );
};

export default BrokerBill;
const localStyles = StyleSheet.create({
  SearchBarContainer: {
    elevation: 5,
    borderRadius: 9,
  },
  SearchAndFilterContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
});
