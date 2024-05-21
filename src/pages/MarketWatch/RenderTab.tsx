import RenderItem from "@pages/MarketWatch/RenderItem";
import { NavigationProp } from "@react-navigation/native";
import { FlashList as FlatList } from "@shopify/flash-list";
import { useAppDispatch, useAppSelector } from "@store/index";
import React, { useEffect, useState } from "react";
// import MenuButton from '@commonComponents/MenuButton';
import { SCREENS } from "@navigation/NavigationKeys";
// import { RenderThemeIcon } from '@navigation/Type/CustomDrawerContent';
import EListLayout from "@commonComponents/EListLayout";
import ListEmptyComponent from "@commonComponents/ListEmptyComponent";
import { SegmentSlugTypes, SegmentTypes } from "@interfaces/common";
import { IPosition } from "@interfaces/index";
import { authSelector } from "@reducers/auth.reducer";
import { marketListSelector, setQtyByPosition } from "@reducers/marketReducer";
import { positionSelector } from "@reducers/positionReducer";
import { themeSelector } from "@reducers/theme.reducer";

interface IProps {
  navigation: NavigationProp<any>;
  segmentType: SegmentSlugTypes;
  Exchange: SegmentTypes;
  segment: string;
}
interface IItem {
  index: number;
  item: string;
}

const RenderTab = ({ navigation, segmentType, Exchange, segment }: IProps) => {
  const [deleteBtn, setDeleteBtn] = useState(false);
  const list = useAppSelector((state) =>
    marketListSelector(state, segmentType)
  );
  const [search, setSearch] = useState("");
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const positionList = useAppSelector((state) =>
    positionSelector(state, "positionList")
  ) as IPosition[];
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userData?.role.slug === "user") {
      dispatch(setQtyByPosition({ positions: positionList, segmentType }));
    }
  }, [positionList]);

  const renderItem = ({ item }: IItem) => {
    return (
      <RenderItem
        item={item}
        segmentType={segmentType}
        deleteBtn={deleteBtn}
        setDeleteBtn={(val: boolean) => {
          setDeleteBtn(val);
        }}
        Exchange={Exchange}
        navigation={navigation}
        segment={segment}
      />
    );
  };

  return (
    <EListLayout
      onSearch={setSearch}
      onAddNew={() =>
        navigation.navigate(SCREENS.Script, { segmentType, list })
      }
    >
      <FlatList
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}`}
        data={
          search
            ? list.filter((item) =>
                item.toLowerCase().includes(search.toLowerCase())
              )
            : list
        }
        {...(deleteBtn && { extraData: deleteBtn })}
        // contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={50}
        ListEmptyComponent={
          <ListEmptyComponent message="There is no symbols" />
        }
      />
    </EListLayout>
  );
};

export default RenderTab;
