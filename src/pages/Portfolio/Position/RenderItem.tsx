import EDot from "@commonComponents/EDot";
import EText from "@commonComponents/EText";
import PositionView from "@components/models/PositionView";
import {
  GlobalDataSegments,
  GlobalSegmentsSlug,
  SegmentSlugTypes,
} from "@interfaces/common";
import { IPosition } from "@interfaces/index";
import { SCREENS } from "@navigation/NavigationKeys";
import { NavigationProp } from "@react-navigation/native";
import { themeSelector } from "@reducers/theme.reducer";
import { useAppDispatch, useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import {
  marketListSelector,
  marketSelector,
} from "@store/reducers/marketReducer";
import {
  positionSymbolM2MSelector,
  setMtM,
} from "@store/reducers/positionReducer";
import { socketActions } from "@store/reducers/socketReducer";
import { toNumber } from "@utils/constant";
import {
  formatIndianAmount,
  getSymbolNameFromIdentifier,
} from "@utils/helpers";
import React, { Fragment, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

const CurrentRate = ({
  identifier,
  segmentType,
}: {
  identifier: string;
  segmentType: SegmentSlugTypes;
}) => {
  const value = useAppSelector((state) =>
    marketSelector(state, segmentType, identifier, "LastTradePrice")
  );
  const current = useAppSelector((state) => themeSelector(state, "current"));

  if (value) {
    return (
      <View
        style={{
          alignContent: "flex-end",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <EText
          style={{
            color: current.greyText,
          }}
          type="r12"
        >
          LTP
        </EText>
        <EText
          style={{
            marginLeft: 8,
          }}
          type="r14"
        >
          {`${formatIndianAmount(value)}`}
        </EText>
        <PriceChange identifier={identifier} segmentType={segmentType} />
      </View>
    );
  }
  return null;
};

const PriceChange = ({
  identifier,
  segmentType,
}: {
  identifier: string;
  segmentType: SegmentSlugTypes;
}) => {
  const PriceChangePercentage = useAppSelector((state) =>
    marketSelector(state, segmentType, identifier, "PriceChangePercentage")
  );
  const current = useAppSelector((state) => themeSelector(state, "current"));

  if (PriceChangePercentage) {
    return (
      <EText
        style={{
          marginLeft: 6,
          color:
            parseFloat(PriceChangePercentage!) >= 0
              ? current.green
              : current.red,
        }}
        type="r14"
      >
        {parseFloat(PriceChangePercentage!) >= 0
          ? `(+${PriceChangePercentage}%)`
          : `(${PriceChangePercentage}%)`}
      </EText>
    );
  }
  return null;
};

const CurrentMtM = ({ rowData }: { rowData: IPosition }) => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const value = useAppSelector((state) =>
    positionSymbolM2MSelector(state, rowData.id, rowData.identifier)
  );
  const currentRate = useAppSelector((state) =>
    marketSelector(
      state,
      rowData.refSlug,
      rowData.identifier,
      rowData.netQty > 0 ? "BuyPrice" : "SellPrice"
    )
  );

  useEffect(() => {
    if (currentRate) {
      let totalBuy = toNumber(
        rowData.totalBuyQty * rowData.buyAvgPriceWithBrokerage
      ).toFixed(2);
      let totalSell = rowData.totalSellQty * rowData.sellAvgPriceWithBrokerage!;
      if (rowData.netQty > 0) {
        totalSell += currentRate * rowData.netQty;
      } else if (rowData.netQty < 0) {
        totalBuy -= currentRate * rowData.netQty;
      }
      let mtm = toNumber(totalSell - totalBuy).toFixed(2);
      mtm = toNumber(mtm);
      dispatch(
        setMtM({ mtm, identifier: rowData.identifier, userId: rowData.id })
      );
    }
  }, [currentRate]);

  return (
    <EText
      type="m16"
      style={{ color: value >= 0 ? current.green : current.red }}
    >
      {value >= 0 ? `+${formatIndianAmount(value)}` : formatIndianAmount(value)}
    </EText>
  );
};

const CurrentMtMPercentage = ({
  rowData,
  invested,
}: {
  rowData: IPosition;
  invested: number;
}) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const value = useAppSelector((state) =>
    positionSymbolM2MSelector(state, rowData.id, rowData.identifier)
  );
  const [mtmPercentage, setMtMPeercentage] = useState(0);

  useEffect(() => {
    const percentage = (value * 10) / invested;
    setMtMPeercentage(percentage);
  }, [invested, value]);

  return (
    <EText
      type="r14"
      style={{ color: mtmPercentage >= 0 ? current.green : current.red }}
    >
      {mtmPercentage >= 0
        ? `+${formatIndianAmount(mtmPercentage)}`
        : formatIndianAmount(mtmPercentage)}
      %
    </EText>
  );
};

const RenderItem = ({
  item,
  navigation,
  onRefresh,
}: {
  item: any;
  positionUserId: any;
  index: number;
  onRefresh: () => void;
  navigation: NavigationProp<any>;
}) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [data, setData] = useState();
  const [show, setShow] = useState(false);
  const [invested, setInvested] = useState(0);
  const userData = useAppSelector((state) => authSelector(state, "userData"));
  const list = useAppSelector((state) =>
    marketListSelector(state, item.refSlug)
  ) as string[];
  const dispatch = useAppDispatch();

  const getSymbolData = () => {
    dispatch(
      socketActions.getLastQuote({
        Exchange:
          item.refSlug === GlobalSegmentsSlug.mcx
            ? GlobalDataSegments.mcx
            : GlobalDataSegments.nfo,
        InstrumentIdentifier: item?.identifier,
      })
    );
  };

  useEffect(() => {
    const foundInList = list.indexOf(item?.identifier);
    let interval: string | number | NodeJS.Timeout | undefined;
    if (foundInList === -1) {
      interval = setInterval(() => {
        getSymbolData();
      }, 2000);
    }
    //Clearing the interval
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (item.netQty < 0) {
      setInvested(Math.abs(item.netQty) * item.sellAvgPriceWithBrokerage);
    } else {
      setInvested(Math.abs(item.netQty) * item.buyAvgPriceWithBrokerage);
    }
  }, [
    item.netQty,
    item.sellAvgPriceWithBrokerage,
    item.buyAvgPriceWithBrokerage,
  ]);

  return (
    <Fragment>
      {
        item.netQty !== 0 ? (
          <TouchableOpacity
            style={{
              elevation: 5,
              backgroundColor: "white",
              padding: 8,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderColor: current.bcolor,
            }}
            disabled={
              !(
                userData &&
                userData.role &&
                ["superadmin", "admin", "master", "user"].includes(
                  userData.role.slug
                )
              )
            }
            onPress={() => {
              setData(item);
              setShow(!show);
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <EText
                  style={{
                    color: current.greyText,
                  }}
                  type="r12"
                >
                  Qty.
                </EText>
                <EText
                  style={{
                    marginLeft: 2,
                  }}
                  type="r14"
                >
                  {item.netQty}
                </EText>
                <EDot />
                <EText
                  style={{
                    color: current.greyText,
                  }}
                  type="r12"
                >
                  Avg.
                </EText>
                <EText
                  style={{
                    marginLeft: 2,
                  }}
                  type="r14"
                >
                  {item.netQty < 0
                    ? formatIndianAmount(item.sellAvgPriceWithBrokerage)
                    : formatIndianAmount(item.buyAvgPriceWithBrokerage)}
                </EText>
              </View>
              <CurrentMtMPercentage rowData={item} invested={invested} />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 6,
                marginBottom: 4,
              }}
            >
              <View style={{ flex: 1 }}>
                <EText type="s16">
                  {getSymbolNameFromIdentifier(item?.identifier)}
                </EText>
              </View>
              <CurrentMtM rowData={item} />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                <EText
                  style={{
                    color: current.greyText,
                  }}
                  type="r12"
                >
                  Invested
                </EText>
                <EText
                  style={{
                    marginLeft: 2,
                  }}
                  type="r14"
                >
                  {formatIndianAmount(invested)}
                </EText>
              </View>

              <CurrentRate
                identifier={item?.identifier}
                segmentType={item.refSlug}
              />
            </View>
          </TouchableOpacity>
        ) : null
        // (
        //   <View
        //     style={{
        //       elevation: 5,
        //       backgroundColor: current.backgroundColor,
        //       padding: 8,
        //       borderBottomWidth: 1,
        //       borderColor: current.bcolor,
        //     }}
        //   >
        //     <View
        //       style={{
        //         display: "flex",
        //         flexDirection: "row",
        //         justifyContent: "space-between",
        //       }}
        //     >
        //       <View style={{ flex: 1 }}>
        //         <EText type="r14">
        //           {getSymbolNameFromIdentifier(item?.identifier)}
        //         </EText>
        //       </View>
        //       <EText type="r12">CLOSED</EText>
        //     </View>
        //     <View
        //       style={{
        //         display: "flex",
        //         flexDirection: "row",
        //         justifyContent: "flex-end",
        //       }}
        //     >
        //       <CurrentMtM rowData={item} />
        //     </View>
        //   </View>
        // )
      }

      {data && (
        <PositionView
          viewData={data}
          onDismiss={() => {
            setShow(false);
          }}
          isVisible={show}
          onPress={() => {
            navigation.navigate(SCREENS.ClosePosition, {
              delType: "intraDay",
              item: item,
              onRefresh,
            }),
              setShow(false);
          }}
          navigation={navigation}
        />
      )}
      {/* {activeDetailIndex === index ? (
        <PositionView
          viewData={item}
          onDismiss={() => {
            dispatch(setActiveInPosition({ index, isActive: false }));
          }}
          onBackdropPress={() => {
            dispatch(setActiveInPosition({ index, isActive: false }));
          }}
          isVisible={activeDetailIndex === index}
        />
      ) : null}
      {activeCloseIndex === index ? (
        <ClosePositionModal
          isVisible={true}
          viewData={item}
          APIFun={APIFun}
          tradeUserId={positionUserId}
          onDismiss={() => {
            dispatch(setCurrentSymbolAndSegment({ index, isActive: false }))
          }}
          onComplete={() => {
            dispatch(setCurrentSymbolAndSegment({ index, isActive: false }))
          }}
        />
      ) : null} */}
    </Fragment>
  );
};

export default RenderItem;
