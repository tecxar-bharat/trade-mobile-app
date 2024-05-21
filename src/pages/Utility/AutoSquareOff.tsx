import images from "@assets/images";
import EHeader from "@commonComponents/EHeader";
import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import ESearchInput from "@commonComponents/ESearchInput";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import tradeService from "@services/trade.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { dateFormat } from "@utils/constant";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useQuery } from "react-query";
const AutoSquareOff = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [search, setSearchStr] = useState("");
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [filteredData, setFilteredData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, error, refetch } = useQuery(
    ["autoSquareOff", page, pageSize, filteredData, search],
    async () => {
      return await tradeService.getAutosquareOffLogs(
        page,
        pageSize,
        filteredData?.startDate
      );
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
  const onRefresh = () => {
    setPage(1);
    refetch();
  };
  const fetchMoreData = () => {
    if (!isLoading && !error && data?.data?.data?.count > page * pageSize) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  useEffect(() => {
    if (isLoading) {
      if (page > 1) {
        setFetchMoreLoading(true);
      } else {
        setLoading(true);
      }
    } else {
      setFetchMoreLoading(false);
      setLoading(false);
    }
  }, [isLoading]);
  const renderItem = ({ item }: any) => {
    return (
      <View
        style={{
          backgroundColor: current.backgroundColor,
          padding: 8,
          borderBottomWidth: 1,
          borderColor:
            current.value === "dark" ? current.bcolor : current.bcolor,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ display: "flex" }}>
            <View style={{ flexDirection: "row", padding: 3 }}>
              <EText type="m14" color={current.greyText}>
                {"ADMIN:"}
              </EText>
              <EText type="m14" color={current.textColor}>
                {item?.adminName}
              </EText>
            </View>
            <View style={{ flexDirection: "row", padding: 3 }}>
              <EText type="m14" color={current.greyText}>
                {"MASTER:"}
              </EText>
              <EText type="m14" color={current.textColor}>
                {item?.masterName}
              </EText>
            </View>
            <View style={{ flexDirection: "row", padding: 3 }}>
              <EText type="m14" color={current.greyText}>
                {"CLIENT:"}
              </EText>
              <EText type="m14" color={current.textColor}>
                {`${item?.user?.name}(${item?.user?.user_id})`}
              </EText>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <EText type="m16" color={current.textColor}>
              {item?.m2m}
            </EText>
            <EText
              type="m14"
              style={{
                marginTop: 4,
                color: current.textColor,
              }}
            >
              {moment(item?.updatedAt).format(dateFormat)}
            </EText>
          </View>
        </View>
      </View>
    );
  };
  const filterControls = useMemo(() => {
    return [
      {
        label: "Admin",
        name: "adminId",
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
        label: "Master",
        name: "masterId",
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
        label: "Client",
        name: "userId",
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
        label: "DATE",
        name: "startDate",
        type: "date",
        maximumDate: new Date(),
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
    <View style={{ flex: 1, backgroundColor: current.backgroundColor }}>
      <EHeader title="Auto Square Off" />
      <EListLayout
        config={filterControls}
        defaultValue={filteredData}
        handleChangeFilter={setFilteredData}
        onSearch={setSearchStr}
        setPage={setPage}
      >
        {loading ? (
          <ELoader loading={true} size="medium" mode={"fullscreen"} />
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              renderItem={renderItem}
              data={
                search
                  ? rowData.filter((e) =>
                    e?.user?.name.toLowerCase().includes(search.toLowerCase())
                  )
                  : rowData
              }
              keyExtractor={(item, index) => `${item.id}_${index}`}
              onEndReached={fetchMoreData}
              onEndReachedThreshold={0.1}
              ListEmptyComponent={ListEmptyComponent}
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
              }
              ListFooterComponentStyle={
                fetchMoreLoading ? { alignItems: "center", padding: 10 } : null
              }
              ListFooterComponent={
                <RenderFooter isFetchingMore={fetchMoreLoading} />
              }
            />
          </View>
        )}
      </EListLayout>
    </View>
  );
};
export default AutoSquareOff;

const localStyles = StyleSheet.create({
  SearchAndFilterContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
});
