import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import accountService from "@services/account.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { formatIndianAmount } from "@utils/helpers";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { FlatList, RefreshControl, View } from "react-native";
import { useQuery } from "react-query";
const MaxQtyLimitUser = (props: any) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rowData, setRowData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState({});
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const { data, isLoading, error, refetch } = useQuery(
    ["MaxQtyLimitUser", page, pageSize, filteredData, search],
    async () => {
      return await accountService.getViewQuantityScriptsofUsers(
        page,
        pageSize,
        filteredData?.segmentId,
        filteredData?.scriptId,
        search
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
      setLoading(false);
    }
  }, [data, isLoading, error, page]);

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
      >
        <View style={{ flex: 1, gap: 3 }}>
          <EText type="m14" style={{ color: current.textColor }}>
            {"Segment"}
          </EText>
          <EText type="m14" style={{ color: current.textColor }}>
            {"Script"}
          </EText>
          <EText type="m14" style={{ color: current.textColor }}>
            {"Position Limit"}
          </EText>
          <EText type="m14" style={{ color: current.textColor }}>
            {"Max Order"}
          </EText>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            gap: 3,
          }}
        >
          <EText
            type="m14"
            style={{ color: current.textColor, textTransform: "uppercase" }}
          >
            {item?.segment?.name}
          </EText>
          <EText type="m14" style={{ color: current.textColor }}>
            {item?.script?.name}
          </EText>
          <EText type="m14" style={{ color: current.textColor }}>
            {formatIndianAmount(item?.qty)}
          </EText>
          <EText type="m14" style={{ color: current.textColor }}>
            {formatIndianAmount(item?.maxQty)}
          </EText>
        </View>
      </View>
    );
  };

  const filterControls = useMemo(() => {
    return [
      {
        label: "Segment",
        name: "segmentId",
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
        label: "Script",
        name: "scriptId",
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
    ];
  }, []);

  return (
    <EListLayout
      config={filterControls}
      handleChangeFilter={setFilteredData}
      defaultValue={filteredData}
      onSearch={setSearch}
      setPage={setPage}
    >
      {loading ? (
        <ELoader loading={true} size="medium" mode={"fullscreen"} />
      ) : (
        <FlatList
          data={rowData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          onEndReached={fetchMoreData}
          onEndReachedThreshold={0.3}
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
  );
};
export default MaxQtyLimitUser;
