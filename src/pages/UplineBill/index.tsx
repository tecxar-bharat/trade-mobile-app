import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ValueLabelComponent from "@commonComponents/ValueLabelComponent";
import { themeSelector } from "@reducers/theme.reducer";
import {
  getSummaryReport,
  summaryPage,
  userSelector,
} from "@reducers/userReducer";
import { useAppDispatch, useAppSelector } from "@store/index";
import { getLastNineWeeksDates } from "@utils/constant";
import { formatIndianAmount } from "@utils/helpers";
import moment from "moment";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
const UplineBill = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [filteredData, setFilteredData] = useState({
    valanId: getLastNineWeeksDates()[getLastNineWeeksDates().length - 2].date,
    startDate: new Date(getLastNineWeeksDates()[getLastNineWeeksDates().length - 2].start_date),
    endDate: new Date(getLastNineWeeksDates()[getLastNineWeeksDates().length - 2].end_date),
  });
  const [search, setSearchStr] = useState("");
  const dispatch = useAppDispatch();
  const [selectedMasterLog, setSelectedMasterLog] = useState({});
  const [total, setTotal] = useState(0);

  const { data, page, rowPerPage, totalCount, fetchMoreLoading, loading } =
    useAppSelector((state) => userSelector(state, "summaryReportData"));

  useEffect(() => {
    dispatch(
      getSummaryReport({
        page,
        rowPerPage,
        userId:
          filteredData?.userId ??
          filteredData?.masterId ??
          filteredData?.adminId,
        scriptId: filteredData?.scriptId,
        segmentId: filteredData?.segmentId,
        startDate: filteredData?.startDate ? moment(filteredData?.startDate).format('YYYY-MM-DD') : undefined,
        endDate: filteredData?.endDate ? moment(filteredData?.endDate).format('YYYY-MM-DD') : undefined,
      })
    );
  }, [filteredData, page, rowPerPage]);

  useEffect(() => {
    const amount = data.reduce(
      (accumulator, currentValue) => accumulator + currentValue.totalUplineM2M,
      0
    );
    setTotal(amount);
  }, [data]);

  const fetchMore = () => {
    if (totalCount > page * rowPerPage) {
      dispatch(summaryPage(page + 1));
    }
  };

  const onView = (item: any) => {
    if (selectedMasterLog && selectedMasterLog.id === item.id) {
      setSelectedMasterLog(null);
    } else {
      setSelectedMasterLog(item);
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <Fragment>
        <TouchableOpacity
          style={{
            backgroundColor: current.cardBackround,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            alignItems: "center",
            borderBottomWidth: 1,
            borderColor:
              current.value === "dark"
                ? current.cardBackround
                : current.grayScale3,
          }}
          onPress={() => onView(item)}
        >
          <View
            style={{
              flexDirection: "row",
              flex: 1,
            }}
          >
            <View style={{ flex: 1 }}>
              <View>
                <EText
                  type="s14"
                  color={current.textColor}
                >{`${item?.name}`}</EText>
                <EText
                  type="r14"
                  color={current.greyText}
                >{`(${item?.userId})`}</EText>
              </View>
            </View>
            <View
              style={{
                alignItems: "flex-end",
              }}
            >
              <EText type="b14" color={current.textColor}>
                {formatIndianAmount(item?.totalUplineM2M)}
              </EText>
            </View>
          </View>
        </TouchableOpacity>
        {selectedMasterLog === item && (
          <View
            style={{
              padding: 10,
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
                  label: "ADMIN",
                  value: selectedMasterLog?.adminName
                    ? selectedMasterLog?.adminName
                    : "-",
                  access: {
                    superadmin: true,
                    admin: false,
                    master: false,
                    user: false,
                    broker: false,
                  },
                },
                {
                  label: "MASTER",
                  value: selectedMasterLog?.masterName
                    ? selectedMasterLog?.masterName
                    : "-",
                  access: {
                    superadmin: true,
                    admin: true,
                    master: false,
                    user: false,
                    broker: false,
                  },
                },
                {
                  label: "USER",
                  value: selectedMasterLog?.userId
                    ? selectedMasterLog?.userId
                    : "-",
                  access: {
                    superadmin: true,
                    admin: true,
                    master: false,
                    user: false,
                    broker: false,
                  },
                },

                {
                  label: "PNL",
                  value: selectedMasterLog?.billAmount,
                  withComma: true,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: true,
                    broker: true,
                  },
                },
                {
                  label: "BROKER BROKERAGE",
                  value: selectedMasterLog?.totalBrokerBrokerage,
                  withComma: true,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: true,
                    broker: true,
                  },
                },
                {
                  label: "NET M2M",
                  value: selectedMasterLog?.netM2m,
                  withComma: true,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: true,
                    broker: true,
                  },
                },
                {
                  label: "UPLINE(%)",
                  value: selectedMasterLog?.masterUplinePercentage,
                  withComma: true,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: true,
                    broker: true,
                  },
                },
                {
                  label: "UPLINE M2M",
                  value: selectedMasterLog?.totalUplineM2M,
                  withComma: true,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: true,
                    broker: true,
                  },
                },
                {
                  label: "SELF M2M",
                  value: selectedMasterLog?.selfM2m,
                  withComma: true,
                  access: {
                    superadmin: true,
                    admin: true,
                    master: true,
                    user: true,
                    broker: true,
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
          master: true,
          user: false,
          broker: false,
        },
      },
    ];
  }, []);

  return (
    <EListLayout
      config={filterControls}
      defaultValue={filteredData}
      handleChangeFilter={setFilteredData}
      onSearch={setSearchStr}
    >
      {loading ? (
        <ELoader loading={true} size="medium" mode={"fullscreen"} />
      ) : (
        <Fragment>
          <FlatList
            data={
              search
                ? data.filter((e) => e.userId.includes(search.toLowerCase()))
                : data
            }
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            onEndReached={fetchMore}
            onEndReachedThreshold={0.3}
            {...(fetchMoreLoading && {
              ListFooterComponent: (
                <ELoader loading={true} mode={"button"} size={"small"} />
              ),
            })}
            refreshControl={
              <RefreshControl
                tintColor={"#4885ED"}
                refreshing={loading}
                onRefresh={() => {
                  if (page === 1) {
                    setTimeout(() => {
                      dispatch(
                        getSummaryReport({
                          page,
                          rowPerPage,
                          userId:
                            filteredData?.userId ??
                            filteredData?.masterId ??
                            filteredData?.adminId,
                          scriptId: filteredData?.scriptId,
                          segmentId: filteredData?.segmentId,
                          startDate: filteredData?.startDate,
                          endDate: filteredData?.endDate,
                        })
                      );
                    }, 500);
                  }
                }}
              />
            }
            ListEmptyComponent={
              <View
                style={{
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <EText type="m16">No Data Found</EText>
              </View>
            }
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
              {formatIndianAmount(total)}
            </EText>
          </View>
        </Fragment>
      )}
    </EListLayout>
  );
};
export default UplineBill;
