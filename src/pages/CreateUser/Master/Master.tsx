import images from "@assets/images";
import { ActionButton } from "@commonComponents/ActionButtons";
import EHeader from "@commonComponents/EHeader";
import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import ValueLabelComponent from "@commonComponents/ValueLabelComponent";
import DeleteModal from "@components/models/DeleteModal";
import ResetPasswordModal from "@components/models/ResetPassword";
import { INavigation } from "@interfaces/common";
import { SCREENS } from "@navigation/NavigationKeys";
import accountService from "@services/account.service";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { formatIndianAmount } from "@utils/helpers";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useQuery } from "react-query";
const Master = ({ navigation }: INavigation) => {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const role = "master";
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [rowData, setRowData] = useState<any[]>([]);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [passwordModalData, setPasswordModalData] = useState();
  const [reset, setReset] = useState(false);
  const [selectedMasterLog, setSelectedMasterLog] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any>({});
  const [search, setSearchStr] = useState("");
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const userData = useAppSelector((state) => authSelector(state, "userData"));

  const { data, isLoading, error, refetch } = useQuery(
    ["master", page, pageSize, filteredData, search],
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
        label: "Status",
        name: "status",
        type: "select",
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
    <View style={{ flex: 1 }}>
      <EHeader title="Master" />

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
              const deleteClick = () => {
                setIsDelete(true);
                setDeleteId(item?.id);
              };
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
                        M2M
                      </EText>
                      <EText type="b14">
                        {formatIndianAmount(item?.totalM2m) ?? 0}
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
                            value: selectedMasterLog?.masterName
                              ? selectedMasterLog?.masterName
                              : "0",
                            access: {
                              superadmin: true,
                              admin: false,
                              master: false,
                              user: false,
                              broker: false,
                            },
                          },
                          {
                            label: "CLIENT",
                            value: selectedMasterLog?.userId
                              ? `${selectedMasterLog?.name} ( ${selectedMasterLog?.userId} )`
                              : "0",
                            access: {
                              superadmin: true,
                              admin: true,
                              master: false,
                              user: false,
                              broker: false,
                            },
                          },
                          {
                            label: "M2M",
                            value: selectedMasterLog?.totalM2m
                              ? selectedMasterLog?.totalM2m
                              : "0",
                            withComma: true,
                            access: {
                              superadmin: true,
                              admin: true,
                              master: false,
                              user: false,
                              broker: false,
                            },
                          },
                          {
                            label: "BROKERAGE",
                            value: selectedMasterLog?.totalBrokerage
                              ? selectedMasterLog?.totalBrokerage
                              : "0",
                            withComma: true,
                            access: {
                              superadmin: true,
                              admin: true,
                              master: false,
                              user: false,
                              broker: false,
                            },
                          },
                          {
                            label: "UPLINE M2M",
                            value: selectedMasterLog?.uplineM2M
                              ? selectedMasterLog?.uplineM2M
                              : "0",
                            withComma: true,
                            access: {
                              superadmin: true,
                              admin: true,
                              master: false,
                              user: false,
                              broker: false,
                            },
                          },
                          // {
                          //   label: "USED MARGIN",
                          //   value: selectedMasterLog?.usedMargin
                          //     ? selectedMasterLog?.usedMargin
                          //     : "0",

                          //   access: {
                          //     superadmin: true,
                          //     admin: true,
                          //     master: false,
                          //     user: false,
                          //     broker: false,
                          //   },
                          // },
                          // {
                          //   label: "USER MARGIN",
                          //   value: selectedMasterLog?.masterMarginUserNseFut
                          //     ? selectedMasterLog?.masterMarginUserNseFut
                          //     : "0",

                          //   access: {
                          //     superadmin: true,
                          //     admin: true,
                          //     master: false,
                          //     user: false,
                          //     broker: false,
                          //   },
                          // },
                          {
                            label: "MAX USERS",
                            value: selectedMasterLog?.maxUsers
                              ? selectedMasterLog?.maxUsers
                              : "0",
                            access: {
                              superadmin: true,
                              admin: true,
                              master: false,
                              user: false,
                              broker: false,
                            },
                          },
                          {
                            label: "USED USERS",
                            value: selectedMasterLog?.totalMyUsers
                              ? selectedMasterLog?.totalMyUsers
                              : "0",
                            access: {
                              superadmin: true,
                              admin: true,
                              master: false,
                              user: false,
                              broker: false,
                            },
                          },
                        ]}
                      />
                      {["superadmin", "admin", "master"].includes(
                        userData?.role?.slug
                      ) && (
                        <ActionButton
                          type={"password"}
                          password={() => ResetPassword(selectedMasterLog)}
                          active={"active"}
                          activate={() => ActiveInactive(item)}
                          isActive={selectedMasterLog?.isActive}
                          edit={"edit"}
                          Edited={() =>
                            navigation.navigate(SCREENS.EditMaster, {
                              id: selectedMasterLog?.id,
                            })
                          }
                          delete={"delete"}
                          deleted={() => onDelete(item?.id)}
                        />
                      )}
                    </View>
                  )}
                </>
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
export default Master;
