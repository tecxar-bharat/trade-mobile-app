import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import DeleteModal from "@components/models/DeleteModal";
import ResetPasswordModal from "@components/models/ResetPassword";
import { SCREENS } from "@navigation/NavigationKeys";
import accountService from "@services/account.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import React, { Fragment, useEffect, useMemo, useState } from "react";

import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import { INavigation } from "@interfaces/common";
import { authSelector } from "@store/reducers/auth.reducer";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import ValueLabelComponent from "@commonComponents/ValueLabelComponent";
import EHeader from "@commonComponents/EHeader";
import { useQuery } from "react-query";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ActionButton } from "@commonComponents/ActionButtons";
const Users = (props: INavigation) => {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const role = "user";
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [passwordModalData, setPasswordModalData] = useState();
  const [reset, setReset] = useState(false);
  const [rowData, setRowData] = useState<any[]>([]);

  const [selectedMasterLog, setSelectedMasterLog] = useState<any[]>([]);
  const [search, setSearchStr] = useState("");
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<any>({});
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error, refetch } = useQuery(
    ["users", page, pageSize, filteredData, search],
    async () => {
      return await accountService.getAccountList(
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
        setRowData(data?.data?.data?.rows);
      } else {
        setRowData((prevData) => [...prevData, ...data?.data?.data?.rows]);
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
  const onView = (item: any) => {
    if (selectedMasterLog && selectedMasterLog.id === item.id) {
      setSelectedMasterLog(null);
    } else {
      setSelectedMasterLog(item);
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
          broker: true,
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
          user: false,
          broker: true,
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
    ];
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      {["superadmin", "admin", "master"].includes(userData?.role?.slug) && (
        <EHeader title="User" />
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
            data={rowData}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={({ item }: any) => {
              return (
                <Fragment>
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
                        Master
                      </EText>
                      <EText type="b14">
                        {item?.masterName ? item?.masterName : "-"}
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
                              broker: true,
                            },
                          },
                          {
                            label: "BROKER",
                            value: selectedMasterLog?.broker
                              ? selectedMasterLog?.broker
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
                            label: "CLIENT",
                            value: selectedMasterLog?.userId
                              ? `${selectedMasterLog?.name} ( ${selectedMasterLog?.userId} )`
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
                            label: "LOGIN TIME",
                            value: selectedMasterLog?.lastLogin
                              ? moment(selectedMasterLog?.lastLogin).format(
                                  "DD-MM-YYYY hh:mm:ss A"
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
                              "DD-MM-YYYY hh:mm:ss A"
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
                            props.navigation.navigate(SCREENS.LedgerBroker, {
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
                            props.navigation.navigate(SCREENS.EditUser, {
                              id: selectedMasterLog?.id,
                            })
                          }
                          delete={"delete"}
                          deleted={() => onDelete(item.id)}
                        />
                      )}
                      {["broker"].includes(userData?.role?.slug) && (
                        <ActionButton
                          ledger={"ledger"}
                          ledgers={() =>
                            props.navigation.navigate(SCREENS.LedgerBroker, {
                              id: item?.id,
                              name: item?.name,
                              userId: item?.userId,
                            })
                          }
                        />
                      )}
                    </View>
                  )}
                </Fragment>
              );
            }}
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }
            onEndReached={fetchMoreData}
            onEndReachedThreshold={0.1}
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
export default Users;

{
  /* {userData?.role.slug === "broker" && (
                    <>
                      <View
                        style={{
                          marginVertical: 2,
                          borderRadius: 6,
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
                      >
                        <View
                          style={{
                            flex: 1,
                            alignItems: "flex-start",
                            marginRight: 10,
                          }}
                        >
                          <View style={{ flexDirection: "row" }}>
                            <EText
                              type="m16"
                              color={current.textColor}
                              style={{ padding: 2 }}
                            >
                              {`${item?.name} (${item?.userId})`}
                            </EText>
                          </View>
                          <View style={{ flexDirection: "row" }}>
                            <EText
                              type="r14"
                              color={current.greyText}
                              style={{ padding: 2 }}
                            >
                              Master:
                            </EText>
                            <EText
                              type="m14"
                              color={current.textColor}
                              style={{ padding: 2 }}
                            >
                              {item?.masterName}
                            </EText>
                          </View>
                        </View>
                        <View
                          style={{
                            alignItems: "flex-end",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              props.navigation.navigate(SCREENS.LedgerBroker, {
                                id: item?.id,
                              })
                            }
                          >
                            <MaterialCommunityIcons
                              name={"alpha-l-box"}
                              color={current?.primary}
                              size={30}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  )} */
}

{
  /* <View
style={{
  marginHorizontal: 10,
  marginVertical: 2,
  borderRadius: 10,
  elevation: 5,
  backgroundColor: current.backgroundColor,
  flexDirection: "row",
  justifyContent: "space-between",
  padding: 8,
  borderWidth: 1,
  borderColor:
    current.value === "dark"
      ? current.bcolor
      : current.bcolor,
}}
>
<View
  style={{
    flex: 1,
    alignItems: "flex-start",
    marginRight: 10,
  }}
>
  <EText type="m14">Admin: {item?.adminName}</EText>
  <EText type="m14">Master: {item?.masterName}</EText>
  <EText type="m14">Broker: {item?.broker}</EText>
  <EText type="m14">ClientId: {item?.userId}</EText>
</View>
<View
  style={{
    alignItems: "flex-end",
    justifyContent: "space-between",
  }}
>
  <EText type="b12">
    M2M:{formatIndianAmount(item?.totalM2m)}
  </EText>
  <TouchableOpacity
    style={{ padding: 5 }}
    onPress={() => onView(item)}
  >
    <Entypo
      name="dots-three-vertical"
      color={current.greyDark}
      size={14}
    />
  </TouchableOpacity>
</View>
</View>
{selectedMasterLog === item && (
<View
  style={{
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: current.backgroundColor,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderWidth: 1,
    // flex: 1,
    borderColor:
      current.value === "dark"
        ? current.bcolor
        : current.bcolor,
  }}
>
  <View
    style={{
      flex: 1,
      gap: 5,
    }}
  >
   <EText type="m14">{"Name"}</EText>
  <EText type="m14">{"Brokerage"}</EText>
  <EText type="m14">{"User Margin"}</EText>
  <EText type="m14">{"Used Margin"}</EText> 
    <EText type="m14">{"Edit"}</EText>
    <EText type="m14">{"Active"}</EText>
    <EText type="m14">{"Reset Password"}</EText>
    <EText type="m14">{"Delete"}</EText>
  </View>
  <View style={{ alignItems: "flex-end", gap: 5 }}>
     <EText type="m14">{selectedMasterLog?.name}</EText>
  <EText type="m14">
    {formatIndianAmount(
      selectedMasterLog?.totalBrokerage
    ) ?? 0}
  </EText>
  <EText type="m14">
    {formatIndianAmount(selectedMasterLog?.userMargin) ?? 0}
  </EText>
  <EText type="m14">
    {formatIndianAmount(selectedMasterLog?.usedMargin) ?? 0}
  </EText> 

    <TouchableOpacity
      onPress={() =>
        props.navigation.navigate(SCREENS.EditUser, {
          id: selectedMasterLog?.id,
        })
      }
    >
      <Feather
        name="edit"
        color={current.green}
        size={18}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => ActiveInactive(item)}>
      {selectedMasterLog?.isActive ? (
        <MaterialCommunityIcons
          name="alpha-a-box"
          color={current.blue}
          size={20}
        />
      ) : (
        <MaterialCommunityIcons
          name="alpha-d-box"
          color={current.blue}
          size={20}
        />
      )}
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => ResetPassword(selectedMasterLog)}
    >
      <FontAwesome
        name="key"
        color={current.primary}
        size={18}
      />
    </TouchableOpacity>

    <TouchableOpacity onPress={deleteClick}>
      <AntDesign
        name="delete"
        color={current.red}
        size={18}
      />
    </TouchableOpacity>
  </View>
</View>
)} */
}
