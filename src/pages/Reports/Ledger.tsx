import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import config from "@config/index";
import ledgerService from "@services/ledger.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { dateFormat } from "@utils/constant";
import { formatIndianAmount, pdfFunction } from "@utils/helpers";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useQuery } from "react-query";
const LedgerUser = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [rowData, setRowData] = useState<any[]>([]);
  const [search, setSearchStr] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [filteredData, setFilteredData] = useState();
  const { data, isLoading, error, refetch } = useQuery(
    ["ledgerUser", page, pageSize, search, filteredData],
    async () => {
      return await ledgerService.getAllCashLedgers(
        page,
        pageSize,
        filteredData?.userId ?? filteredData?.masterId ?? filteredData?.adminId,
        filteredData?.startDate
          ? moment(filteredData?.startDate).format("YYYY-MM-DD")
          : undefined,
        filteredData?.endDate
          ? moment(filteredData?.endDate).format("YYYY-MM-DD")
          : undefined,
        search
      );
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
          borderBottomWidth: 1,
          borderColor: current.bcolor,
          padding: 16,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <EText type="r14" color={current.greyText}>
                {item?.debit > 0 ? "Debit" : "Credit"}{" "}
              </EText>
              <EText type="s14">
                {item?.debit > 0
                  ? formatIndianAmount(item?.debit)
                  : formatIndianAmount(item?.credit)}
              </EText>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <EText type="b16">{formatIndianAmount(item?.balance)}</EText>
          </View>
        </View>

        <View
          style={{
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 1 }}>
            <EText type="m14">
              {moment(item?.createdAt).format(dateFormat)}
            </EText>
            {item?.description && (
              <EText type="m14" color={current.greyDark}>
                {item?.description}
              </EText>
            )}
          </View>
          <View style={{ alignItems: "flex-end" }}>
            {item?.valanId && (
              <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={() => {
                  pdfFunction(
                    `${config.baseUrl}/valans/${item.valanId}`,
                    item.description,
                    props.navigation,
                    `${item.user.user_id}_${moment(
                      item.valan.startDate,
                      "YYYY-MM-DD"
                    ).format("DD-MMM")}_${moment(
                      item.valan.endDate,
                      "YYYY-MM-DD"
                    ).format("DD-MMM")}_ledger`
                  );
                }}
              >
                <MaterialIcons
                  name={"picture-as-pdf"}
                  color={current?.primary}
                  size={30}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const filterControls = useMemo(() => {
    return [
      {
        label: "Valan",
        name: "valanId",
        type: "select",
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
      {
        label: "Admin",
        name: "adminId",
        type: "select",
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
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: false,
          broker: false,
        },
      },
      {
        label: "START DATE :",
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
        label: "END DATE :",
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
    ];
  }, []);

  return (
    <>
      <EListLayout
        config={filterControls}
        defaultValue={filteredData}
        handleChangeFilter={setFilteredData}
        setPage={setPage}
        onSearch={setSearchStr}
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
            ListFooterComponentStyle={
              fetchMoreLoading ? { alignItems: "center", padding: 10 } : null
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
export default LedgerUser;
