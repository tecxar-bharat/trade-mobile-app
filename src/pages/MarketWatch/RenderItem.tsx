import EText from "@commonComponents/EText";
import BuySellModal from "@components/models/BuySellModal";
import { LoggedUser } from "@db/schemas/loggedUser.model";
import { SegmentSlugTypes, SegmentTypes } from "@interfaces/common";
import { NavigationProp } from "@react-navigation/native";
import {
  marketSelector,
  setCurrentSymbol,
  unSubscribeSymbol,
} from "@reducers/marketReducer";
import { socketActions } from "@reducers/socketReducer";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppDispatch, useAppSelector } from "@store/index";
import { colors } from "@themes/index";
import {
  formatIndianAmount,
  getSymbolNameFromIdentifier,
  isBlank,
} from "@utils/helpers";
import React, { Fragment } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";

const PriceChange = (props: {
  symbol: string;
  segmentType: SegmentSlugTypes;
}) => {
  const { segmentType, symbol } = props;
  const current = useAppSelector((state) => themeSelector(state, "current"));

  let PriceChangePercentage = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "PriceChangePercentage")
  );
  let value = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "PriceChange")
  );

  if (isBlank(value)) {
    value = 0;
  }

  if (isBlank(PriceChangePercentage)) {
    PriceChangePercentage = 0;
  }

  // const PriceChangeWithPercentage = `${formatIndianAmount(
  //   value
  // )} (${PriceChangePercentage.toFixed(2)})`;
  const PriceChangeWithPercentage = `${formatIndianAmount(
    value
  )} (${PriceChangePercentage.toFixed(2)}%)`;

  return (
    <EText
      type="r14"
      style={[
        styles.watchlisttext,
        {
          color:
            parseFloat(PriceChangePercentage) >= 0
              ? current.green
              : current.red,
        },
      ]}
    >
      {`${PriceChangeWithPercentage}`}
    </EText>
  );
};

const LTPComponent = (props: {
  symbol: string;
  segmentType: SegmentSlugTypes;
}) => {
  const { segmentType, symbol } = props;
  let value = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "LastTradePrice")
  );
  const current = useAppSelector((state) => themeSelector(state, "current"));

  if (isBlank(value)) {
    value = "";
  }

  return (
    <EText style={[styles.flexEnd]}>
      <EText
        type="r14"
        style={[styles.flexEnd]}
        // color={value < 0 ? current.red : current.green}
        color={current.textColor}
      >
        {" "}
        {formatIndianAmount(value)}
      </EText>
    </EText>
  );
};

const RenderItem = ({
  item: symbol,
  deleteBtn,
  setDeleteBtn,
  segmentType,
  Exchange,
  navigation,
  segment,
}: {
  item: string;
  deleteBtn: boolean;
  setDeleteBtn: (val: boolean) => void;
  segmentType: SegmentSlugTypes;
  Exchange: SegmentTypes;
  segment: string;
  navigation: NavigationProp<any>;
}) => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const userData = LoggedUser.getActiveUser(globalThis.realm);

  const onView = () => {
    if (userData && userData.role && userData.role.slug !== "broker") {
      dispatch(setCurrentSymbol(symbol));
    }
  };

  const deleteList = async () => {
    await dispatch(
      socketActions.unsubscribe({
        Exchange: Exchange,
        InstrumentIdentifier: symbol,
      })
    );
    dispatch(
      unSubscribeSymbol({
        Exchange: Exchange,
        InstrumentIdentifier: symbol,
      })
    );
  };
  let type = segmentType.toUpperCase().split("_")[0];
  return (
    <Fragment>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {deleteBtn ? (
          <TouchableOpacity
            onPress={() => deleteList()}
            style={{ marginLeft: 10 }}
          >
            <Entypo
              name="circle-with-cross"
              color={colors.light.red}
              size={28}
            />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={[
            styles.card,
            {
              flex: 1,
              backgroundColor: current.backgroundColor,
              borderBottomWidth: 1,
              borderColor:
                current.value === "dark" ? current.bcolor : current.bcolor,
            },
          ]}
          onLongPress={() => {
            setDeleteBtn(!deleteBtn);
          }}
          delayLongPress={1500}
          onPress={() => {
            if (deleteBtn) {
              setDeleteBtn(false);
            } else {
              onView();
            }
          }}
        >
          <View
            style={[
              styles.flex1,
              {
                padding: 5,
                flex: 1,
              },
            ]}
          >
            <EText
              type="r14"
              style={{
                color: current.textColor,
              }}
            >
              {getSymbolNameFromIdentifier(symbol)}
            </EText>
            <EText
              type="r12"
              style={{
                paddingTop: 5,
                color: current.greyText,
              }}
            >
              {segment}
            </EText>
            {/* <PriceChange symbol={symbol} segmentType={segmentType} /> */}
          </View>
          {/* <View style={[styles.flex1, { alignItems: "center" }]}>
            <LowComponent segmentType={segmentType} symbol={symbol} />
            <BuyComponent segmentType={segmentType} symbol={symbol} />
            <QtyComponent segmentType={segmentType} symbol={symbol} />
          </View> */}
          <View
            style={{
              alignItems: "flex-end",
              padding: 5,
              justifyContent: "space-between",
            }}
          >
            {/* <HighComponent segmentType={segmentType} symbol={symbol} /> */}
            {/* <SellComponent segmentType={segmentType} symbol={symbol} /> */}
            <LTPComponent segmentType={segmentType} symbol={symbol} />
            <PriceChange symbol={symbol} segmentType={segmentType} />
          </View>
        </TouchableOpacity>
      </View>

      <BuySellModal
        symbol={symbol}
        segmentType={segmentType}
        navigation={navigation}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: 5,
    paddingBottom: 3,
    flexDirection: "row",
  },
  watchlisttext: {
    padding: 2,
    textAlign: "center",
  },
  flexEnd: {
    padding: 1,
    paddingHorizontal: 5,
  },
  watchlistfont16: {
    color: colors.light.textColor,
  },
  input: {
    color: colors.light.textColor,
    height: 40,
  },

  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowEnd: {
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  flex1: {
    flex: 1,
  },
});
export default RenderItem;
