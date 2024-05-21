/* eslint-disable react/react-in-jsx-scope */
import EListLayout from "@commonComponents/EListLayout";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  DashboardState,
  dashboardSelector,
  getCompletedTrades,
  getPendingTrades,
  getRejectedTrades,
} from "@store/reducers/dashboard.reducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import RenderItem from "./RenderItem";
import React = require("react");

const DashboardComponent = ({ type }: { type: keyof DashboardState }) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<any>({});
  const dispatch = useAppDispatch();

  const { rows } = useAppSelector((state) => dashboardSelector(state, type));

  const renderItem = ({ item }: any) => {
    return (
      <RenderItem item={item} setExpanded={setExpanded} expanded={expanded} />
    );
  };

  useEffect(() => {
    if (type === "completed") {
      dispatch(getCompletedTrades());
    } else if (type === "pending") {
      dispatch(getPendingTrades());
    } else if (type === "rejected") {
      dispatch(getRejectedTrades());
    }
  }, [type]);

  return (
    <EListLayout onSearch={setSearch}>
      <FlatList
        data={
          search
            ? rows.filter((e) =>
                e.script?.name.toLowerCase().includes(search.toLowerCase())
              )
            : rows
        }
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        refreshControl={
          <RefreshControl
            tintColor={"#4885ED"}
            refreshing={loading}
            onRefresh={async () => {
              setLoading(true);
              if (type === "completed") {
                await dispatch(getCompletedTrades());
              } else if (type === "pending") {
                await dispatch(getPendingTrades());
              } else if (type === "rejected") {
                await dispatch(getRejectedTrades());
              }
              setLoading(false);
            }}
          />
        }
        ListEmptyComponent={ListEmptyComponent}
      />
    </EListLayout>
  );
};

export default DashboardComponent;
