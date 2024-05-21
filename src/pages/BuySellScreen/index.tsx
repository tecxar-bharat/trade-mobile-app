/* eslint-disable react/react-in-jsx-scope */
import EButton from "@commonComponents/EButton";
import EHeader from "@commonComponents/EHeader";
import EText from "@commonComponents/EText";
import FormInput from "@fields/FormInput";
import FormSelect from "@fields/FormSelect";
import { GlobalDataSegments, GlobalSegmentsSlug } from "@interfaces/common";
import { ILoggedUser } from "@interfaces/user.interface";
import { useRoute } from "@react-navigation/native";
import accountService from "@services/account.service";
import commonService from "@services/common.service";
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
import {
  findUserByName,
  getAccountById,
  getUsersName,
} from "@store/reducers/userReducer";
import { colors } from "@themes/colors";
import commonStyle from "@themes/commonStyle";
import {
  NumberIntValidation,
  onLotChange,
  onQtyChange,
  toNumber,
} from "@utils/constant";
import { formatIndianAmount, isBlank } from "@utils/helpers";
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
  position: string;
  price: number | null;
  qty: number;
  lot: number;
  type: string;
  otherClientId?: number | null;
  deliveryType: string;
}

const BuySell = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const route = useRoute();
  const { segmentType, symbol, market } = route?.params;
  const {
    handleSubmit,
    control,
    setValue,
    setError,
    watch: watch2,
  } = useForm<IDefault>({
    defaultValues: { type: "market", deliveryType: "intraDay" },
    mode: "onChange",
  });

  const currentRow = useAppSelector((state) =>
    marketRowSelector(state, segmentType, symbol)
  );

  let Ltp = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "LastTradePrice")
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
  const BuyPriceChangevalue = useAppSelector((state) =>
    marketSelector(state, segmentType, symbol, "BuyPrice")
  );
  const SellPriceChangevalue = useAppSelector((state) =>
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

  const userData = useAppSelector((state) =>
    authSelector(state, "userData")
  ) as ILoggedUser;
  const [types, setTypes] = useState("market");
  const [product, setProduct] = useState("intraDay");
  const [allUserList, setAllUserList] = useState([]);
  const [enableNseSell, setEnableNseSell] = useState<boolean>(false);
  const [manualTrade, setManualTrade] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [disabledField, setDisabledField] = useState<"lot" | "qty" | "both">(
    "both"
  );
  const dispatch = useAppDispatch();

  const otherClientId: number | undefined | null = watch2("otherClientId");

  useEffect(() => {
    commonService.getUserNameList().then((e: any) => {
      setAllUserList(
        e.data.data.map((ee: any) => {
          return {
            id: ee.id,
            name: `${ee.name} ( ${ee.user_id} )`,
          };
        })
      );
    });
  }, []);

  useEffect(() => {
    if (
      otherClientId &&
      market === "sell" &&
      segmentType === GlobalSegmentsSlug.nseOpt
    ) {
      accountService.getAccountById(otherClientId).then((res: any) => {
        setEnableNseSell(res?.data?.data?.isNseOptionSell);
      });
      setValue("deliveryType", "intraDay");
    }
  }, [otherClientId, market, segmentType]);

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

  useEffect(() => {
    dispatch(findUserByName("user"));
    dispatch(getAccountById(toNumber(userData && userData?.id)));
    dispatch(getUsersName());
  }, []);

  useEffect(() => {
    if (types === "market") {
      if (market === "buy") {
        setValue("price", currentRow?.SellPrice!);
      } else {
        setValue("price", currentRow?.BuyPrice!);
      }
    }
  }, [types, market, currentRow?.SellPrice]);

  useEffect(() => {
    setValue("lot", 1);
    onLotChange({
      currentSymbol: symbol,
      setValue,
      val: "1",
      QuotationLot: currentRow?.QuotationLot,
    });
  }, [currentRow?.InstrumentIdentifier]);

  useEffect(() => {
    if (market === "buy") {
      if (types === "market") {
        setValue("price", currentRow?.SellPrice!.toFixed(2));
      }
    } else {
      if (types === "market") {
        setValue("price", currentRow?.BuyPrice!.toFixed(2));
      }
    }
  }, [
    currentRow?.QuotationLot,
    types,
    market,
    currentRow?.BuyPrice,
    currentRow?.SellPrice,
  ]);

  const validateForm = (payload: any) => {
    let errorCount = 0;
    if (toNumber(payload.qty) <= 0) {
      ++errorCount;
      Toast.show({
        type: "error",
        text1: "Quantity must be greater than 0",
      });
    }
    // if (userData?.role?.slug !== "user") {
    //   if (isBlank(payload.otherClientId)) {
    //     ++errorCount;
    //     setError("otherClientId", { message: "Client is required" });
    //   }
    // }
    if (errorCount > 0) {
      return false;
    }
    return true;
  };

  const onSubmit = async (payload: any) => {
    if (validateForm(payload)) {
      setLoading(true);
      payload.identifier = currentRow && currentRow.InstrumentIdentifier;
      if (userData.role.slug !== "user") {
        payload.tradeUserId = payload.otherClientId;
      }
      payload.deliveryType = product;
      payload.type = types;
      payload.position = market;
      payload.qty = toNumber(payload.qty);
      payload.price = toNumber(payload.price);

      setLoading(true);
      tradeService
        .createTrade(payload)
        .then((res: any) => {
          if (res.data?.statusCode === 200 || res.data?.statusCode === 201) {
            setTimeout(() => {
              Toast.show({ type: "success", text1: res?.data?.message });
              props.navigation.goBack();
            }, 1000);

            dispatch(getAvailableBalance());
            setLoading(false);
          } else {
            Toast.show({ type: "error", text1: res?.data?.message });
            setLoading(false);
          }
        })
        .catch((error) => {
          Toast.show({ type: "error", text1: error });
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    const role = userData?.role?.slug;

    if (role === "superadmin" || (role === "admin" && userData?.manualTrade)) {
      setManualTrade(true);
    } else {
      setManualTrade(false);
    }
  }, [userData]);

  if (!currentRow) {
    return null;
  }

  let name: any = currentRow?.InstrumentIdentifier?.split("_");
  name = `${name[1]}`;
  let type = segmentType.toUpperCase().split("_")[0];

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
      <EHeader title="Trade" />
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
            <EText type={"m16"}>{currentRow?.Name}</EText>
            <EText
              style={{ textTransform: "uppercase", color: current.greyText }}
              type="m14"
            >
              {type}
            </EText>

            <View>
              <EText color={current.greyText} type="r12">
                LOW
              </EText>
              <EText color={current.textColor} type="r16">
                {formatIndianAmount(Low)}
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
                {formatIndianAmount(BuyPriceChangevalue)}
              </EText>
            </View>
          </View>
          <View style={{ alignItems: "flex-end", gap: 10 }}>
            <EText type="m16">{formatIndianAmount(Ltp)}</EText>
            <EText color={value < 0 ? current.red : current.green} type="r14">
              {PriceChangeWithPercentage}
            </EText>

            <View style={{ alignItems: "flex-end" }}>
              <EText color={current.greyText} type="r12">
                HIGH
              </EText>
              <EText color={current.textColor} type="r16">
                {formatIndianAmount(High)}
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
                {formatIndianAmount(SellPriceChangevalue)}
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
                    specialValue={currentRow?.QuotationLot}
                    inputLayout="horizontal"
                    label={"Lot"}
                    required={
                      disabledField !== "lot" && disabledField !== "both"
                    }
                    control={control}
                    disable={
                      disabledField === "both" || disabledField === "lot"
                    }
                    validate={
                      disabledField === "lot" || disabledField === "both"
                        ? () => true
                        : NumberIntValidation
                    }
                    keyboardType="number-pad"
                    onValueChange={(val: string) =>
                      onLotChange({
                        currentSymbol: symbol,
                        setValue,
                        val,
                        QuotationLot: currentRow?.QuotationLot,
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
                    disable={
                      disabledField === "both" || disabledField === "qty"
                    }
                    validate={
                      disabledField === "qty" || disabledField === "both"
                        ? () => true
                        : NumberIntValidation
                    }
                    inputLayout="horizontal"
                    label={"Quantity"}
                    keyboardType="number-pad"
                    onValueChange={(val: string) =>
                      onQtyChange({
                        currentSymbol: symbol,
                        setValue,
                        val,
                        exchange: segmentType,
                        QuotationLot: currentRow?.QuotationLot,
                      })
                    }
                  />
                </View>
              </View>
              <FormInput
                control={control}
                name="price"
                disable={types === "market" ? true : false}
                inputLayout="horizontal"
                label={"Price"}
              />
              {userData?.role?.slug !== "user" && (
                <View style={{ marginBottom: 10 }}>
                  <FormSelect
                    control={control}
                    labelKey="name"
                    valueKey="id"
                    type="select"
                    required={"UserId is required"}
                    name="otherClientId"
                    label={"Client"}
                    options={allUserList}
                  />
                </View>
              )}
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
                  borderColor={
                    market === "sell"
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
                  bgColor={
                    market === "sell" &&
                    currentRow.SegmentSlug === GlobalSegmentsSlug.nseOpt
                      ? current.backgroundColor1
                      : ""
                  }
                  disable={
                    market === "sell" &&
                    currentRow.SegmentSlug === GlobalSegmentsSlug.nseOpt
                  }
                  borderColor={
                    market === "sell"
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

            <EText
              color={current.textColor}
              type="m14"
              style={{
                marginBottom: 10,
              }}
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
                  market === "sell"
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
                  market === "sell"
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
                    market === "sell"
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
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          backgroundColor: current.backgroundColor,
          paddingBottom: 10,
          paddingTop: 10,
        }}
      >
        {market === "buy" ? (
          <EButton
            title={market.toUpperCase()}
            bgColor={market === "sell" ? current.red : current.blue}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          />
        ) : (
          <EButton
            title={market.toUpperCase()}
            bgColor={market === "sell" ? current.red : current.blue}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={
              loading ||
              (segmentType === GlobalSegmentsSlug.nseOpt &&
                ((!userData?.isNseOptionSell &&
                  userData?.role?.slug === "user") ||
                  (!enableNseSell && userData?.role.slug !== "user")))
            }
          />
        )}
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

export default BuySell;
