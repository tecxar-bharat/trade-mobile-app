import EListLayout from "@commonComponents/EListLayout";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import accountService from "@services/account.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { formatIndianAmount } from "@utils/helpers";
import React, { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useQuery } from "react-query";

export interface payloadDataInfo {
  q?: string;
  page: number | undefined;
  pageSize: number | undefined;
  searchStr?: string;
}

const MtMAlerts = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [rowData, setRowData] = useState<any[]>([]);

  const { data, isLoading, error, refetch } = useQuery(
    ["mtmAlerts"],
    async () => {
      return await accountService.m2mAlertOfUsers();
    }
  );

  React.useEffect(() => {
    if (!isLoading && !error && data?.data?.data) {
      setRowData(data.data.data);
    }
  }, [data, isLoading, error, page]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => {
    return (
      <View
        style={{
          backgroundColor: current.backgroundColor,
          padding: 8,
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          borderColor:
            current.value === "dark" ? current.bcolor : current.bcolor,
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row" }}>
            <EText type="m14" color={current.greyText}>
              {"Master:"}
            </EText>
            <EText type="m14" color={current.textColor}>
              {item.masterName}
            </EText>
          </View>
          <View style={{ flexDirection: "row" }}>
            <EText type="m14" color={current.greyText}>
              {"Client:"}
            </EText>
            <EText type="m14" color={current.textColor}>
              {`${item.name} (${item.userId})`}
            </EText>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <EText type="m12" color={current.greyText}>
            {"M2M:"}
          </EText>
          <EText type="b12" color={current.textColor}>
            {formatIndianAmount(item.totalM2m)}
          </EText>
        </View>
      </View>
    );
  };

  return (
    <EListLayout onSearch={setSearch}>
      <FlatList
        data={
          search
            ? rowData.filter((e) =>
                e.name.toLowerCase().includes(search.toLowerCase())
              )
            : rowData
        }
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        refreshControl={
          <RefreshControl
            tintColor={"#4885ED"}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={ListEmptyComponent}
      />
    </EListLayout>
  );
};
export default MtMAlerts;
