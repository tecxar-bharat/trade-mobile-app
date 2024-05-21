import images from "@assets/images";
import { moderateScale } from "@common/constants";
import EHeader from "@commonComponents/EHeader";
import EInput from "@commonComponents/EInput";
import ELoader from "@commonComponents/ELoader";
import ESearchInput from "@commonComponents/ESearchInput";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import MasterUserModal from "@components/models/MasterUserModal";
import { INavigation } from "@interfaces/common";
import { themeSelector } from "@reducers/theme.reducer";
import cashBookService from "@services/cashBook.service";
import { useAppSelector } from "@store/index";
import { formatIndianAmount } from "@utils/helpers";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useQuery } from "react-query";
const DepositLedger = ({ navigation }: INavigation) => {
  // const { data, page, rowPerPage, totalCount, fetchMoreLoading, loading } =
  //   useAppSelector((state) =>
  //     cashBookSelector(state, "AllUsersCashLedgersList")
  //   );

  // const AdminId = useAppSelector((state) => ledgerSelector(state, "AdminId"));
  // const MasterId = useAppSelector((state) => ledgerSelector(state, "MasterId"));
  // const UserId = useAppSelector((state) => ledgerSelector(state, "UserId"));
  // const [filteredData, setFilteredData] = useState();
  // const [search, setSearchStr] = useState("");
  // const [show, setShow] = useState(false);
  // const current = useAppSelector((state) => themeSelector(state, "current"));
  // const userData = useAppSelector((state) => authSelector(state, "userData"));

  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(getAdminNameList());
  // }, []);

  // useEffect(() => {
  //   if (userData?.role.slug === "broker") {
  //     dispatch(getUserNameList({ userId: userData.id }));
  //   }
  // }, []);

  // useEffect(() => {
  //   if (userData?.role.slug === "user") {
  //     dispatch(
  //       getAllUsersCashLedgers({
  //         page,
  //         rowPerPage,
  //         entryType: "cashDeposit",
  //       })
  //     );
  //   }
  // }, [page, rowPerPage]);
  // useEffect(() => {
  //   if (UserId) {
  //     dispatch(
  //       getAllUsersCashLedgers({
  //         page,
  //         rowPerPage,
  //         userId: UserId,
  //         entryType: "cashDeposit",
  //       })
  //     );
  //   } else if (MasterId) {
  //     dispatch(
  //       getAllUsersCashLedgers({
  //         page,
  //         rowPerPage,
  //         userId: MasterId,
  //         entryType: "cashDeposit",
  //       })
  //     );
  //   } else if (AdminId) {
  //     dispatch(
  //       getAllUsersCashLedgers({
  //         page,
  //         rowPerPage,
  //         userId: AdminId,
  //         entryType: "cashDeposit",
  //       })
  //     );
  //   } else {
  //     dispatch(flushState());
  //     dispatch(
  //       getAllUsersCashLedgers({
  //         page,
  //         rowPerPage,
  //         userId: undefined,
  //         entryType: "cashDeposit",
  //       })
  //     );
  //   }
  // }, [page, rowPerPage, UserId, MasterId, AdminId]);
  // useEffect(() => {
  //   if (userData?.role.slug === "admin") {
  //     dispatch(getMasterNameList({}));
  //   } else if (AdminId) {
  //     dispatch(getMasterNameList({ userId: AdminId }));
  //   } else {
  //     dispatch(clearMasterList());
  //     dispatch(clearUserList());
  //     dispatch(flushState());
  //     dispatch(
  //       getAllUsersCashLedgers({
  //         page,
  //         rowPerPage,
  //         userId: undefined,
  //         entryType: "cashDeposit",
  //       })
  //     );
  //   }
  // }, [AdminId]);
  // useEffect(() => {
  //   if (userData?.role.slug === "master") {
  //     dispatch(getUserBrokerNameList({}));
  //   } else if (MasterId) {
  //     dispatch(getUserBrokerNameList({ userId: MasterId }));
  //   } else {
  //     dispatch(clearUserList());
  //     dispatch(
  //       getAllUsersCashLedgers({
  //         page,
  //         rowPerPage,
  //         userId: undefined,
  //         entryType: "cashDeposit",
  //       })
  //     );
  //   }
  // }, [MasterId]);

  // useEffect(() => {
  //   dispatch(
  //     getAllUsersCashLedgers({
  //       page,
  //       rowPerPage,
  //       userId:
  //         filteredData?.UserId ??
  //         filteredData?.MasterId ??
  //         filteredData?.AdminId,
  //       entryType: "cashDeposit",
  //     })
  //   );
  // }, [filteredData]);

  // const fetchMore = () => {
  //   if (totalCount > page * rowPerPage) {
  //     dispatch(updatePage(page + 1));
  //   }
  // };
  const [show, setShow] = useState(false);
  const [filteredData, setFilteredData] = useState();
  const [search, setSearchStr] = useState("");
  const onCallFilter = async (filterData: any) => {
    setFilteredData(filterData);
  };
  const [rowData, setRowData] = useState<any[]>([]);
  console.log("rowData", rowData);
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, error, refetch } = useQuery(
    ["depositLedger", page, pageSize],
    async () => {
      return await cashBookService.getAllUsersCashLedgers(page, pageSize);
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
  const renderItem = ({ item }: any) => {
    return (
      <>
        {!item?.isExtraRow ? (
          <View
            style={{
              marginVertical: 2,
              borderRadius: 10,
              elevation: 5,
              backgroundColor: current.backgroundColor,
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
              alignItems: "center",
              borderWidth: 1,
              borderColor:
                current.value === "dark"
                  ? current.backgroundColor
                  : current.bcolor,
            }}
            key={item?.user?.id}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
              }}
            >
              <View style={{ width: 100 }}>
                <EText type="m16">{item?.adminName}</EText>
                <EText type="r14" style={{ color: current.greyDark }}>
                  {item?.masterName}
                </EText>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <EText type="b16">{item?.user?.name}</EText>
              </View>
              <View
                style={{
                  width: 110,
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <EText type="s16" color={current.green}>
                  {formatIndianAmount(item?.balance)}
                </EText>
              </View>
            </View>
          </View>
        ) : null}
      </>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: current.backgroundColor,
        marginTop: 30,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
      }}
    >
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <View style={localStyles.SearchAndFilterContainer}>
          <View style={{ flex: 1, marginTop: -30 }}>
            <ESearchInput
              placeholder="Search"
              value={search}
              onChangeText={(text) => setSearchStr(text)}
            />
          </View>
          {/* <View>
            <TouchableOpacity
              style={{
                backgroundColor: current.primary,
                marginLeft: 5,
                borderRadius: 9,
                padding: 5,
              }}
              onPress={() => setShow(!show)}
            >
              <Ionicons
                name="options-outline"
                color={current.white}
                size={moderateScale(21)}
              />
            </TouchableOpacity>
          </View> */}
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
            data={
              search
                ? rowData.filter((e) =>
                  e?.adminName.toLowerCase().includes(search.toLowerCase())
                )
                : rowData
            }
            renderItem={renderItem}
            keyExtractor={(item) => `${item?.user?.id}`}
            ListEmptyComponent={ListEmptyComponent}
            onEndReached={fetchMoreData}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              <RenderFooter isFetchingMore={isFetchingMore.current} />
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      </View>
      <MasterUserModal
        visible={show}
        onDismiss={() => setShow(false)}
        title={"Filter Data"}
        type={"Deposit Ledger"}
        onFilter={(filterData: any) => onCallFilter(filterData)}
      />
    </View>
  );
};
export default DepositLedger;
const localStyles = StyleSheet.create({
  SearchBarContainer: {
    borderRadius: 9,
  },
  SearchAndFilterContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
});
