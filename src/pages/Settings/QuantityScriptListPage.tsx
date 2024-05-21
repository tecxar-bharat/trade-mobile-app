// Library Imports
import EHeader from "@commonComponents/EHeader";
import ESafeAreaView from "@commonComponents/ESafeAreaView";
import EText from "@commonComponents/EText";
import {
  blockedScriptsSelector,
  getQuantityScriptsofUsers,
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
import DeleteModal from "@components/models/DeleteModal";
import QuantityScriptsModal from "@components/models/QuantityScriptsModal";
import { IAccount } from "@interfaces/account.interface";
import { themeSelector } from "@reducers/theme.reducer";
import { deleteUsersSegmentBrokerageLotsEntry } from "@store/reducers/userReducer";
import { getLastNineWeeksDates } from "@utils/constant";
import { useForm } from "react-hook-form";
import Ionicons from "react-native-vector-icons/Ionicons";
const QuantityScriptList = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const dispatch = useAppDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [show, setShow] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any | null>(null);
  const [openTradeModalData, setOpenTradeModalData] = useState<IAccount>();
  const [search, setSearchStr] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState();
  const quantityScriptsofUserList = useAppSelector((state) =>
    blockedScriptsSelector(state, "quantityScriptsofUserList")
  );
  const { getValues } = useForm<any>({
    defaultValues: {
      valanId: getLastNineWeeksDates()[getLastNineWeeksDates().length - 2].date,
      startDate:
        getLastNineWeeksDates()[getLastNineWeeksDates().length - 2].start_date,
      endDate:
        getLastNineWeeksDates()[getLastNineWeeksDates().length - 2].end_date,
    },
    mode: "onChange",
  });

  useEffect(() => {
    dispatch(
      getQuantityScriptsofUsers({
        userId: filteredData?.userId,
        scriptId: filteredData?.scriptId,
      })
    );
  }, [filteredData]);

  useEffect(() => {
    if (getValues("userId")) {
      dispatch(
        getQuantityScriptsofUsers({
          userId:
            getValues("userId") ??
            getValues("masterId") ??
            getValues("adminId"),
          scriptId: getValues("scriptId"),
        })
      );
    }
  }, []);
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
        <View>
          <EText type="r14">UId:-{item.userName}</EText>
          <EText type="r14">Script:-{item.scriptName}</EText>
        </View>
        <View>
          <EText type="r14">Qty:-{item.qty}</EText>
          <EText type="r14">MQty:-{item.maxQty}</EText>
        </View>
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

  const handleDelete = async (item: any) => {
    setDeleteModal(false);
    await dispatch(deleteUsersSegmentBrokerageLotsEntry({ deleteId: item.id }));
    setTimeout(() => {
      dispatch(
        getQuantityScriptsofUsers({
          userId:
            getValues("userId") ??
            getValues("masterId") ??
            getValues("adminId"),
          scriptId: getValues("scriptId"),
        })
      );
    }, 100);
  };
  const onCallFilter = (filterData: any) => {
    setFilteredData(filterData);
  };

  return (
    <ESafeAreaView>
      <View style={{ flex: 1, backgroundColor: current.backgroundColor }}>
        <EHeader
          title="Quantity Scripts"
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
              data={quantityScriptsofUserList[0]?.totalScripts}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              refreshControl={
                <RefreshControl
                  tintColor={"#4885ED"}
                  refreshing={loading}
                  onRefresh={() => {
                    setTimeout(() => {
                      setLoading(true);
                      dispatch(
                        getQuantityScriptsofUsers({
                          userId:
                            getValues("userId") ??
                            getValues("masterId") ??
                            getValues("adminId"),
                          scriptId: getValues("scriptId"),
                        })
                      );
                      setLoading(false);
                    }, 500);
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
        <QuantityScriptsModal
          isVisible={show}
          viewData={openTradeModalData}
          onDismiss={() => {
            setShow(false), setOpenTradeModalData(undefined);
          }}
          onFilter={(filterData: any) => onCallFilter(filterData)}
        />
      </View>
    </ESafeAreaView>
  );
};

export default QuantityScriptList;
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

// export default QuantityScriptList;
