import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView as TabViewLib, SceneMap, TabBar } from 'react-native-tab-view';
import { useAppSelector } from '../../store';
import { themeSelector } from '../../store/reducers/theme.reducer';
import EText from './EText';
import { moderateScale } from '@common/constants';
import { isBlank } from '@utils/constant';

export interface ITabs {
  label: string;
  key: string;
  renderView: React.FunctionComponent;
  badge?: Element;
}

export default function TabView({ tabs, scrollEnabled, currentIndex, lazy }: { currentIndex?: number; tabs: ITabs[]; scrollEnabled?: boolean; lazy?: boolean }) {
  const layout = useWindowDimensions();
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState(
    tabs.map(e => {
      return {
        key: e.key,
        title: e.label,
        badge: e.badge
      };
    }),
  );
  const scenes: any = {};
  tabs.forEach(e => {
    scenes[e.key] = e.renderView;
  });
  const renderScene = SceneMap(scenes);

  React.useEffect(() => {
    if (!isBlank(currentIndex)) {
      setIndex(currentIndex!)
    }
  }, [currentIndex])

  return (
    <TabViewLib
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={tabBarProps => (
        <TabBar
          {...tabBarProps}
          activeColor={"white"}
          inactiveColor={"black"}
          scrollEnabled={scrollEnabled}
          style={{
            backgroundColor: current.backgroundColor1,
            height: moderateScale(30),
          }}
          indicatorStyle={[
            {
              backgroundColor: current.primary,
              height: 2.5,
            },
          ]}
          labelStyle={{ color: current.textOne, marginTop: 0, paddingTop: 0 }}
          renderLabel={({ route, focused }) => {
            return (
              <View style={{ display: 'flex', flexDirection: 'row', marginTop: -25 }}>
                <EText
                  type="s14"
                  style={{
                    color: focused ? current.primary : current.textColor,
                    paddingTop: 0,
                    marginTop: 5
                  }}
                >
                  {route.title}
                </EText>
                {route.badge ? route.badge : null}
              </View>
            );
          }}
        />
      )}
      initialLayout={{ width: layout.width }}
      lazy={!isBlank(lazy) ? lazy : true}
    />
  );
}
