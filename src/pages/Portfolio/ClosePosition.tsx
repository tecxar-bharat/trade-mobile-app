/* eslint-disable react/react-in-jsx-scope */
import EButton from "@commonComponents/EButton";
import EHeader from "@commonComponents/EHeader";
import EText from "@commonComponents/EText";
import FormInput from "@fields/FormInput";
import FormSelect from "@fields/FormSelect";
import { GlobalDataSegments, GlobalSegmentsSlug } from "@interfaces/common";
import { ILoggedUser } from "@interfaces/user.interface";
import { useRoute } from "@react-navigation/native";
import tradeService from "@services/trade.service";
import { useAppDispatch, useAppSelector } from "@store/index";
import {
  authSelector,
  getAvailableBalance,
} from "@store/reducers/auth.reducer";
import {
  marketRowSelector,
  marketSelector,
} from "@store/reducers/marketReducer";
import { themeSelector } from "@store/reducers/theme.reducer";
import { colors } from "@themes/colors";
import commonStyle from "@themes/commonStyle";
import {
  NumberIntValidation,
  NumberValidation,
  onLotChange,
  onQtyChange,
  toNumber,
} from "@utils/constant";
import {
  formatIndianAmount,
  getSymbolNameFromIdentifier,
} from "@utils/helpers";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface IDefault {
  type: string;
  deliveryType: string;
  price: number | null;
  qty: number;
  lot: string;
}

