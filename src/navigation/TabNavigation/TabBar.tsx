import images from "@assets/images";
import IconCurrencyRupee from '@assets/svgs/IconCurrencyRupee';
import IconGraph from '@assets/svgs/IconGraph';
import IconLayoutDashboard from '@assets/svgs/IconLayoutDashboard';
import IconReceiptRupee from '@assets/svgs/IconReceiptRupee';
import IconUser from '@assets/svgs/IconUser';
import EText from "@commonComponents/EText";
import { SCREENS } from "@navigation/NavigationKeys";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { styles } from "@themes/index";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";

const getName = (routeName: string) => {
  switch (routeName) {
    case SCREENS.WatchList:
      return "Market Watch";
    case SCREENS.Position:
      return "Portfolio";
    case SCREENS.Reports:
      return "Reports";
    case SCREENS.Trades:
      return "Trades";
    case SCREENS.Funds:
      return "Funds";
    case SCREENS.Dashboard:
      return "Dashboard";
    case SCREENS.Users:
      return "Users";
    default:
      break;
  }
};

const MyTabBar = ({ state, descriptors, navigation }: any) => {
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const _renderIcon = (routeName: string, isFocused: boolean) => {
    if (routeName === SCREENS.WatchList) {
      return (
        <Image
          source={isFocused ? images.MarketIconActive : images.MarketIcon}
          style={localStyle.imageStyle}
        />
      );
    } else if (routeName === SCREENS.Position) {
      return (
        <Feather
          name="briefcase"
          size={24}
          color={isFocused ? current.primary : current.textColor}
        />
      );
    } else if (routeName === SCREENS.Trades) {
      return (
        <IconGraph
          color={isFocused ? current.primary : current.textColor}
        />
      );
    } else if (routeName === SCREENS.Reports) {
      return (
        <IconReceiptRupee
          color={isFocused ? current.primary : current.textColor}
        />
      );
    } else if (routeName === SCREENS.Funds) {
      return (
        <IconCurrencyRupee
          color={isFocused ? current.primary : current.textColor}
        />
      );
    } else if (routeName === SCREENS.Dashboard) {
      return (
        <IconLayoutDashboard color={isFocused ? current.primary : current.textColor} />
      );
    } else if (routeName === SCREENS.Users) {
      return (
        <IconUser color={isFocused ? current.primary : current.textColor} />
      );
    }
    return null;
  };
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: current.backgroundColor,
        ...styles.tabBarShadowStyle,
        paddingTop: 8,
      }}
    >
      {state.routes.map(
        (
          route: { key: string | number; name: any; params: any },
          index: number
        ) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, alignItems: "center" }}
            >
              {_renderIcon(route.name, isFocused)}
              <EText
                type={isFocused ? "r10" : "r10"}
                style={{
                  color: isFocused ? current.primary : current.textColor,
                }}
              >
                {getName(route.name)}
              </EText>
            </TouchableOpacity>
          );
        }
      )}
    </View>
  );
};

export default MyTabBar;

const localStyle = StyleSheet.create({
  imageStyle: {
    height: 20,
    width: 24,
    marginBottom: 5,
  },
});
