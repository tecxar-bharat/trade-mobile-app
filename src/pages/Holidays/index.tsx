import EHeader from "@commonComponents/EHeader";
import EListLayout from "@commonComponents/EListLayout";
import ELoader from "@commonComponents/ELoader";
import EText from "@commonComponents/EText";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { RenderFooter } from "@commonComponents/ListFooterComponents";
import { IHoliday } from "@interfaces/account.interface";
import holidaysService from "@services/holidays.service";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { getDayName } from "@utils/constant";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { useQuery } from "react-query";
import IconDelete from "@assets/svgs/IconDelete";
import { SCREENS } from "@navigation/NavigationKeys";
import DeleteModal from "@components/models/DeleteModal";
import { useFocusEffect } from "@react-navigation/native";
const Holidays = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [filteredData, setFilteredData] = useState<any>({});
  const [fetchMoreLoading, setFetchMoreLoading] = useState(true);
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [rowData, setRowData] = useState<IHoliday[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any | null>(null);

  const filterControls = useMemo(() => {
    return [
      {
        label: "Select Market",
        name: "segmentId",
        type: "select",
        clearable: true,
        options: [
          {
            value: 1,
            label: "NSE",
          },
          {
            value: 3,
            label: "MCX",
          },
        ],
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

  const { data, isLoading, error, refetch } = useQuery(
    ["holidays", page, pageSize, filteredData],
    async () => {
      return await holidaysService.getAllHoliday(
        filteredData?.segmentId,
        page,
        pageSize,
        true
      );
    }
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
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

  const fetchMoreData = () => {
    if (!isLoading && !error && data?.data?.data?.count > page * pageSize) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const onRefresh = () => {
    setPage(1);
    refetch();
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

  const handleDelete = async (item: any) => {
    setDeleteModal(false);
    await holidaysService.delete(item?.id);
    setTimeout(() => {
      refetch();
    }, 500);
  };
  const renderItem = ({ item }: any) => {
    return (
      <>
        <View
          style={{
            backgroundColor: current.backgroundColor,
            padding: 10,
            borderBottomWidth: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            borderColor: current.bcolor,
          }}
        >
          <View style={{ flex: 1, gap: 5 }}>
            <EText type="m16" style={{ textTransform: "capitalize" }}>
              {item?.segmentName}
            </EText>
            <EText type="r14" style={{ color: current.textColor, flex: 1 }}>
              {item?.name}
            </EText>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                gap: 10,
                alignItems: "flex-end",
              }}
            >
              <View
                style={{
                  backgroundColor: item?.firstSession
                    ? current.blue
                    : current.redBg,
                  flex: 1,
                  maxHeight: 10,
                  minHeight: 10,
                }}
              />
              <View
                style={{
                  backgroundColor: item?.secondSession
                    ? current.blue
                    : current.redBg,
                  flex: 1,
                  maxHeight: 10,
                  minHeight: 10,
                }}
              />
            </View>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              flex: 1,
              gap: 5,
              justifyContent: "space-between",
            }}
          >
            <EText
              type="m14"
              style={{ textTransform: "capitalize", color: current.greyText }}
            >
              {item?.date}
            </EText>
            <EText
              type="m14"
              style={{ textTransform: "capitalize", color: current.greyText }}
            >
              {getDayName(item?.date)}
            </EText>
            <TouchableOpacity
              onPress={() => {
                setDeleteModal(true), setDeleteItem(item);
              }}
            >
              <IconDelete color={current.red} />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      <EHeader title="Holidays" />

      <EListLayout
        addButtonLabel="Add"
        config={filterControls}
        defaultValue={filteredData}
        handleChangeFilter={setFilteredData}
        onAddNew={() => navigation.navigate(SCREENS.AddHolidays)}
      >
        {loading ? (
          <ELoader loading={true} size="medium" mode={"fullscreen"} />
        ) : (
          <FlatList
            data={rowData}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            onEndReached={fetchMoreData}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={ListEmptyComponent}
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
      <DeleteModal
        onPress={() => handleDelete(deleteItem)}
        visible={deleteModal}
        title="Delete"
        deleteLabel="Holiday?"
        onBackdropPress={() => setDeleteModal(false)}
        onDismiss={() => setDeleteModal(false)}
      />
    </View>
  );
};
export default Holidays;
