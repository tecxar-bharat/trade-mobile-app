import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import EText from "@commonComponents/EText";
import { useAppDispatch, useAppSelector } from "@store/index";
import { socketActions } from "@reducers/socketReducer";
import { colors } from "@themes/index";
// import MenuButton from '@commonComponents/MenuButton';
import { moderateScale } from "@common/constants";
import { themeSelector } from "@reducers/theme.reducer";
import { getAccountById } from "@reducers/userReducer";
import { toNumber } from "@utils/constant";
import { authSelector } from "@reducers/auth.reducer";
import { formatIndianAmount, toFixed } from "@utils/helpers";
import { styles } from "../../themes";
import {
  INifty,
  MarketState,
  marketLocalStateSelector,
} from "@reducers/marketReducer";
import { GlobalDataSegments } from "@interfaces/common";
import images from "@assets/images";
import MenuButton from "@commonComponents/MenuButton";
import Fontisto from "react-native-vector-icons/Fontisto";

const Component = ({
  label,
  marketKey,
}: {
  label: string;
  marketKey: keyof MarketState;
}) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const value = useAppSelector((state) =>
    marketLocalStateSelector(state, marketKey)
  ) as INifty;

  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: 'center',
          gap: 8
        }}
      >
        <EText type="s14" color={current.textColor}>
          {label}
        </EText>
        <EText
          type="r14"
          style={[
            styles.submitandcancel,
            {
              color: current.textColor,
            },
          ]}
        >
          {value.LastTradePrice ? formatIndianAmount(value.LastTradePrice) : 0}
        </EText>
        <EText
          type="r14"
          style={[
            styles.submitandcancel,
            {
              color:
                value.PriceChange >= 0 ? colors.light.green : colors.light.red,
            },
          ]}
        >
          {value.PriceChange >= 0 ? (
            <Fontisto name={"caret-up"} size={15} color={colors.light.green} />
          ) : (
            <Fontisto name={"caret-down"} size={15} color={colors.light.red} />
          )}
          {` ${value.PriceChange ? formatIndianAmount(value.PriceChange) : 0}`}
        </EText>

      </View>


    </View>
  );
};

const RenderNifty = () => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const userData = useAppSelector((state) => authSelector(state, "userData"));

  useEffect(() => {
    dispatch(getAccountById(toNumber(userData && userData?.id))).then(() => {
      dispatch(
        socketActions.getSymbols({
          Exchange: GlobalDataSegments.nseIndex,
          InstrumentIdentifier: "NIFTY BANK",
        })
      );
      dispatch(
        socketActions.getSymbols({
          Exchange: GlobalDataSegments.nseIndex,
          InstrumentIdentifier: "NIFTY 50",
        })
      );
    });
  }, []);

  if (!isFocused) {
    return null;
  }

  return (
    <View
      style={[
        localStyles.container,
        { backgroundColor: current.backgroundColor1 },
      ]}
    >
      <View style={[styles.rowStart, styles.flex]}>
        <MenuButton navigation={navigation} />
        <View>
          <Component label="NIFTY" marketKey="niftyPrice" />
          <Component label="BANK NIFTY" marketKey="bankNiftyPrice" />
        </View>
      </View>

      <TouchableOpacity
        style={{
          height: 40,
          width: 40,
          borderRadius: 20,
        }}
        onPress={() => navigation.openDrawer()}
      >
        <Image
          source={images.userProfile}
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
          }}
        />
      </TouchableOpacity>
    </View>




    // <View
    //   style={{
    //     backgroundColor: current.backgroundColor1,
    //     padding: 8,
    //     borderColor: current.bcolor,
    //   }}
    // >
    //   <View
    //     style={{
    //       justifyContent: "space-between",
    //       flexDirection: "row",
    //     }}
    //   >
    //     <View
    //       style={{
    //         borderColor: current.greyDark,
    //         flex: 1,
    //         borderRightWidth: 0.5,
    //         paddingRight: 5,
    //       }}
    //     >
    //       <Component label="NIFTY" marketKey="niftyPrice" />
    //     </View>
    //     <View
    //       style={{
    //         borderColor: current.greyDark,
    //         borderLeftWidth: 0.5,
    //         flex: 1,
    //         paddingLeft: 5,
    //       }}
    //     >
    //       <Component label="BANK NIFTY" marketKey="bankNiftyPrice" />
    //     </View>
    //   </View>
    // </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    ...styles.rowSpaceBetween,
    ...styles.ph10,
    ...styles.pv10,
    ...styles.center,
  },
  backIcon: {
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  submitandcancel: {
    textAlign: "right",
    color: colors.light.white,
  }
});
export default RenderNifty;
