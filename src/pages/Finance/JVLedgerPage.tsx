import images from "@assets/images";
import EHeader from "@commonComponents/EHeader";
import EText from "@commonComponents/EText";
import JvLedgerFilterModal from "@components/models/JvLedgerFilterModal";
import { useAppSelector } from "@store/index";
import moment from "moment";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

import ESearchInput from "@commonComponents/ESearchInput";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import { INavigation } from "@interfaces/common";
import { themeSelector } from "@reducers/theme.reducer";
import ledgerService from "@services/ledger.service";
import { formatIndianAmount } from "@utils/helpers";
import { useQuery } from "react-query";
import { dateFormat } from "@utils/constant";
interface IPositionReport {
  item: any;
}
const JVLedger = ({ navigation }: INavigation) => {
  const [show, setShow] = useState(false);
  const [filteredData, setFilteredData] = useState();
  const [search, setSearchStr] = useState("");
  const onCallFilter = async (filterData: any) => {
    setFilteredData(filterData);
  };
  const [rowData, setRowData] = useState<any[]>([]);
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, error, refetch } = useQuery(
    ["jvLedger", page, pageSize],
    async () => {
      return await ledgerService.getCashJVEntryList(page, pageSize);
    }
  );
  React.useEffect(() => {
    if (!isLoading && !error && data?.data?.data?.rows) {
      if (page === 1) {
        setRowData(data.data.data.rows);
      } else {
        setRowData((prevData) => [...prevData, ...data.data.data.rows]);
      }
    }
  }, [data, isLoading, error, page]);
  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  };
  const isFetchingMore = useRef(false);
  const fetchMoreData = () => {
    if (!isLoading && !error && data?.data?.data?.count > page * pageSize) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const renderItem = ({ item }: IPositionReport) => {
    return (
      <View
        style={{
          marginVertical: 2,
          borderRadius: 10,
          elevation: 5,
          backgroundColor: current.backgroundColor,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          alignItems: "center",
          borderWidth: 1,
          borderColor:
            current.value === "dark"
              ? current.backgroundColor
              : current.grayScale3,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 1,
          }}
        >
          <View style={{ width: 100 }}>
            <EText type="m16">{item?.user?.user_id}</EText>
            <EText type="r14" style={{ color: current.greyDark }}>
              {moment(item?.createdAt).format(dateFormat)}
            </EText>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <EText
              type="b16"
              color={item?.balance >= 0 ? current?.green : current?.red}
            >
              {formatIndianAmount(item?.balance)}
            </EText>
            <EText
              type="r14"
              style={{ color: item.credit > 0 ? current.green : current.red }}
            >
              {item.credit > 0
                ? formatIndianAmount(item?.credit)
                : formatIndianAmount(`-${item?.debit}`)}
            </EText>
          </View>
          <View
            style={{
              width: 110,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <EText type="s16">{formatIndianAmount(item?.description)}</EText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: current.backgroundColor,
        marginTop: 30,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
        }}
      >
        <View style={localStyles.SearchAndFilterContainer}>
          <View style={{ flex: 1, marginTop: -30 }}>
            <ESearchInput
              placeholder="Search"
              value={search}
              onChangeText={(text) => setSearchStr(text)}
            />
          </View>
          {/* <View>
            <TouchableOpacity
              style={{
                backgroundColor: current.primary,
                marginLeft: 5,
                borderRadius: 9,
                padding: 5,
              }}
              onPress={() => setShow(!show)}
            >
              <Ionicons
                name="options-outline"
                color={current.white}
                size={moderateScale(21)}
              />
            </TouchableOpacity>
          </View> */}
        </View>
        <FlatList
          data={
            search
              ? rowData.filter((e) =>
                e?.user?.user_id.toLowerCase().includes(search.toLowerCase())
              )
              : rowData
          }
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          ListEmptyComponent={ListEmptyComponent}
          onEndReached={fetchMoreData}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            <RenderFooter isFetchingMore={isFetchingMore.current} />
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <JvLedgerFilterModal
        visible={show}
        onDismiss={() => setShow(false)}
        title={"Filter Data"}
        onFilter={(filterData: any) => onCallFilter(filterData)}
      />
    </View>
  );
};

export default JVLedger;
const localStyles = StyleSheet.create({
  SearchBarContainer: {
    borderRadius: 9,
  },
  SearchAndFilterContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
});
