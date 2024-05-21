import { BuySellChip } from "@commonComponents/BuySellChip";
import EHeader from "@commonComponents/EHeader";
import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import ValueLabelComponent from "@commonComponents/ValueLabelComponent";
import tradeService from "@services/trade.service";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { dateFormat } from "@utils/constant";
import { getSymbolNameFromIdentifier } from "@utils/helpers";
import moment from "moment";
import React from "react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { useQuery } from "react-query";
const RejectedLogs = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [rowData, setRowData] = useState<any[]>([]);
  const [search, setSearchStr] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const [filteredData, setFilteredData] = useState();
  const [page, setPage] = useState(1);
  const size = 10;
  const { data, isLoading, error, refetch } = useQuery(
    ["rejectedLogs", page, size, filteredData, search],
    async () => {
      return await tradeService.getRejected({
        page: page,
        size: size,
        userId:
          filteredData?.userId ??
          filteredData?.masterId ??
          filteredData?.adminId,
        startDate: filteredData?.startDate
          ? moment(filteredData?.startDate).format("YYYY-MM-DD")
          : undefined,
        endDate: filteredData?.endDate
          ? moment(filteredData?.endDate).format("YYYY-MM-DD")
          : undefined,
        segmentId: filteredData?.segmentId,
        scriptId: filteredData?.scriptId,
        search: search,
      });
    }
  );

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
    setPage(1);
    await refetch();
  };
  const fetchMoreData = () => {
    if (!isLoading && !error && data?.data?.data?.count > page * size) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const [expandedId, setExpandedId] = useState<any>({});
  const onView = (item: any) => {
    if (expandedId && expandedId.id === item.id) {
      setExpandedId(null);
    } else {
      setExpandedId(item);
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <Fragment>
        <TouchableOpacity
          style={{
            backgroundColor: current.backgroundColor,
            padding: 16,
            borderBottomWidth: 1,
            justifyContent: "space-between",
            borderColor: current.bcolor,
            gap: 5,
          }}
          onPress={() => onView(item)}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <EText type="m16" color={current.textColor}>
              {getSymbolNameFromIdentifier(item?.instrument.identifier)}
            </EText>
            <BuySellChip position={item?.position} />
          </View>
          <EText type="r12" color={current.greyText}>
            {item.comment}
          </EText>
        </TouchableOpacity>
        {expandedId?.id === item.id && (
          <View
            style={{
              backgroundColor: current.backgroundColor,
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              borderColor:
                current.value === "dark"
                  ? current.backgroundColor
                  : current.bcolor,
            }}
          >
            <ValueLabelComponent
              fields={[
                {
                  label: "Admin",
                  value: item.adminName,
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
                  value: item.masterName,
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
                  value: item.user.user_id
                    ? `${item.user.name} ( ${item.user.user_id} )`
                    : "-",
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: false,
                    broker: true,
                  },
                },

                {
                  label: "Type",
                  value: item.type,
                },
                { label: "Lot", value: item.lot },
                { label: "Qty", value: item.qty },
                { label: "Price", value: item.price, withComma: true },
                { label: "Total", value: item.total, withComma: true },
                {
                  label: "Position",
                  value: item.position,
                },
                { label: "Status", value: item.status },

                {
                  label: "Ip Address",
                  value:
                    item.ipAddress && item.ipAddress !== "System"
                      ? item.ipAddress
                      : "-",
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: true,
                    broker: true,
                  },
                },
                {
                  label: "Order Time",
                  value: moment(item.createdAt).format(dateFormat),
                },
                {
                  label: "Created By",
                  value: item.role && item.role !== "System" ? item.role : "-",
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: false,
                    broker: false,
                  },
                },
              ]}
            />
          </View>
        )}
      </Fragment>
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
        label: "Search",
        name: "q",
        type: "search",
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
  const userData = useAppSelector((state) => authSelector(state, "userData"));

  return (
    <>
      {["superadmin", "admin", "master"].includes(userData?.role?.slug) && (
        <EHeader title="Rejected Logs" />
      )}
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
            renderItem={renderItem}
            data={rowData}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            onEndReached={fetchMoreData}
            onEndReachedThreshold={0.1}
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }
            ListFooterComponent={
              <RenderFooter isFetchingMore={fetchMoreLoading} />
            }
          />
        )}
      </EListLayout>
    </>
  );
};
export default RejectedLogs;
