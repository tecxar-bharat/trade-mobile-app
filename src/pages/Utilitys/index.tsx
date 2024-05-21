/* eslint-disable react/react-in-jsx-scope */
import { getWidth, moderateScale } from "@common/constants";
import EHeader from "@components/common/EHeader";
import EInput from "@components/common/EInput";
import EText from "@components/common/EText";
import MenuButton from "@components/common/MenuButton";
import { INavigation } from "@interfaces/common";
import { colors } from "@themes/index";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Utilitys = ({ navigation }: INavigation) => {
  const dummyData = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
  return (
    <View>
      {/* <EHeader /> */}
      <EHeader
        title="Utilitys"
        isLeftIcon={<MenuButton navigation={navigation} />}
        isHideBack={true}
      />
      <View style={localStyles.SearchAndFilterContainer}>
        <EInput
          placeHolder={"search"}
          keyBoardType={"default"}
          // _value={search}
          insideLeftIcon={() => (
            <Ionicons name="search" size={moderateScale(20)} color="black" />
          )}
          // toGetTextFieldValue={(e: string) => dispatch(setSearch(e))}
          inputContainerStyle={[
            { backgroundColor: "white" },
            localStyles.SearchBarContainer,
          ]}
        />
        <View style={localStyles.optionsContainer}>
          <Ionicons
            name="options-outline"
            size={moderateScale(30)}
            color={"white"}
          />
        </View>
      </View>

      <FlatList
        data={dummyData}
        renderItem={() => {
          return (
            <View
              style={{
                // borderWidth: 1,
                // height: moderateScale(50),
                marginHorizontal: 10,
                marginVertical: 5,
                borderRadius: 10,
                elevation: 5,
                backgroundColor: "white",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                alignItems: "center",
              }}
            >
              <View>
                <EText type="m16">Alison Berry</EText>
                <EText style={{ color: "gray" }}>On 22 Feb, 2023</EText>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <EText type="m16">LN45893</EText>
                <EText style={{ color: "gray" }}>For 23 Mar, 2023</EText>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Utilitys;

const localStyles = StyleSheet.create({
  SearchBarContainer: {
    borderRadius: 15,
    width: getWidth(320),
    // marginLeft: 15,
    // height: 50,
    flex: 1,
  },
  optionsContainer: {
    backgroundColor: colors.dark.new_primary,
    borderRadius: 10,
    height: moderateScale(40),
    width: moderateScale(40),
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  SearchAndFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 1,
  },
});
