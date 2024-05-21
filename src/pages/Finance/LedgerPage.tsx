import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import { INavigation } from "@interfaces/common";
import { SCREENS } from "@navigation/NavigationKeys";
import { themeSelector } from "@reducers/theme.reducer";
import ledgerService from "@services/ledger.service";
import { useAppSelector } from "@store/index";
import { formatIndianAmount } from "@utils/helpers";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { useQuery } from "react-query";
interface IPositionReport {
  item: any;
}
const LedgerTab = ({ navigation }: INavigation) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [rowData, setRowData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const size = 10;

  const { data, isLoading, error, refetch } = useQuery(
    ["ledgerPage", search],
    async () => {
      return await ledgerService.getAllUsersLedgers(
        undefined,
        page,
        size,
        search
      );
    }
  );
  const onRefresh = async () => {
    setPage(1);
    await refetch();
  };

  React.useEffect(() => {
    if (!isLoading && !error && data?.data?.data) {
      const balance = data?.data?.data.reduce(
        (accumulator, currentValue) => accumulator + currentValue.balance,
        0
      );

      setTotalBalance(balance);

      if (page === 1) {
        setRowData(data.data.data);
      } else {
        setRowData((prevData) => [...prevData, ...data.data.data]);
      }
    }
  }, [data, isLoading, error, page]);

  const fetchMoreData = () => {
    if (!isLoading && !error && data?.data?.data?.count > page * size) {
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

  const renderItem = ({ item }: IPositionReport) => {
    return (
      <TouchableOpacity
        style={{
          marginVertical: 2,
          borderRadius: 6,
          backgroundColor: current.cardBackround,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          borderBottomWidth: 1,
          borderColor:
            current.value === "dark"
              ? current.cardBackround
              : current.grayScale3,
        }}
        onPress={() =>
          navigation.navigate(SCREENS.LedgerBroker, {
            id: item?.user?.id,
            name: item?.user?.name,
            userId: item?.user?.user_id,
          })
        }
      >
        <View style={{ flex: 1 }}>
          <View>
            <EText
              type="s14"
              color={current.textColor}
            >{`${item?.user?.name}`}</EText>
            <EText
              type="r14"
              color={current.greyText}
            >{`(${item?.user?.user_id})`}</EText>
          </View>
        </View>
        <View
          style={{
            alignItems: "flex-end",
          }}
        >
          <EText type="b14" color={current.textColor}>
            {formatIndianAmount(item?.balance)}
          </EText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <EListLayout onSearch={setSearch}>
      {loading ? (
        <ELoader loading={true} mode="fullscreen" size="medium" />
      ) : (
        <Fragment>
          <FlatList
            renderItem={renderItem}
            data={rowData}
            keyExtractor={(item, index) => `${item.id}_${index}`}
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
            ListEmptyComponent={ListEmptyComponent}
          />
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 16,
              borderWidth: 1,
              backgroundColor: current.backgroundColor1,
              borderColor: current.bcolor,
              justifyContent: "space-between",
              padding: 8,
              alignItems: "center",
            }}
          >
            <EText type="b16" color={current.greyDark}>
              {"TOTAL"}
            </EText>
            <EText type="b16" color={current.textColor}>
              {formatIndianAmount(totalBalance)}
            </EText>
          </View>
        </Fragment>
      )}
    </EListLayout>
  );
};

export default LedgerTab;
