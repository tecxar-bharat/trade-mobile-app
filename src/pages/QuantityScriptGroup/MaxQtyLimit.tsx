import images from "@assets/images";
import { moderateScale } from "@common/constants";
import EHeader from "@commonComponents/EHeader";
import EInput from "@commonComponents/EInput";
import ESearchInput from "@commonComponents/ESearchInput";
import EText from "@commonComponents/EText";
import { FilterButton } from "@commonComponents/FilterButton";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import DeleteModal from "@components/models/DeleteModal";
import { SCREENS } from "@navigation/NavigationKeys";
import accountService from "@services/account.service";
import blockScriptsService from "@services/blockScripts.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useQuery } from "react-query";
import Ionicons from "react-native-vector-icons/Ionicons";
import IconDelete from "@assets/svgs/IconDelete";
import IconEdit from "@assets/svgs/IconEdit";
const MaxQtyLimit = (props: any) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any | null>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const { data, isLoading, error, refetch } = useQuery(
    ["maxQtyScriptGroups", page, pageSize],
    async () => {
      return await accountService.MaxqtyLimit();
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
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  };
  const isFetchingMore = useRef(false);
  const fetchMoreData = () => {
    if (!isLoading && !error && data?.data?.data?.count > page * pageSize) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const handleDelete = async (item: any) => {
    setDeleteModal(false);
    await blockScriptsService.deleteBlockScriptsGroupById(item?.id);
    setTimeout(() => {
      refetch();
    }, 500);
  };
  const renderItem = ({ item }: any) => {
    return (
      <View
        style={{
          backgroundColor: current.backgroundColor,
          padding: 10,
          borderBottomWidth: 1,
          flexDirection: "row",
          borderColor:
            current.value === "dark" ? current.backgroundColor : current.bcolor,
        }}
      >
        <EText type="m16">{item?.name}</EText>
        <View
          style={{ flexDirection: "row", justifyContent: "flex-end", flex: 1 }}
        >
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate(SCREENS.EditQuantityScriptGroup, {
                viewData: item,
              });
            }}
            style={{ marginRight: 10 }}
          >
            <IconEdit color={current.blue} />
          </TouchableOpacity>
          {/* {["superadmin", "admin", "master"].includes(item?.role) && ( */}
          <TouchableOpacity
            onPress={() => {
              setDeleteModal(true), setDeleteItem(item);
            }}
          >
            <IconDelete color={current.red} />
          </TouchableOpacity>
          {/* )} */}
        </View>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      <View
        style={{
          marginTop: 30,
          flex: 1,
          backgroundColor: current.backgroundColor,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <EInput
              placeHolder={"Search"}
              keyBoardType={"default"}
              placeholderStyle={{ color: current.red, top: 0 }}
              value={search}
              height={30}
              onChangeText={(text) => setSearch(text)}
              rightAccessory={() => (
                <FilterButton
                  type={"plus"}
                  onPress={() => props.navigation.navigate(SCREENS.Form)}
                />
              )}
              insideLeftIcon={() => (
                <Ionicons
                  name="search"
                  size={moderateScale(20)}
                  color={current.greyDark}
                />
              )}
              inputContainerStyle={[
                {
                  backgroundColor: current.backgroundColor,
                  borderColor:
                    current.value === "light" ? current.bcolor : current.bcolor,
                  borderWidth: 1,
                  marginTop: -30,
                },
              ]}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={
              search
                ? rowData.filter((e) =>
                    e.name.toLowerCase().match(search.toLowerCase())
                  )
                : rowData
            }
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            onEndReached={fetchMoreData}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={
              <RenderFooter isFetchingMore={isFetchingMore.current} />
            }
          />
        </View>
        <DeleteModal
          onPress={() => handleDelete(deleteItem)}
          visible={deleteModal}
          title="Delete"
          message="Are you sure you want to delete trade?"
          onBackdropPress={() => setDeleteModal(false)}
          onDismiss={() => setDeleteModal(false)}
        />
      </View>
    </View>
  );
};
export default MaxQtyLimit;
