import EButton from "@commonComponents/EButton";
import EText from "@commonComponents/EText";
import { NavigationProp } from "@react-navigation/native";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppSelector } from "@store/index";
import { marketSelector } from "@store/reducers/marketReducer";
import { formatIndianAmount } from "@utils/helpers";
import React, { Fragment } from "react";
import { View } from "react-native";
import Modal from "react-native-modal";
interface CommonModalInterface {
  isVisible: boolean;
  onDismiss: () => void;
  viewData: any;
  navigation: NavigationProp<any>;
  onPress: () => void;
}
const PositionView = (props: CommonModalInterface) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));

  const { identifier, refSlug } = props?.viewData;

  let High = useAppSelector((state) =>
    marketSelector(state, refSlug, identifier, "High")
  );
  let Low = useAppSelector((state) =>
    marketSelector(state, refSlug, identifier, "Low")
  );

  const BuyPriceChange = useAppSelector((state) =>
    marketSelector(state, refSlug, identifier, "BuyPriceChange")
  );
  let BuyPriceChangevalue = useAppSelector((state) =>
    marketSelector(state, refSlug, identifier, "BuyPrice")
  );
  let SellPriceChangevalue = useAppSelector((state) =>
    marketSelector(state, refSlug, identifier, "SellPrice")
  );
  const SellPriceChange = useAppSelector((state) =>
    marketSelector(state, refSlug, identifier, "SellPriceChange")
  );

  return (
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={props.onDismiss}
      style={{ justifyContent: "flex-end", margin: 0 }}
    >
      <View
        style={{
          backgroundColor: current.backgroundColor,
          padding: 20,
          // flex: 0.2,
        }}
      >
        {props.isVisible && props.viewData ? (
          <Fragment>
            <View
              style={{
                backgroundColor: current.backgroundColor,
              }}
            >
              <View
                style={{
                  justifyContent: "space-between",
                }}
              >
                <EText type="m16" color={current.textColor}>
                  {props.viewData?.script}
                </EText>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <View>
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
                  <View style={{ alignItems: "flex-end" }}>
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
                {/* <TouchableOpacity onPress={props.onDismiss}>
                  <AntDesign name="close" size={25} color={current.textColor} />
                </TouchableOpacity> */}
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginTop: 20,
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <EButton
                  onPress={props.onPress}
                  title="SELL"
                  bgColor={current.red}
                  type="b16"
                  borderRadius={6}
                  disabled={props.viewData.netQty < 0 ? true : false}
                />
              </View>
              <View style={{ flex: 1 }}>
                <EButton
                  title={"BUY"}
                  type="b16"
                  bgColor={current.blue}
                  onPress={props.onPress}
                  borderRadius={6}
                  disabled={props.viewData.netQty > 0 ? true : false}
                />
              </View>
            </View>
          </Fragment>
        ) : null}
      </View>
    </Modal>
  );
};
export default PositionView;
