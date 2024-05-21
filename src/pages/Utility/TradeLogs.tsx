import EHeader from "@commonComponents/EHeader";
import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import tradeService from "@services/trade.service";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { dateFormat } from "@utils/constant";
import moment from "moment";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useQuery } from "react-query";
const TradeLogs = () => {
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [rowData, setRowData] = useState<any[]>([]);
  const [search, setSearchStr] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<any>({});
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const role = userData?.role?.slug;
  const { data, isLoading, error, refetch } = useQuery(
    ["tradeLogs", page, pageSize, filteredData],
    async () => {
      return await tradeService.getTradeLogs({
        page: page,
        size: pageSize,
        userId:
          filteredData?.userId ??
          filteredData?.masterId ??
          filteredData?.adminId,
        startDate: filteredData?.startDate,
      });
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
  const renderItem = ({ item }: any) => {
    return (
      <View
        style={{
          backgroundColor: current.backgroundColor,
          padding: 10,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderColor:
            current.value === "dark" ? current.bcolor : current.bcolor,
        }}
      >
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <EText type="b14">
              {item?.user?.name} ({item?.user?.userId})
            </EText>
            {(role === "superadmin" || role === "admin") && (
              <View
                style={{
                  marginBottom: 8,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <EText>Master: </EText>
                <EText type="s14">{item.masterName}</EText>
              </View>
            )}
          </View>
          <View>
            <EText type="r12" color={current.greyText}>
              {moment(item.updatedAt).format(dateFormat)}
            </EText>
            {role === "superadmin" && (
              <View
                style={{
                  marginBottom: 8,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <EText>Admin: </EText>
                <EText type="s14">{item.adminName}</EText>
              </View>
            )}
          </View>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <EText type="r12" color={current.greyDark}>
              {item.note.replace(/(\r\n|\n|\r)/gm, " ")}
            </EText>
          </View>
          <View style={{ alignItems: "flex-end", width: 120 }}>
            <EText>Updated By</EText>
            <EText type="s14">{item.role}</EText>
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
          admin: false,
          master: false,
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
          master: false,
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
          master: false,
          user: false,
          broker: false,
        },
      },
      {
        label: "Date",
        name: "startDate",
        type: "date",
        maximumDate: new Date(),
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

  return (
    <Fragment>
      <EHeader title="Trade Logs" />
      <EListLayout
        config={filterControls}
        defaultValue={filteredData}
        handleChangeFilter={setFilteredData}
        setPage={setPage}
      >
        {loading ? (
          <ELoader loading={true} size="medium" mode={"fullscreen"} />
        ) : (
          <FlatList
            data={
              search
                ? rowData.filter((e) =>
                    e?.user?.name.toLowerCase().includes(search.toLowerCase())
                  )
                : rowData
            }
            renderItem={renderItem}
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
        )}
      </EListLayout>
    </Fragment>
  );
};
export default TradeLogs;
