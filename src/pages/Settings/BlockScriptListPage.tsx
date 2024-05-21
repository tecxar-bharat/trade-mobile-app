// Library Imports
import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import { themeSelector } from "@reducers/theme.reducer";
import commonService from "@services/common.service";
import { useAppSelector } from "@store/index";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { FlatList, RefreshControl, View } from "react-native";
import { useQuery } from "react-query";
const BlockScriptListPage = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const [rowData, setRowData] = useState<any[]>([]);
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, error, refetch } = useQuery(
    ["BlockScriptListPage", page, pageSize],
    async () => {
      return await commonService.getBlockScriptsofUsers(page, pageSize);
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
          backgroundColor: current.cardBackround,
          padding: 10,
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          borderColor: current.bcolor,
        }}
      >
        <EText type="m14" color={current.textColor}>
          {item.script.name}
        </EText>
        {/* {["superadmin", "admin", "master"].includes(userData?.role?.slug) && (
          <TouchableOpacity
            onPress={() => {
              setDeleteModal(true), setDeleteItem(item);
            }}
          >
            <AntDesign name="delete" size={18} color={current.red} />
          </TouchableOpacity>
        )} */}
      </View>
    );
  };
  return (
    <EListLayout onSearch={setSearch}>
      {loading ? (
        <ELoader loading={true} size="medium" mode={"fullscreen"} />
      ) : (
        <FlatList
          renderItem={renderItem}
          data={
            search
              ? rowData.filter((e) =>
                  e?.script?.name.toLowerCase().includes(search.toLowerCase())
                )
              : rowData
          }
          keyExtractor={(item, index) => `${item.id}_${index}`}
          ListEmptyComponent={ListEmptyComponent}
          onEndReached={fetchMoreData}
          onEndReachedThreshold={0.1}
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

export default BlockScriptListPage;
