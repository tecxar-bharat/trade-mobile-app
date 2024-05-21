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
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View
} from "react-native";
import { useQuery } from "react-query";
const UserLogsList = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [rowData, setRowData] = useState<any[]>([]);
  const [search, setSearchStr] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<any>({});
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const pageSize = 10;
  const { data, isLoading, error, refetch } = useQuery(
    ["UserLogsList", page, pageSize, filteredData],
    async () => {
      return await tradeService.getUserLogs(
        filteredData?.userId ?? filteredData?.masterId ?? filteredData?.adminId,
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
  const renderItem = ({ item }: any) => {
    return (
      <View
        style={{
          backgroundColor: current.backgroundColor,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          alignItems: "center",
          borderBottomWidth: 1,
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
          <View style={{ flex: 1 }}>
            {["superadmin"].includes(userData?.role?.slug) && (
              <>
                <View style={{ flexDirection: "row", padding: 3 }}>
                  <EText type="m14" color={current.greyText}>
                    {"ADMIN:"}
                  </EText>
                  <EText type="m14" style={{ color: current.textColor }}>
                    {item?.adminName ? item?.adminName : "-"}
                  </EText>
                </View>
                <View style={{ flexDirection: "row", padding: 3 }}>
                  <EText type="m14" color={current.greyText}>
                    {"MASTER:"}
                  </EText>
                  <EText type="m14" style={{ color: current.textColor }}>
                    {item?.masterName ? item?.masterName : "-"}
                  </EText>
                </View>
              </>
            )}
            {["admin"].includes(userData?.role?.slug) && (
              <>
                <View style={{ flexDirection: "row", padding: 3 }}>
                  <EText type="m14" color={current.greyText}>
                    {"MASTER:"}
                  </EText>
                  <EText type="m14" style={{ color: current.textColor }}>
                    {item?.masterName ? item?.masterName : "-"}
                  </EText>
                </View>
              </>
            )}
            <View style={{ flexDirection: "row", padding: 3 }}>
              <EText type="m14" color={current.greyText}>
                {"CLIENT:"}
              </EText>
              <EText type="m14" style={{ color: current.textColor }}>
                {item?.user?.name}
              </EText>
            </View>

            <EText
              type="r14"
              style={{ color: current.greyText, paddingLeft: 3 }}
            >
              {item?.message}
            </EText>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <EText type="m12" color={current?.textColor}>
              {moment(item?.createdAt).format(dateFormat)}
            </EText>
            <EText
              type="m12"
              style={{ textTransform: "capitalize" }}
              color={current?.textColor}
            >
              {item?.action}
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
          user: true,
          broker: true,
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
          user: true,
          broker: true,
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
          user: true,
          broker: true,
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
      <EHeader title="User Logs" />
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
export default UserLogsList;