import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import RenderItemBroker from "@pages/Dashboard/RenderItemBroker";
import ledgerService from "@services/ledger.service";
import tradeService from "@services/trade.service";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { formatIndianAmount } from "@utils/helpers";
import moment from "moment";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { FlatList, RefreshControl } from "react-native";
import { useQuery } from "react-query";
const BrokerageReportBroker = () => {
  const [search, setSearchStr] = useState("");
  const [rowData, setRowData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any>({});
  const [totalBrokerage, setTotalBrokerage] = useState(0);
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [loading, setLoading] = useState(true);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<any>({});
  const size = 10;
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const { data, isLoading, error, refetch } = useQuery(
    ["brokerageReport", page, size, filteredData, search],
    async () => {
      return await tradeService.getTradeList({
        page: page,
        size: size,
        segmentId: filteredData?.segmentId,
        scriptId: filteredData?.scriptId,
        userId:
          filteredData?.userId ??
          filteredData?.brokerId ??
          filteredData?.masterId ??
          filteredData?.adminId,
        tradeType: filteredData?.searchByTradeStatus,
        startDate: filteredData?.startDate
          ? moment(filteredData?.startDate).format("YYYY-MM-DD")
          : undefined,
        days: "old",
        tradePositionSubType: filteredData?.tradePositionSubType,
        endDate: filteredData?.endDate
          ? moment(filteredData?.endDate).format("YYYY-MM-DD")
          : undefined,
        search: search,
      });
    }
  );
  useEffect(() => {
    ledgerService.getBrokerBrokerage().then((res: any) => {
      setTotalBrokerage(res?.data?.totalBrokerBrokerage);
    });
  }, [rowData]);

  const onRefresh = () => {
    setPage(1);
    refetch();
  };

  React.useEffect(() => {
    if (!isLoading && !error && data?.data?.data?.rows) {
      if (page === 1) {
        setRowData(data.data.data.rows);
      } else {
        setRowData((prevData) => [...prevData, ...data.data.data.rows]);
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

  const renderItem = ({ item }: any) => {
    return (
      <RenderItemBroker
        item={item}
        setExpanded={setExpanded}
        expanded={expanded}
      />
    );
  };

  const filterControls = useMemo(() => {
    return [
      {
        label: "Start Date",
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
      {
        label: "End Date",
        name: "endDate",
        maximumDate: new Date(),
        type: "date",
        textTransform: "uppercase",
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
      {
        label: "Select Market",
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
        label: "Select Script",
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
      {
        label: "Select Broker",
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
      {
        label: "Select Admin",
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
        label: "Select Master",
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
        label: "Select Client",
        name: "userId",
        type: "select",
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: false,
          broker: true,
        },
      },
    ];
  }, []);

  return (
    <>
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
            data={rowData}
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

        {userData?.role.slug === "broker" && (
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
              {"TOTAL BROKERAGE"}
            </EText>
            <EText type="b16" color={current.textColor}>
              {formatIndianAmount(totalBrokerage)}
            </EText>
          </View>
        )}
      </EListLayout>
    </>
  );
};
export default BrokerageReportBroker;
