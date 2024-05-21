import { useAppDispatch, useAppSelector } from "@store/index";
import React, { useEffect } from "react";
import { View } from "react-native";
// import MenuButton from '@commonComponents/MenuButton';
import RenderNifty from "@pages/MarketWatch/RenderNifty";
import RenderTab from "@pages/MarketWatch/RenderTab";
import { themeSelector } from "@reducers/theme.reducer";
// import Marquee from '@components/Marquee';
import TabView from "@commonComponents/TabView";
import { GlobalDataSegments, GlobalSegmentsSlug } from "@interfaces/common";
import { authSelector } from "@reducers/auth.reducer";
import {
  getAccountById,
  getSegments,
  getuserMcxFormScripts,
  getuserNseFormScripts,
} from "@reducers/userReducer";
import {
  getPositionList,
  positionSelector,
} from "@store/reducers/positionReducer";
import { toNumber } from "@utils/constant";
import Marquee from "@commonComponents/Marquee";

const WatchList = (props: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [index, setIndex] = React.useState(0);
  const dispatch = useAppDispatch();

  const positionUserId = useAppSelector((state) =>
    positionSelector(state, "positionUserId")
  );
  const scriptId = useAppSelector((state) =>
    positionSelector(state, "scriptId")
  );
  const userData = useAppSelector((state) => authSelector(state, "userData"));

  const [routes, setRoutes] = React.useState<
    {
      key: GlobalSegmentsSlug;
      label: string;
      renderView: React.FunctionComponent;
    }[]
  >([]);

  useEffect(() => {
    dispatch(getSegments());
    dispatch(getuserNseFormScripts());
    dispatch(getuserMcxFormScripts());
    dispatch(getAccountById(toNumber(userData && userData?.id)));
  }, [userData]);

  useEffect(() => {
    if (userData) {
      if (userData.role.slug === "user") {
        const tempRoutes: any = [];
        userData?.segments.forEach((e) => {
          if (e.segment.slug === "nse_fut") {
            tempRoutes.push({
              key: GlobalSegmentsSlug.nfoFut,
              label: "NSE FUT",
              renderView: (tabprops: any) => (
                <View style={{ flex: 1 }}>
                  <RenderTab
                    navigation={props.navigation}
                    {...tabprops}
                    segmentType={GlobalSegmentsSlug.nfoFut}
                    segment="NFO FUT"
                    Exchange={GlobalDataSegments.nfo}
                    label={"NSE FUT"}
                  />
                </View>
              ),
            });
          } else if (e.segment.slug === "mcx") {
            tempRoutes.push({
              key: GlobalSegmentsSlug.mcx,
              label: "MCX",
              renderView: (tabprops: any) => (
                <View style={{ flex: 1 }}>
                  <RenderTab
                    navigation={props.navigation}
                    {...tabprops}
                    segmentType={GlobalSegmentsSlug.mcx}
                    segment={"MCX"}
                    Exchange={GlobalDataSegments.mcx}
                    label={"MCX"}
                  />
                </View>
              ),
            });
          } else if (e.segment.slug === "nse_option") {
            tempRoutes.push({
              key: GlobalSegmentsSlug.nseOpt,
              label: "NSE OPT",
              renderView: (tabprops: any) => (
                <View style={{ flex: 1 }}>
                  <RenderTab
                    navigation={props.navigation}
                    {...tabprops}
                    segmentType={GlobalSegmentsSlug.nseOpt}
                    segment={"NSE OPT"}
                    Exchange={GlobalDataSegments.nfo}
                    label={"NSE OPT"}
                  />
                </View>
              ),
            });
          }
        });
        setRoutes(tempRoutes);
      } else {
        setRoutes([
          {
            key: GlobalSegmentsSlug.nfoFut,
            label: "NSE FUT",
            renderView: (tabprops: any) => (
              <View style={{ flex: 1 }}>
                <RenderTab
                  navigation={props.navigation}
                  {...tabprops}
                  segmentType={GlobalSegmentsSlug.nfoFut}
                  segment="NSE FUT"
                  Exchange={GlobalDataSegments.nfo}
                />
              </View>
            ),
          },
          {
            key: GlobalSegmentsSlug.mcx,
            label: "MCX",
            renderView: (tabprops: any) => (
              <View style={{ flex: 1 }}>
                <RenderTab
                  navigation={props.navigation}
                  {...tabprops}
                  segmentType={GlobalSegmentsSlug.mcx}
                  segment={"MCX"}
                  Exchange={GlobalDataSegments.mcx}
                />
              </View>
            ),
          },
          {
            key: GlobalSegmentsSlug.nseOpt,
            label: "NSE OPT",
            renderView: (tabprops: any) => (
              <View style={{ flex: 1 }}>
                <RenderTab
                  navigation={props.navigation}
                  {...tabprops}
                  segmentType={GlobalSegmentsSlug.nseOpt}
                  segment={"NSE OPT"}
                  Exchange={GlobalDataSegments.nfo}
                />
              </View>
            ),
          },
        ]);
      }
    }
  }, [userData]);

  return (
    <View style={{ flex: 1, backgroundColor: current.backgroundColor }}>
      <RenderNifty />
      <Marquee type="inner" />
      {routes.length > 0 && (
        <TabView
          tabs={routes}
          currentIndex={0}
          scrollEnabled={routes.length === 1}
          lazy={false}
        />
      )}
    </View>
  );
};

export default WatchList;
