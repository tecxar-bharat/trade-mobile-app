import React from "react";
import { StyleSheet, View } from "react-native";

import EButton from "@commonComponents/EButton";
import EText from "@commonComponents/EText";
import { SegmentSlugTypes } from "@interfaces/common";
import { SCREENS } from "@navigation/NavigationKeys";
import { NavigationProp } from "@react-navigation/native";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  marketLocalStateSelector,
  marketRowSelector,
  marketSelector,
  setCurrentSymbol,
} from "@store/reducers/marketReducer";
import { styles } from "@themes/index";
import {
  formatIndianAmount,
  getSymbolNameFromIdentifier,
} from "@utils/helpers";
import Modal from "react-native-modal";

export interface IViewData {
  label: string;
  value: any;
}
interface CommonModalInterface {
  segmentType: SegmentSlugTypes;
  symbol: string;
  navigation: NavigationProp<any>;
}

const TradeAddComponent = (
  props: CommonModalInterface & { navigation: NavigationProp<any> }
) => {
  const { segmentType, symbol, navigation } = props;

  let Ltp = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "LastTradePrice")
  );
  let Low = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "Low")
  );
  let High = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "High")
  );
  let PriceChangePercentage = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "PriceChangePercentage")
  );
  let value = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "PriceChange")
  );
  const PriceChangeWithPercentage = `${formatIndianAmount(
    value
  )} (${PriceChangePercentage.toFixed(2)}%)`;

  const BuyPriceChange = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "BuyPriceChange")
  );
  let BuyPriceChangevalue = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "BuyPrice")
  );
  let SellPriceChangevalue = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "SellPrice")
  );
  const SellPriceChange = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "SellPriceChange")
  );

  const dispatch = useAppDispatch();

  const currentRow = useAppSelector((state) =>
    marketRowSelector(state, segmentType, symbol)
  );

  const current = useAppSelector((state) => themeSelector(state, "current"));

  const onSubmit = (types: string) => {
    onClose();
    navigation.navigate(SCREENS.BuySell, {
      segmentType,
      symbol,
      market: types,
    });
  };

  const onClose = () => {
    dispatch(setCurrentSymbol(symbol));
  };

  let type = segmentType.toUpperCase().split("_")[0];
  return (
    <View>
      <Modal
        isVisible={true}
        onBackdropPress={onClose}
        onDismiss={onClose}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View
          style={{
            backgroundColor: current.backgroundColor,
          }}
        >
          <View
            style={{
              backgroundColor: current.backgroundColor,
              ...styles.shadowStyle2,
            }}
          >
            <View
              style={{
                marginHorizontal: 10,
                padding: 10,
              }}
            >
              <EText type="r18" color={current.textColor}>
                {getSymbolNameFromIdentifier(currentRow?.InstrumentIdentifier)}
              </EText>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <EText
                  color={current.textColor}
                  style={{ marginRight: 10 }}
                  type="r14"
                >
                  {type}
                </EText>
                <EText style={{ marginRight: 10 }} type="r14">
                  {formatIndianAmount(Ltp)}
                </EText>
                <EText
                  color={value < 0 ? current.red : current.green}
                  type="r14"
                >
                  {PriceChangeWithPercentage}
                </EText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <View style={{ marginTop: 8 }}>
                  <EText color={current.greyText} type="r12">
                    LOW
                  </EText>
                  <EText color={current.textColor} type="r16">
                    {formatIndianAmount(Low)}
                  </EText>
                  <EText color={current.greyText} type="r12">
                    BID RATE
                  </EText>
                  <EText
                    color={BuyPriceChange < 0 ? current.red : current.green}
                    type="r16"
                  >
                    {formatIndianAmount(BuyPriceChangevalue)}
                  </EText>
                </View>

                <View style={{ alignItems: "flex-end", marginTop: 8 }}>
                  <EText color={current.greyText} type="r12">
                    HIGH
                  </EText>
                  <EText color={current.textColor} type="r16">
                    {formatIndianAmount(High)}
                  </EText>
                  <EText color={current.greyText} type="r12">
                    ASK RATE
                  </EText>
                  <EText
                    color={SellPriceChange < 0 ? current.red : current.green}
                    type="r16"
                  >
                    {formatIndianAmount(SellPriceChangevalue)}
                  </EText>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              paddingHorizontal: 20,
              marginBottom: 30,
              backgroundColor: current.backgroundColor,
            }}
          >
            <View style={{ flex: 1 }}>
              <EButton
                onPress={() => onSubmit("sell")}
                title="SELL"
                bgColor={current.red}
                type="b16"
                borderRadius={6}
              />
            </View>
            <View style={{ flex: 1 }}>
              <EButton
                title={"BUY"}
                type="b16"
                bgColor={current.blue}
                onPress={() => onSubmit("buy")}
                borderRadius={6}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const BuySellModal = (props: CommonModalInterface) => {
  const { symbol } = props;
  const currentSymbol = useAppSelector((state) =>
    marketLocalStateSelector(state, "currentSymbol")
  );
  if (currentSymbol === symbol) {
    return <TradeAddComponent {...props} />;
  }
  return null;
};

export default BuySellModal;
