import { moderateScale } from "@common/constants";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import React from "react";
import { StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import EInput from "./EInput";

const ESearchInput = ({
  placeholder,
  value,
  onChangeText,
  inputContainerStyle,
  keyBoardType,
  name,
  ...rest
}: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  return (
    <EInput
      name={name}
      placeholder={placeholder}
      keyBoardType={keyBoardType}
      value={value}
      onChangeText={onChangeText}
      insideLeftIcon={() => <Ionicons name="search" size={moderateScale(20)} color={current.textColor} />}
      height={30}
      inputContainerStyle={[
        {
          backgroundColor: current.backgroundColor,
          borderWidth: 1,
        },
        styles.SearchBarContainer,
      ]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 9,
    // paddingVertical: 3,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 20,
  },
  SearchBarContainer: {
    elevation: 5,
    borderRadius: 9,
  },
});

export default ESearchInput;
