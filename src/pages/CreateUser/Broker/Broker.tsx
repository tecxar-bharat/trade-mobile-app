import { ActionButton } from "@commonComponents/ActionButtons";
import EHeader from "@commonComponents/EHeader";
import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import ValueLabelComponent from "@commonComponents/ValueLabelComponent";
import ResetPasswordModal from "@components/models/ResetPassword";
import { IBrokerAccount } from "@interfaces/account.interface";
import { INavigation } from "@interfaces/common";
import { SCREENS } from "@navigation/NavigationKeys";
import accountService from "@services/account.service";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { formatIndianAmount } from "@utils/helpers";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useQuery } from "react-query";
const Broker = ({ navigation }: INavigation) => {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [rowData, setRowData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any>({});
  const [passwordModalData, setPasswordModalData] = useState();
  const [search, setSearchStr] = useState("");
  const [reset, setReset] = useState(false);
  const [selectedMasterLog, setSelectedMasterLog] = useState<IBrokerAccount[]>(
    []
  );
  const role = "broker";
  const [loading, setLoading] = useState(true);
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const { data, isLoading, error, refetch } = useQuery(
    ["brokers", page, pageSize, filteredData, search],
    async () => {
      return await accountService.getBrokerAccountList(
        page,
        pageSize,
        search,
        filteredData?.userId ??
          filteredData?.brokerId ??
          filteredData?.masterId ??
          filteredData?.adminId,
        role,
        filteredData?.status,
        filteredData?.startDate,
        filteredData?.endDate,
        filteredData?.loginAfter,
        filteredData?.loginBefore
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
  const onRefresh = async () => {
    setPage(1);
    await refetch();
  };
  const fetchMoreData = () => {
    if (!isLoading && !error && data?.data?.data?.count > page * pageSize) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const onView = (item: any) => {
    if (selectedMasterLog && selectedMasterLog.id === item.id) {
      setSelectedMasterLog(null);
    } else {
      setSelectedMasterLog(item);
    }
  };
  const onDelete = (deleteId: number) => {
    accountService.deleteAccountById(deleteId).then((res: any) => {
      Toast.show({ type: "success", text1: res.data.message });
    });
  };
  const ActiveInactive = async (item: any) => {
    await accountService
      .changeStatusById(item?.id, {
        isActive: !item?.isActive,
      })
      .then((res: any) => {
        if (res.data.statusCode === 200) {
          Toast.show({
            type: "success",
            text1: res.data.message,
          });
          refetch();
        } else {
          Toast.show({ type: "error", text1: res.data.message });
        }
      });
  };
  const ResetPassword = (item: any) => {
    setReset(true);
    setPasswordModalData(item);
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

  const filterControls = useMemo(() => {
    return [
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
        label: "Broker",
        name: "brokerId",
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
        label: "Status",
        name: "status",
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
        label: "Join After",
        name: "startDate",
        type: "date",
        maximumDate: new Date(),
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: false,
          broker: true,
        },
      },
      {
        label: "Join Before",
        name: "endDate",
        type: "date",
        maximumDate: new Date(),
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: false,
          broker: true,
        },
      },
      {
        label: "Login After",
        name: "loginAfter",
        type: "date",
        maximumDate: new Date(),
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: false,
          broker: true,
        },
      },
      {
        label: "Login Before",
        name: "loginBefore",
        type: "date",
        maximumDate: new Date(),
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: false,
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

  return (
    <View style={{ flex: 1 }}>
      <EHeader title="Broker" />

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
            data={rowData}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={({ item }: any) => {
              return (
                <>
                  <TouchableOpacity
                    style={{
                      backgroundColor: current.backgroundColor,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 8,
                      borderBottomWidth: selectedMasterLog === item ? 0 : 1,
                      borderColor:
                        current.value === "dark"
                          ? current.bcolor
                          : current.bcolor,
                    }}
                    onPress={() => onView(item)}
                  >
                    <View
                      style={{
                        flex: 1,
                        display: "flex",
                        marginRight: 10,
                        gap: 8,
                        flexDirection: "row",
                      }}
                    >
                      <EText type="b14">{item?.name}</EText>
                      <EText type="r14">({item?.userId})</EText>
                    </View>
                    <View
                      style={{
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                      }}
                    >
                      <EText type="r12" color={current.greyText}>
                        Brokerage
                      </EText>
                      <EText type="b14">
                        {item?.brokerBrokerage
                          ? formatIndianAmount(item?.brokerBrokerage)
                          : 0}
                      </EText>
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
                            value: selectedMasterLog?.adminName,
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
                            value: selectedMasterLog?.masterName,
                            access: {
                              superadmin: true,
                              admin: true,
                              master: false,
                              user: false,
                              broker: false,
                            },
                          },
                          {
                            label: "BROKER",
                            value: selectedMasterLog?.userId,
                            access: {
                              superadmin: true,
                              admin: true,
                              master: true,
                              user: false,
                              broker: false,
                            },
                          },
                          {
                            label: "TOTAL USER",
                            value:
                              selectedMasterLog?.totalBrokerUsers?.length > 0
                                ? selectedMasterLog?.totalBrokerUsers?.length
                                : 0,
                            access: {
                              superadmin: true,
                              admin: true,
                              master: true,
                              user: false,
                              broker: true,
                            },
                          },
                          {
                            label: "OUTSTANDING",
                            value: "-",
                            access: {
                              superadmin: true,
                              admin: true,
                              master: true,
                              user: false,
                              broker: true,
                            },
                          },
                          {
                            label: "BROKERAGE",
                            value: selectedMasterLog?.brokerBrokerage
                              ? selectedMasterLog?.brokerBrokerage
                              : "",
                            withComma: true,
                            access: {
                              superadmin: true,
                              admin: true,
                              master: true,
                              user: false,
                              broker: false,
                            },
                          },
                          {
                            label: "LOGIN TIME",
                            value: selectedMasterLog?.lastLogin
                              ? moment(selectedMasterLog?.lastLogin).format(
                                  "DD-MM-YYYY hh:mm A"
                                )
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
                            label: "LOGIN IP",
                            value: selectedMasterLog?.loginIp
                              ? selectedMasterLog?.loginIp
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
                            label: "JOIN DATE",
                            value: moment(item.createdAt).format(
                              "DD-MM-YYYY hh:mm A"
                            ),
                            access: {
                              superadmin: true,
                              admin: true,
                              master: true,
                              user: false,
                              broker: true,
                            },
                          },
                        ]}
                      />
                      {["superadmin", "admin", "master"].includes(
                        userData?.role?.slug
                      ) && (
                        <ActionButton
                          ledger={"ledger"}
                          ledgers={() =>
                            navigation.navigate(SCREENS.LedgerBroker, {
                              id: item?.id,
                              name: item?.name,
                              userId: item?.userId,
                            })
                          }
                          type={"password"}
                          password={() => ResetPassword(selectedMasterLog)}
                          active={"active"}
                          activate={() => ActiveInactive(item)}
                          isActive={selectedMasterLog?.isActive}
                          edit={"edit"}
                          Edited={() =>
                            navigation.navigate(SCREENS.EditBroker, {
                              id: selectedMasterLog?.id,
                            })
                          }
                          delete={"delete"}
                          deleted={() => {
                            onDelete(item?.id);
                          }}
                        />
                      )}
                    </View>
                  )}
                </>
              );
            }}
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

      <ResetPasswordModal
        isVisible={reset}
        viewData={passwordModalData}
        onDismiss={() => setReset(false)}
        onComplete={() => {
          setReset(false);
        }}
      />
    </View>
  );
};
export default Broker;