const ClosePosition = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const route = useRoute();
  const { delType, onRefresh } = route?.params;
  const currentRow = route?.params?.item;
  const dispatch = useAppDispatch();

  const userData = useAppSelector((state) =>
    authSelector(state, "userData")
  ) as ILoggedUser;
  const marketSymbolData = useAppSelector((state) =>
    marketRowSelector(state, currentRow?.refSlug, currentRow?.identifier)
  );
  const [position, setPosition] = useState<"buy" | "sell">("buy");
  const [quotation, setQuotation] = useState<number>(0);
  const [manualTrade, setManualTrade] = useState<boolean>(false);

  const { handleSubmit, control, setValue, setError, watch, clearErrors } =
    useForm<IDefault>({
      defaultValues: {
        type: "market",
        deliveryType: delType === "intraDay" ? "intraDay" : "delivery",
      },
      mode: "onChange",
    });

  const segmentType = currentRow?.segmentSlug;
  const symbol = currentRow?.identifier;

  let Ltp = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "LastTradePrice")
  );
  let PriceChangePercentage = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "PriceChangePercentage")
  );
  let value = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "PriceChange")
  );
  const PriceChangeWithPercentage = `${formatIndianAmount(value)} (${
    PriceChangePercentage ? PriceChangePercentage?.toFixed(2) : 0
  }%)`;
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

  const High = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "High")
  );

  const Low = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "Low")
  );

  const [types, setTypes] = useState("market");
  const [product, setProduct] = useState(delType);

  const [disabledField, setDisabledField] = useState<"lot" | "qty" | "both">(
    "both"
  );
  const [currentRate, setCurrentRate] = useState(0);

  useEffect(() => {
    if (currentRow?.netQty >= 0) {
      setPosition("sell");
    } else {
      setPosition("buy");
    }
  }, [currentRow?.netQty]);

  useEffect(() => {
    if (
      segmentType === GlobalSegmentsSlug.mcx ||
      segmentType === GlobalSegmentsSlug.nseOpt
    ) {
      setDisabledField("qty");
    } else {
      setDisabledField("lot");
    }
  }, [segmentType]);

  const [loading, setLoading] = React.useState<boolean>(false);

  const validateForm = (payload: any) => {
    let errorCount = 0;
    if (toNumber(payload.price) <= 0) {
      ++errorCount;
      setError(`price`, {
        message: "Price must be greater than 0",
      });
    }
    if (toNumber(payload.qty) <= 0) {
      ++errorCount;
      setError(`qty`, {
        message: "Qty must be greater than 0",
      });
    }
    if (errorCount > 0) {
      return false;
    }
    return true;
  };
  useEffect(() => {
    const role = userData?.role?.slug;

    if (role === "superadmin" || (role === "admin" && userData?.manualTrade)) {
      setManualTrade(true);
    } else {
      setManualTrade(false);
    }
  }, [userData]);

  const onSubmit = (payload: any) => {
    if (validateForm(payload)) {
      setLoading(true);
      payload.identifier = currentRow?.identifier;
      payload.position = position;
      payload.type = types;
      payload.closePosition = true;
      payload.qty = toNumber(Math.abs(payload.qty));
      payload.price = toNumber(payload.price);
      if (userData.role.slug !== "user") {
        payload.tradeUserId = toNumber(currentRow.id);
      }
      tradeService
        .createTrade(payload)
        .then((res) => {
          if (res.data.statusCode === 200 || res.data.statusCode === 201) {
            Toast.show({ type: "success", text1: res.data.message });
            if (onRefresh) {
              onRefresh();
            }
            props.navigation.goBack();
            dispatch(getAvailableBalance());
          } else {
            Toast.show({ type: "error", text1: res.data.message });
          }
          setLoading(false);
        })
        .catch((error: any) => {
          if (error.response.data.message.length > 0) {
            for (let i = 0; i <= error.response.data.message.length - 1; i++) {
              Toast.show({
                type: "error",
                text1: error.response.data.message[i],
              });
            }
            setLoading(false);
          } else {
            Toast.show({ type: "error", text1: error });
            setLoading(false);
          }
        });
    }
  };

  useEffect(() => {
    if (types === "market") {
      setValue("price", currentRate);
    }
  }, [currentRow, currentRate, types]);

  useEffect(() => {
    if (
      marketSymbolData &&
      marketSymbolData.QuotationLot &&
      quotation !== marketSymbolData.QuotationLot
    ) {
      setQuotation(marketSymbolData.QuotationLot);
    }
  }, [marketSymbolData]);

  useEffect(() => {
    setValue("qty", Math.abs(currentRow?.netQty));
    onQtyChange({
      currentSymbol: currentRow?.identifier,
      setValue,
      exchange: segmentType,
      val: Math.abs(currentRow?.netQty).toString(),
      QuotationLot: quotation,
    });
  }, [currentRow, quotation]);

  useEffect(() => {
    if (currentRow) {
      if (marketSymbolData) {
        setCurrentRate(
          currentRow.netQty > 0
            ? marketSymbolData.BuyPrice!
            : marketSymbolData.SellPrice!
        );
      } else {
        setCurrentRate(currentRow.currentRate!);
      }
    }
  }, [currentRow, marketSymbolData]);

  const EButtons = (props: any) => {
    return (
      <TouchableOpacity
        style={{
          borderWidth: 1,
          flex: 1,
          borderRadius: 5,
          borderColor: props.borderColor,
          backgroundColor: props.bgColor ?? "transparent",
        }}
        onPress={props.onPress}
        disabled={props.disable}
      >
        <EText
          style={{
            textAlign: "center",
            paddingVertical: 8,
          }}
          type="r14"
        >
          {props.text}
        </EText>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: current.backgroundColor1,
      }}
    >
      <EHeader title="Close Position" />
      <View
        style={{
          flex: 1,
          backgroundColor: current.backgroundColor,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          paddingHorizontal: 10,
          marginTop: 30,
        }}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: current?.bcolor,
            padding: 10,
            marginTop: -30,
            backgroundColor: current.backgroundColor,
            borderRadius: 6,
            justifyContent: "space-between",
            flexDirection: "row",
            ...commonStyle.shadowStyle,
          }}
        >
          <View style={{ flex: 1, gap: 10 }}>
            <EText type={"m16"}>{getSymbolNameFromIdentifier(symbol)}</EText>
            <EText
              style={{ textTransform: "uppercase", color: current.greyText }}
              type="m14"
            >
              {currentRow?.segment}
            </EText>

            <View>
              <EText color={current.greyText} type="r12">
                LOW
              </EText>
              <EText color={current.textColor} type="r16">
                {formatIndianAmount(Low ?? 0)}
              </EText>
            </View>

            <View>
              <EText color={current.greyText} type="r12">
                BID RATE
              </EText>
              <EText
                color={BuyPriceChange < 0 ? current.red : current.green}
                type="r16"
              >
                {formatIndianAmount(BuyPriceChangevalue ?? 0)}
              </EText>
            </View>
          </View>
          <View style={{ alignItems: "flex-end", gap: 10 }}>
            <EText type="m16">{formatIndianAmount(Ltp)}</EText>
            <EText color={current.green} type="r14">
              {PriceChangeWithPercentage}
            </EText>
            <View style={{ alignItems: "flex-end" }}>
              <EText color={current.greyText} type="r12">
                HIGH
              </EText>
              <EText color={current.textColor} type="r16">
                {formatIndianAmount(High ?? 0)}
              </EText>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <EText color={current.greyText} type="r12">
                ASK RATE
              </EText>
              <EText
                color={SellPriceChange < 0 ? current.red : current.green}
                type="r16"
              >
                {formatIndianAmount(SellPriceChangevalue ?? 0)}
              </EText>
            </View>
          </View>
        </View>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView>
            <View>
              <View style={{ gap: 5, flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <FormInput
                    name="lot"
                    inputLayout="horizontal"
                    label={"Lot"}
                    keyboardType="number-pad"
                    required={
                      disabledField !== "lot" && disabledField !== "both"
                    }
                    control={control}
                    validate={
                      disabledField === "lot" || disabledField === "both"
                        ? () => true
                        : NumberIntValidation
                    }
                    disable={
                      disabledField === "lot" || disabledField === "both"
                    }
                    onValueChange={(val: string) =>
                      onLotChange({
                        currentSymbol: currentRow?.identifier,
                        setValue,
                        val,
                        QuotationLot: quotation,
                      })
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FormInput
                    control={control}
                    required={
                      disabledField !== "qty" && disabledField !== "both"
                    }
                    name="qty"
                    inputLayout="horizontal"
                    label={"Qty"}
                    keyboardType="number-pad"
                    validate={
                      disabledField === "qty" || disabledField === "both"
                        ? () => true
                        : NumberIntValidation
                    }
                    disable={
                      disabledField === "qty" || disabledField === "both"
                    }
                    onValueChange={(val: string) =>
                      onQtyChange({
                        currentSymbol: currentRow?.identifier,
                        setValue,
                        val,
                        exchange: segmentType,
                        QuotationLot: quotation,
                      })
                    }
                  />
                </View>
              </View>
              <FormInput
                control={control}
                name="price"
                inputLayout="horizontal"
                label={"Price"}
                disable={types === "market" ? true : false}
              />
            </View>
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <EText
                color={current.textColor}
                type="m14"
                style={{ marginBottom: 10 }}
              >
                Product
              </EText>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  paddingBottom: 20,
                  gap: 8,
                }}
              >
                <EButtons
                  text={"Intraday"}
                  onPress={() => setProduct("intraDay")}
                  disable={true}
                  borderColor={
                    position === "sell"
                      ? product === "intraDay"
                        ? current.red
                        : current.bcolor
                      : product === "intraDay"
                      ? current.blue
                      : current.bcolor
                  }
                />
                <EButtons
                  text={"Delivery"}
                  onPress={() => setProduct("delivery")}
                  disable={true}
                  borderColor={
                    position === "sell"
                      ? product === "delivery"
                        ? current.red
                        : current.bcolor
                      : product === "delivery"
                      ? current.blue
                      : current.bcolor
                  }
                />
              </View>
              <View style={style.border} />
            </View>
            <View>
              <EText
                color={current.textColor}
                type="m14"
                style={{ marginBottom: 10 }}
              >
                Type
              </EText>
              <View
                style={{
                  flexDirection: "row",
                  paddingBottom: 20,
                  display: "flex",
                  gap: 8,
                }}
              >
                <EButtons
                  text={"Market"}
                  onPress={() => setTypes("market")}
                  borderColor={
                    position === "sell"
                      ? types === "market"
                        ? current.red
                        : current.bcolor
                      : types === "market"
                      ? current.blue
                      : current.bcolor
                  }
                />
                <EButtons
                  text={"Limit/SL"}
                  onPress={() => setTypes("limit")}
                  borderColor={
                    position === "sell"
                      ? types === "limit"
                        ? current.red
                        : current.bcolor
                      : types === "limit"
                      ? current.blue
                      : current.bcolor
                  }
                />
                {manualTrade && (
                  <EButtons
                    text={"Manual"}
                    onPress={() => setTypes("manual")}
                    borderColor={
                      position === "sell"
                        ? types === "manual"
                          ? current.red
                          : current.bcolor
                        : types === "manual"
                        ? current.blue
                        : current.bcolor
                    }
                  />
                )}
              </View>
              <View style={style.border} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          backgroundColor: current.backgroundColor,
          paddingBottom: 10,
        }}
      >
        <EButton
          title={currentRow?.netQty < 0 ? "BUY" : "SELL"}
          bgColor={currentRow?.netQty < 0 ? current?.blue : current.red}
          loading={loading}
          disabled={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  border: {
    borderBottomColor: colors.dark.greyDark,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
});

export default ClosePosition;
