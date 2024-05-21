// Library Imports
import EHeader from "@commonComponents/EHeader";
import ELoader from "@commonComponents/ELoader";
import ESafeAreaView from "@commonComponents/ESafeAreaView";
import EText from "@commonComponents/EText";
import {
  blockPage,
  blockedScriptsSelector,
  deleteBlockScriptsGroupById,
  getBlockScriptsGroup,
} from "@reducers/blockScriptReducer";
import { useAppDispatch, useAppSelector } from "@store/index";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

import { moderateScale } from "@common/constants";
import EInput from "@commonComponents/EInput";
import AddBlockedGroupModal from "@components/models/AddBlockedGroupModal";
import DeleteModal from "@components/models/DeleteModal";
import { IAccount } from "@interfaces/account.interface";
import { useIsFocused } from "@react-navigation/native";
import { themeSelector } from "@reducers/theme.reducer";
import Ionicons from "react-native-vector-icons/Ionicons";

const BlockScriptGroup = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const dispatch = useAppDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [show, setShow] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any | null>(null);
  const [openTradeModalData, setOpenTradeModalData] = useState<IAccount>();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      dispatch(
        getBlockScriptsGroup({ page, rowPerPage, groupType: "blockScript" })
      );
    }
  }, [isFocused]);
  const { data, page, rowPerPage, totalCount, fetchMoreLoading, loading } =
    useAppSelector((state) =>
      blockedScriptsSelector(state, "blockScriptsGroupList")
    );
  const [search, setSearchStr] = useState("");
  const renderItem = ({ item }: any) => {
    return (
      <View
        style={{
          marginHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          borderRadius: 10,
          elevation: 5,
          marginBottom: 5,
          backgroundColor: current.backgroundColor,
          padding: 8,
          borderWidth: 1,
          borderColor:
            current.value === "dark" ? current.bcolor : current.bcolor,
        }}
      >
        <EText type="r14">{item.name}</EText>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              setOpenTradeModalData(item), setShow(true);
            }}
            style={{ marginRight: 5 }}
          >
            <AntDesign name="edit" size={18} color={current.green} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setDeleteModal(true), setDeleteItem(item);
            }}
          >
            <AntDesign name="delete" size={18} color={current.red} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const fetchMore = () => {
    if (totalCount > page * rowPerPage) {
      dispatch(blockPage(page + 1));
    }
  };

  const handleDelete = async (item: any) => {
    setDeleteModal(false);
    await dispatch(deleteBlockScriptsGroupById({ deleteId: item.id }));
    setTimeout(() => {
      dispatch(
        getBlockScriptsGroup({ page, rowPerPage, groupType: "blockScript" })
      );
    }, 100);
  };

  return (
    <ESafeAreaView>
      <View style={{ flex: 1, backgroundColor: current.backgroundColor }}>
        <EHeader
          title="Block Script Group"
        />
        <View style={{ flex: 1 }}>
          <View style={localStyles.SearchAndFilterContainer}>
            <View style={{ flex: 1 }}>
              <EInput
                placeHolder={"Search"}
                keyBoardType={"default"}
                value={search}
                onChangeText={(text: string) => setSearchStr(text)}
                insideLeftIcon={() => (
                  <Ionicons name="search" size={moderateScale(20)} />
                )}
                height={30}
                inputContainerStyle={[
                  {
                    backgroundColor: current.backgroundColor,
                    borderColor:
                      current.value === "light"
                        ? current.bcolor
                        : current.backgroundColor,
                    borderWidth: 1,
                  },
                  localStyles.SearchBarContainer,
                ]}
              />
            </View>
            <View>
              <TouchableOpacity
                style={{ marginLeft: 5, marginTop: 5 }}
                onPress={() => {
                  setShow(!show);
                }}
              >
                <AntDesign
                  name="plussquare"
                  size={30}
                  color={current.new_primary}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              renderItem={renderItem}
              data={
                search
                  ? data.filter((item) =>
                    item?.name.toLowerCase().includes(search.toLowerCase())
                  )
                  : data
              }
              onEndReached={fetchMore}
              onEndReachedThreshold={0.3}
              keyExtractor={(item, index) => `${item.id}_${index}`}
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
                          getBlockScriptsGroup({
                            page,
                            rowPerPage,
                            groupType: "blockScript",
                          })
                        );
                      }, 500);
                    } else {
                      dispatch(blockPage(1));
                    }
                  }}
                />
              }
              ListEmptyComponent={
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EText type="m16">No Data Found</EText>
                </View>
              }
            />
          </View>
        </View>

        <DeleteModal
          onPress={() => handleDelete(deleteItem)}
          visible={deleteModal}
          title="Delete"
          message="Are you sure you want to delete trade?"
          onBackdropPress={() => setDeleteModal(false)}
          onDismiss={() => setDeleteModal(false)}
        />
        <AddBlockedGroupModal
          isVisible={show}
          viewData={openTradeModalData}
          page={page}
          rowPerPage={rowPerPage}
          onDismiss={() => {
            setShow(false), setOpenTradeModalData(undefined);
          }}
        />
      </View>
    </ESafeAreaView>
  );
};

export default BlockScriptGroup;
const localStyles = StyleSheet.create({
  SearchBarContainer: {
    borderRadius: 9,
  },
  SearchAndFilterContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
});
