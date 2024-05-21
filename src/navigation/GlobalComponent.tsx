import * as React from "react";
import { NavigationContainerRef } from "@react-navigation/native";
import { authSelector } from "@store/reducers/auth.reducer";
import { useAppSelector } from "@store/index";
import { SCREENS } from "./NavigationKeys";

type Props = {
  navigation: NavigationContainerRef<any>;
  children: React.ReactNode;
};
const OfflineWatcher: React.FC<Props> = ({ children, navigation }) => {
  const sessionExpired = useAppSelector((state) =>
    authSelector(state, "sessionExpired")
  );
  React.useEffect(() => {
    const currentRoute: any = navigation.getCurrentRoute();
    if (sessionExpired && currentRoute && currentRoute.name !== SCREENS.Auth) {
      navigation.reset({
        index: 0,
        routes: [{ name: SCREENS.Auth }],
      });
    }
  }, [sessionExpired]);
  return <>{children}</>;
};
export default OfflineWatcher;
