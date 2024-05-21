import { ActionButton } from "@commonComponents/ActionButtons";
import EHeader from "@commonComponents/EHeader";
import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import ValueLabelComponent from "@commonComponents/ValueLabelComponent";
import ResetPasswordModal from "@components/models/ResetPassword";
import { IAdminAccount } from "@interfaces/account.interface";
import { SCREENS } from "@navigation/NavigationKeys";
import { useRoute } from "@react-navigation/native";
import accountService from "@services/account.service";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { formatIndianAmount } from "@utils/helpers";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useQuery } from "react-query";

export interface payloadDataInfo {
  q?: string;
  page: number | undefined;
  pageSize: number | undefined;
  searchStr?: string;
}
const Admin = (props: any) => {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const role = "admin";
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [filteredData, setFilteredData] = useState<any>({});
  const [rowData, setRowData] = useState<any[]>([]);
  const [passwordModalData, setPasswordModalData] = useState();
  const [reset, setReset] = useState(false);
  const [search, setSearchStr] = useState("");
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const [selectedMasterLog, setSelectedMasterLog] = useState<IAdminAccount[]>(
    []
  );
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const { data, isLoading, error, refetch } = useQuery(
    ["admin", page, pageSize, filteredData, search],
    async () => {
      return await accountService.getAccountList(
        page,
        pageSize,
        search,
        filteredData?.userId,
        role,
        filteredData?.status
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
  const ResetPassword = (item: any) => {
    setReset(true);
    setPasswordModalData(item);
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
        label: "Status",
        name: "status",
        type: "select",
        access: {
          superadmin: true,
          admin: false,
          master: false,
          user: false,
          broker: false,
        },
      },
    ];
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <EHeader title="Admin" />

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
            renderItem={({ item }) => {
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
                        MAX USERS
                      </EText>
                      <EText type="b14">
                        {item?.maxUsers
                          ? formatIndianAmount(item?.maxUsers)
                          : "-"}
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
                            label: "MAX MASTER",
                            value: selectedMasterLog?.maxMasters
                              ? formatIndianAmount(
                                  selectedMasterLog?.maxMasters
                                )
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
                            label: "USED MASTER",
                            value: selectedMasterLog?.totalMyUsers
                              ? formatIndianAmount(
                                  selectedMasterLog?.totalMyUsers
                                )
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
                            label: "MAX USERS",
                            value: selectedMasterLog?.maxUsers
                              ? formatIndianAmount(selectedMasterLog?.maxUsers)
                              : "-",
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
                      {["superadmin"].includes(userData?.role?.slug) && (
                        <ActionButton
                          type={"password"}
                          password={() => ResetPassword(selectedMasterLog)}
                          active={"active"}
                          activate={() => ActiveInactive(item)}
                          isActive={selectedMasterLog?.isActive}
                          edit={"edit"}
                          Edited={() =>
                            props.navigation.navigate(SCREENS.EditAdmin, {
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
export default Admin;
