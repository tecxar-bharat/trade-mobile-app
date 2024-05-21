// Library Imports
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import images from "@assets/images";
import EHeader from "@commonComponents/EHeader";
import ELoader from "@commonComponents/ELoader";
import ESafeAreaView from "@commonComponents/ESafeAreaView";
import EText from "@commonComponents/EText";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  blockPage,
  blockedScriptsSelector,
  deleteBlockScriptsGroupById,
  getBlockScriptsGroup,
} from "@reducers/blockScriptReducer";
import AntDesign from "react-native-vector-icons/AntDesign";

import { themeSelector } from "@reducers/theme.reducer";
import DeleteModal from "@components/models/DeleteModal";
import EInput from "@commonComponents/EInput";
import Ionicons from "react-native-vector-icons/Ionicons";
import { IAccount } from "@interfaces/account.interface";
import AddQuantityGroupModal from "@components/models/AddQuantityGroupModal";
import { useIsFocused } from "@react-navigation/native";
import { moderateScale } from "@common/constants";
import blockScriptsService from "@services/blockScripts.service";
import { useQuery } from "react-query";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
const QuantityScriptGroup = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const dispatch = useAppDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [show, setShow] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any | null>(null);
  const [openTradeModalData, setOpenTradeModalData] = useState<IAccount>();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [rowData, setRowData] = useState<any[]>();
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useQuery(["qtyScriptGroup"], async () => {
    return await blockScriptsService.getBlockScriptsGroup(
      page,
      pageSize,
      "qtyScript"
    );
  });

  React.useEffect(() => {
    if (!isLoading && !error && data?.data?.data?.rows) {
      setRowData(data?.data?.data?.rows);
    }
  }, [data, isLoading, error]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const isFetchingMore = useRef(false);
  const fetchMoreData = () => {
    if (!isLoading && !error && data?.data?.data?.count > page * pageSize) {
      setPage((prevPage) => prevPage + 1);
    }
  };

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
            current.value === "dark"
              ? current.backgroundColor
              : current.greyDark,
        }}
      >
        <EText type="r14">{"Group Name"}:</EText>
        <EText type="r14">{item.name}</EText>
        {/* <View style={{ flexDirection: "row" }}>
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
        </View> */}
      </View>
    );
  };

  const handleDelete = async (item: any) => {
    setDeleteModal(false);
    await dispatch(deleteBlockScriptsGroupById({ deleteId: item.id }));
    setTimeout(() => {
      getBlockScriptsGroup({ page, rowPerPage, groupType: "qtyScript" });
    }, 100);
  };

  return (
    <ESafeAreaView>
      <View style={{ flex: 1, backgroundColor: current.backgroundColor }}>
        <EHeader
          title="Quantity Script Group"
          rightIcon={
            <Image
              source={images.BluesharkLogo}
              style={{ height: 50, width: 50 }}
              resizeMode="contain"
            />
          }
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
              data={rowData}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              onEndReached={fetchMoreData}
              onEndReachedThreshold={0.1}
              ListEmptyComponent={ListEmptyComponent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListFooterComponent={
                <RenderFooter isFetchingMore={isFetchingMore.current} />
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
        <AddQuantityGroupModal
          isVisible={show}
          viewData={openTradeModalData}
          page={page}
          rowPerPage={pageSize}
          onDismiss={() => {
            setShow(false), setOpenTradeModalData(undefined);
          }}
        />
      </View>
    </ESafeAreaView>
  );
};

export default QuantityScriptGroup;
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

// export default QuantityScriptGroup;
