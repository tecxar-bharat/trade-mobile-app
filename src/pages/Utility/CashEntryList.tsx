import images from "@assets/images";
import EHeader from "@commonComponents/EHeader";
import ESearchInput from "@commonComponents/ESearchInput";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import ledgerService from "@services/ledger.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { dateFormat } from "@utils/constant";
import { formatIndianAmount } from "@utils/helpers";
import moment from "moment";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useQuery } from "react-query";
const CashEntryList = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [rowData, setRowData] = useState<any[]>([]);
  const [search, setSearchStr] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, error, refetch } = useQuery(
    ["cashEntry", page, pageSize],
    async () => {
      return await ledgerService.getCashEntryList(page, pageSize);
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

  const renderItem = ({ item }: any) => {
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
            current.value === "dark" ? current.bcolor : current.bcolor,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 1,
          }}
        >
          <View style={{ width: 100 }}>
            <EText type="m16" style={{ color: current.textColor }}>
              {item?.user?.user_id}
            </EText>
            <EText type="r14" style={{ color: current.greyText }}>
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
            <EText type="r14" style={{ color: current.textColor }}>
              {item.caseType}
            </EText>
          </View>
          <View
            style={{
              width: 110,
              alignItems: "flex-end",
              justifyContent: "space-around",
            }}
          >
            <EText
              type="r14"
              style={{ color: item.credit > 0 ? current.green : current.red }}
            >
              {item.credit > 0
                ? formatIndianAmount(item?.credit)
                : formatIndianAmount(`-${item?.debit}`)}
            </EText>
            <EText type="r12" color={current.textColor}>
              {item?.description}
            </EText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor }}>
      <EHeader
        title="Cash Entry List"
      />
      <View style={localStyles.SearchAndFilterContainer}>
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
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
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <FlatList
          renderItem={renderItem}
          data={
            search
              ? rowData.filter((e) =>
                e?.user?.user_id.toLowerCase().includes(search.toLowerCase())
              )
              : rowData
          }
          keyExtractor={(item, index) => `${item.id}_${index}`}
          onEndReached={fetchMoreData}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            <RenderFooter isFetchingMore={isFetchingMore.current} />
          }
        />
      </View>
    </View>
  );
};
export default CashEntryList;

const localStyles = StyleSheet.create({
  SearchBarContainer: {
    borderRadius: 9,
  },
  SearchAndFilterContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
});
