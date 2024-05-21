import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import ValueLabelComponent from "@commonComponents/ValueLabelComponent";
import { IFilter, INavigation } from "@interfaces/common";
import { SCREENS } from "@navigation/NavigationKeys";
import { themeSelector } from "@reducers/theme.reducer";
import accountService from "@services/account.service";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { getLastNineWeeksDates, isBlank } from "@utils/constant";
import { formatIndianAmount } from "@utils/helpers";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useQuery } from "react-query";

const SummaryReport = (props: INavigation) => {
  const [filteredData, setFilteredData] = useState<IFilter>({
    valanId: getLastNineWeeksDates()[getLastNineWeeksDates().length - 2].date,
    startDate: new Date(
      getLastNineWeeksDates()[getLastNineWeeksDates().length - 2].start_date
    ),
    endDate: new Date(
      getLastNineWeeksDates()[getLastNineWeeksDates().length - 2].end_date
    ),
  });
  const [search, setSearch] = useState("");
  const onCallFilter = async (filterData: any) => {
    setFilteredData(filterData);
  };
  const [page, setPage] = useState(1);
  const pageSize = 500;
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [rowData, setRowData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMasterLogIndex, setSelectedMasterLogIndex] = useState<
    number | null
  >(null);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const { data, isLoading, error, refetch } = useQuery(
    ["summaryReport", page, pageSize, filteredData],
    async () => {
      return await accountService.getSummaryReport(
        page,
        pageSize,
        filteredData?.userId! ??
          filteredData?.masterId! ??
          filteredData?.adminId!,
        filteredData?.scriptId,
        filteredData?.segmentId,
        filteredData?.startDate
          ? moment(filteredData?.startDate).format("YYYY-MM-DD")
          : undefined,
        filteredData?.endDate
          ? moment(filteredData?.endDate).format("YYYY-MM-DD")
          : undefined
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
  const onView = (index: any) => {
    if (selectedMasterLogIndex === index) {
      setSelectedMasterLogIndex(null);
    } else {
      setSelectedMasterLogIndex(index);
    }
  };

  const filterControls = useMemo(() => {
    return [
      {
        label: "Valan",
        name: "valanId",
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
        label: "Broker",
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
        label: "Client",
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
          data={
            search
              ? rowData.filter((e) =>
                  e?.name.toLowerCase().includes(search.toLowerCase())
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
          renderItem={({ item, index }: any) => {
            return (
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: current.backgroundColor,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 8,
                    borderBottomWidth: 1,
                    borderColor:
                      current.value === "dark"
                        ? current.bcolor
                        : current.bcolor,
                  }}
                  onPress={() => onView(index)}
                >
                  <View
                    style={{
                      flex: 1,
                      gap: 5,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <EText type="m14" color={current.greyText}>
                        {"UId: "}
                      </EText>
                      <EText type="m14">{` ${item?.userId}(${item?.name})`}</EText>
                    </View>
                    {userData?.role?.slug === "superadmin" ? (
                      <View style={{ flexDirection: "row" }}>
                        <EText type="m14" color={current.greyText}>
                          {"Total M2M: "}
                        </EText>
                        <EText type="m14">
                          {formatIndianAmount(item?.billAmount)}
                        </EText>
                      </View>
                    ) : (
                      <View style={{ flexDirection: "row" }}>
                        <EText type="m14" color={current.greyText}>
                          {"Self M2M: "}
                        </EText>
                        <EText type="m14">
                          {formatIndianAmount(item?.selfM2m)}
                        </EText>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
                {selectedMasterLogIndex === index && (
                  <View
                    style={{
                      alignItems: "center",
                      borderBottomWidth: 1,
                      borderColor:
                        current.value === "dark"
                          ? current.bcolor
                          : current.bcolor,
                    }}
                  >
                    <View style={{ padding: 10 }}>
                      <ValueLabelComponent
                        fields={[
                          {
                            label: "Client M2M",
                            value: item?.grossM2M
                              ? formatIndianAmount(item?.grossM2M)
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
                            label: "Brokerage",
                            value: item?.clientBrokerage
                              ? formatIndianAmount(item?.clientBrokerage)
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
                            label: "Total M2M",
                            value: item?.billAmount
                              ? formatIndianAmount(item?.billAmount)
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
                            label: "Broker Brokerage",
                            value: item?.totalBrokerBrokerage
                              ? formatIndianAmount(item?.totalBrokerBrokerage)
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
                            label: "Net M2m",
                            value: item?.netM2m
                              ? formatIndianAmount(item?.netM2m)
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
                            label: `${
                              userData?.role.slug === "admin"
                                ? "Downline"
                                : "Upline"
                            } M2m`,
                            value: item?.totalUplineM2M
                              ? formatIndianAmount(item?.totalUplineM2M)
                              : "-",
                            access: {
                              superadmin: false,
                              admin: true,
                              master: true,
                              user: true,
                              broker: true,
                            },
                          },
                          {
                            label: "Self M2m",
                            value: item?.selfM2m
                              ? formatIndianAmount(item?.selfM2m)
                              : "-",
                            withComma: true,
                            access: {
                              superadmin: false,
                              admin: true,
                              master: true,
                              user: true,
                              broker: true,
                            },
                          },
                        ]}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        width: "100%",
                        padding: 5,
                        justifyContent: "space-between",
                        backgroundColor: current.backgroundColor1,
                        borderColor: current.bcolor,
                        marginTop: 5,
                      }}
                    >
                      <View style={{ alignItems: "center", flex: 1 }}>
                        <TouchableOpacity
                          onPress={() => {
                            const uri = `https://trade-future.com/with-brokerage-summary?title=Summary%20(with%20Brokerage)&userId=${
                              item?.id
                            }&segmentId=${Number(
                              filteredData?.segmentId
                            )}&startDate=${
                              filteredData?.startDate || item?.startDate
                            }&endDate=${
                              filteredData?.endDate || item?.endDate
                            }&userName=${item?.name}%20(${
                              item?.userId
                            })&priceWithBrokerage=true`;
                            props.navigation.navigate(SCREENS.WebView, {
                              uri,
                            });
                          }}
                        >
                          <MaterialIcons
                            name={"picture-as-pdf"}
                            color={current?.primary}
                            size={26}
                          />
                        </TouchableOpacity>
                        <EText type="m14" color={current.textColor}>
                          All
                        </EText>
                      </View>

                      <View style={{ alignItems: "center", flex: 1 }}>
                        <TouchableOpacity
                          onPress={() => {
                            const uri = `https://trade-future.com/with-brokerage-summary?title=Summary%20(without%20Brokerage)&userId=${
                              item?.id
                            }&startDate=${
                              filteredData?.startDate || item?.startDate
                            }&endDate=${
                              filteredData?.endDate || item?.endDate
                            }&userName=${item?.name}%20(${
                              item?.userId
                            })&priceWithBrokerage=true&outStanding=true`;
                            props.navigation.navigate(SCREENS.WebView, {
                              uri,
                            });
                          }}
                        >
                          <MaterialIcons
                            name={"picture-as-pdf"}
                            color={current?.primary}
                            size={26}
                          />
                        </TouchableOpacity>
                        <EText type="m14" color={current.textColor}>
                          Live Position
                        </EText>
                      </View>

                      <View style={{ alignItems: "center", flex: 1 }}>
                        <TouchableOpacity
                          onPress={() => {
                            const uri = `https://trade-future.com/net-position?title=Net%20Position&userId=${
                              item?.id
                            }&startDate=${
                              filteredData?.startDate || item?.startDate
                            }&endDate=${
                              filteredData?.endDate || item?.endDate
                            }&userName=${item?.name}%20(${
                              item?.userId
                            })&scriptId=${filteredData?.scriptId})}`;
                            props.navigation.navigate(SCREENS.WebView, {
                              uri,
                            });
                          }}
                        >
                          <MaterialIcons
                            name={"picture-as-pdf"}
                            color={current?.primary}
                            size={26}
                          />
                        </TouchableOpacity>
                        <EText type="m14" color={current.textColor}>
                          Net Position
                        </EText>
                      </View>
                    </View>
                  </View>
                )}
              </>
            );
          }}
        />
      )}
    </EListLayout>
  );
};
export default SummaryReport;
const localStyles = StyleSheet.create({
  SearchBarContainer: {
    elevation: 5,
    borderRadius: 9,
  },
  SearchAndFilterContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
});
