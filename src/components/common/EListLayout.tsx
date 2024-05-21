/* eslint-disable react/react-in-jsx-scope */
import { moderateScale } from "@common/constants";
import ESearchInput from "@commonComponents/ESearchInput";
import GridFilter from "@components/models/ListFilter";
import { IFilter, IFilterConfig } from "@interfaces/common";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { ReactNode, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import EText from "./EText";

interface IProps {
  children: ReactNode;
  onSearch?: (text: string) => void;
  handleChangeFilter?: (filter: any) => void;
  config?: IFilterConfig[];
  defaultValue?: IFilter;
  filterTitle?: string;
  onAddNew?: () => void;
  addButtonLabel?: string;
  setPage?: (page: number) => void;
}

const AddButton = ({
  onPress,
  label,
  style,
}: {
  onPress: () => void;
  label?: string;
  style?: ViewStyle;
}) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: current.primary,
          minHeight: 40,
          minWidth: 40,
          borderTopRightRadius: 6,
          borderBottomRightRadius: 6,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
      onPress={onPress}
    >
      {label ? (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            paddingHorizontal: 8,
            gap: 4,
          }}
        >
          <AntDesign
            name="plus"
            size={moderateScale(18)}
            color={current.white}
          />
          <EText type="r14" color={current.white}>
            {label}
          </EText>
        </View>
      ) : (
        <AntDesign name="plus" size={moderateScale(22)} color={current.white} />
      )}
    </TouchableOpacity>
  );
};

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const EListLayout = (props: IProps) => {
  const {
    onSearch,
    children,
    handleChangeFilter,
    config,
    defaultValue,
    filterTitle,
    setPage,
    onAddNew,
    addButtonLabel,
  } = props;
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [search, setSearch] = useState("");
  const debouncedInputValue = useDebounce(search, 500);

  useEffect(() => {
    if (onSearch) {
      if (setPage) {
        setPage(1);
      }
      onSearch(debouncedInputValue);
    }
  }, [debouncedInputValue]);

  const onChangeFilter = (filter: IFilter) => {
    if (setPage) {
      setPage(1);
    }
    if (handleChangeFilter) {
      handleChangeFilter(filter);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: current.backgroundColor1,
      }}
    >
      {onSearch ? (
        <View
          style={{
            flex: 1,
            backgroundColor: current.backgroundColor,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            marginTop: 35,
          }}
        >
          <View style={localStyles.SearchAndFilterContainer}>
            <ESearchInput
              placeholder="Search"
              value={search}
              height={40}
              onChangeText={(text: string) => {
                setSearch(text);
              }}
              {...((handleChangeFilter || onAddNew) && {
                rightAccessory: () => (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: handleChangeFilter && onAddNew ? 4 : 0,
                    }}
                  >
                    {handleChangeFilter && (
                      <GridFilter
                        handleChangeFilter={onChangeFilter}
                        defaultValue={defaultValue}
                        config={config!}
                        title={filterTitle ?? "Filter By"}
                        {...(onAddNew && { style: { borderRadius: 6 } })}
                      />
                    )}
                    {onAddNew && (
                      <AddButton
                        onPress={onAddNew}
                        label={addButtonLabel}
                        {...(handleChangeFilter && {
                          style: { borderRadius: 6 },
                        })}
                      />
                    )}
                  </View>
                ),
              })}
            />
          </View>
          {children}
        </View>
      ) : handleChangeFilter || onAddNew ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              justifyContent: "flex-end",
              padding: 8,
            }}
          >
            {handleChangeFilter && (
              <GridFilter
                handleChangeFilter={onChangeFilter}
                defaultValue={defaultValue}
                config={config!}
                title={filterTitle ?? "Filter By"}
                style={{ borderRadius: 6 }}
              />
            )}
            {onAddNew && (
              <AddButton
                onPress={onAddNew}
                label={addButtonLabel}
                style={{ borderRadius: 6 }}
              />
            )}
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: current.backgroundColor,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              paddingTop: 10,
            }}
          >
            {children}
          </View>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: current.backgroundColor,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            paddingTop: 10,
            marginTop: 15,
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
};

export default EListLayout;

const localStyles = StyleSheet.create({
  SearchAndFilterContainer: {
    paddingHorizontal: 20,
    height: 50,
    marginTop: -30,
    marginVertical: 10,
  },
});
