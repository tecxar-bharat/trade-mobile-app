/* eslint-disable react/react-in-jsx-scope */
import EDivider from "@commonComponents/EDivider";
import ESearchInput from "@commonComponents/ESearchInput";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import GridFilter from "@components/models/ListFilter";
import { INavigation, IPosition } from "@interfaces/common";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  getHoldingList,
  holdingSelector
} from "@store/reducers/holdingReducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { useEffect, useMemo, useState } from "react";
import { RefreshControl, View } from "react-native";
import { FlatList } from "react-native";
import HoldingTopHeader from "./HoldingTopHeader";
import RenderItem from "./RenderItem";
import ELoader from "@commonComponents/ELoader";
import React from "react";
import { useIsFocused } from "@react-navigation/native";

const Holding = ({ navigation }: INavigation) => {
  const [searchFilter, setSearchFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const holdingList = useAppSelector((state) =>
    holdingSelector(state, "holdingList")
  ) as IPosition[];
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [refreshing, setRefreshing] = useState(false);
  const [filterData, setFilterData] = useState({});

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isFocused) {
      setLoading(true)
      dispatch(
        getHoldingList({
          deliveryType: "delivery",
          userId: filterData?.userId!,
          scriptId: filterData?.scriptId,
          segmentId: filterData?.segmentId,
          masterId: filterData?.masterId!,
          adminId: filterData?.adminId!,
          expiryDate: filterData?.expiryDate,
          search: searchFilter,
        })
      ).then(() => {
        setLoading(false);
      })
    }
  }, [filterData, searchFilter, isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(
      getHoldingList({
        deliveryType: "delivery",
        userId: filterData?.userId!,
        scriptId: filterData?.scriptId,
        segmentId: filterData?.segmentId,
        masterId: filterData?.masterId!,
        adminId: filterData?.adminId!,
        expiryDate: filterData?.expiryDate,
        search: searchFilter,
      })
    );
    setLoading(false);
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: IPosition }) => {
    return <RenderItem item={item} navigation={navigation} onRefresh={onRefresh} />;
  };

  const filterControls = useMemo(() => {
    return [
      {
        label: "Position Type",
        name: "all",
        type: "radio",
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
      {
        label: "Position By",
        name: "all1",
        type: "radio",
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
      {
        label: "Admin",
        name: "adminId",
        type: "select",
        clearable: true,
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
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: false,
          user: false,
          broker: false,
        },
      },
      {
        label: "Client",
        name: "userId",
        type: "select",
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: false,
          broker: false,
        },
      },
      {
        label: "Segment",
        name: "segmentId",
        type: "select",
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
      {
        label: "Script",
        name: "scriptId",
        type: "select",
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: true,
          broker: true,
        },
      },
      {
        label: "broker",
        name: "brokerId",
        type: "select",
        clearable: true,
        access: {
          superadmin: true,
          admin: true,
          master: true,
          user: false,
          broker: false,
        },
      },
      {
        label: "EXPIRY DATE",
        name: "expiryDate",
        type: "date",
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

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor1 }}>
      <View
        style={{
          marginTop: holdingList.length > 0 ? 50 : 10,
          flex: 1,
          backgroundColor: current.backgroundColor,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        {isFocused && <View style={{ paddingHorizontal: 16 }}>
          {holdingList.length > 0 && <HoldingTopHeader />}
          <ESearchInput
            placeholder="Search"
            value={searchFilter}
            height={30}
            onChangeText={(text: string) => {
              setSearchFilter(text)
            }}
            rightAccessory={() => (
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <GridFilter handleChangeFilter={setFilterData} defaultValue={filterData} config={filterControls!} title={"Filter By"} />
              </View>
            )}
          />
        </View>}
        <EDivider />
        {loading ?
          <ELoader loading mode="fullscreen" size="medium" />
          : <FlatList
            data={holdingList}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}_${item.userId}_${index}`}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={<ListEmptyComponent message="No Holdings" />}
          />}

      </View>
    </View>
  );
};

export default Holding;
