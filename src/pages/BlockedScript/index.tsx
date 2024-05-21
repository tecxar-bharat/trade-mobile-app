// Library Imports
import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import DeleteModal from "@components/models/DeleteModal";
import { LoggedUser } from "@db/schemas/loggedUser.model";
import FormSelect from "@fields/FormSelect";
import { IAllScripts } from "@interfaces/common";
import IconDelete from "@assets/svgs/IconDelete";
import {
  createBlockScripts,
  deleteBlockScript,
  getBlockedScripts,
} from "@reducers/blockScriptReducer";
import { themeSelector } from "@reducers/theme.reducer";
import commonService from "@services/common.service";
import tradeService from "@services/trade.service";
import { useAppDispatch, useAppSelector } from "@store/index";
import { isBlank } from "@utils/constant";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useQuery } from "react-query";
// allScripts
const BlockScript = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [refresh, setRefresh] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState<any[]>([]);
  const [allScriptList, setAllScriptList] = useState<IAllScripts[]>([]);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<any | null>(null);
  const userData = LoggedUser.getActiveUser(globalThis.realm);
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const dispatch = useAppDispatch();

  const { data, isLoading, error, refetch } = useQuery(
    ["blockedScript", page, pageSize, refresh],
    async () => {
      return await tradeService.getBlockScript(page, pageSize);
    }
  );

  useEffect(() => {
    try {
      commonService
        .getAllScripts()
        .then((e) => setAllScriptList(e.data.data as IAllScripts[]));
    } catch (error) {
      console.log("Error fetching", error);
    }
  }, []);

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
  const isFetchingMore = useRef(false);
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
          padding: 8,
          paddingHorizontal: 10,
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderColor:
            current.value === "dark" ? current.backgroundColor : current.bcolor,
        }}
      >
        <EText type="m14">{item.script.name}</EText>
        {["superadmin", "admin", "master"].includes(userData?.role?.slug!) && (
          <TouchableOpacity
            onPress={() => {
              setDeleteModal(true), setDeleteItem(item);
            }}
          >
            <IconDelete color={current.red} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const { handleSubmit, control, setValue, watch } = useForm<any>({
    mode: "onChange",
    defaultValues: {},
  });

  const scriptId = watch("scriptId");

  const onSuccess2 = (message: string) => {
    setTimeout(() => {
      setValue("scriptId", "");
      Toast.show({ type: "success", text1: message });
      dispatch(getBlockedScripts({ page: 1, rowPerPage: 10 }));
    }, 500);
  };
  const onError2 = (message: string) => {
    setTimeout(() => {
      Toast.show({ type: "error", text1: message });
    }, 500);
  };

  const Submit = async (payload: any) => {
    const object = {
      payload,
      onSuccess2,
      onError2,
    };
    await dispatch(createBlockScripts(object));
    setPage(1);
    setRefresh((prev) => !prev);
  };

  const handleDelete = async (item: any) => {
    setDeleteModal(false);
    await dispatch(deleteBlockScript({ deleteId: item.id }));
    setPage(1);
    setRefresh((prev) => !prev);
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

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      <EListLayout>
        {["superadmin", "admin", "master"].includes(userData?.role.slug!) && (
          <View style={localStyles.SearchAndFilterContainer}>
            <View style={{ flex: 1, marginTop: 10 }}>
              <FormSelect
                labelKey="name"
                valueKey="id"
                name="scriptId"
                control={control}
                type="select"
                isShow={true}
                search={true}
                options={allScriptList}
                placeholder={"Select script to block"}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: current.primary,
                  borderRadius: 6,
                  paddingVertical: 11,
                  paddingHorizontal: 10,
                }}
                disabled={isBlank(scriptId)}
                onPress={handleSubmit(Submit)}
              >
                <EText type="b14" color="white">
                  + Add
                </EText>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {loading ? (
          <ELoader loading={true} size="medium" mode={"fullscreen"} />
        ) : (
          <FlatList
            renderItem={renderItem}
            data={rowData}
            keyExtractor={(item, index) => `${item.id}_${index}`}
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
      <DeleteModal
        onPress={() => handleDelete(deleteItem)}
        visible={deleteModal}
        title="Delete"
        message="Are you sure you want to delete trade?"
        onBackdropPress={() => setDeleteModal(false)}
        onDismiss={() => setDeleteModal(false)}
      />
    </View>
  );
};

export default BlockScript;
const localStyles = StyleSheet.create({
  SearchBarContainer: {
    borderRadius: 9,
  },
  SearchAndFilterContainer: {
    alignItems: "center",
    marginTop: -40,
    paddingHorizontal: 10,
    flexDirection: "row",
  },
});
