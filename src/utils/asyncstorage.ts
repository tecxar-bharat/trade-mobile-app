import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ON_BOARDING,
  THEME,
  LOGGED_IN,
  LOG_IN_CRED,
  LANGUAGE,
} from '@common/constants';

const removeUserDetail = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

const initialStorageValueGet = async () => {
  let asyncData = await AsyncStorage.multiGet([
    THEME,
    ON_BOARDING,
    LOGGED_IN,
    LOG_IN_CRED,
    LANGUAGE,
  ]);
  const themeColor = JSON.parse(asyncData[0][1]!);
  const onBoardingValue = JSON.parse(asyncData[1][1]!);
  const loggedIn = JSON.parse(asyncData[2][1]!);
  const logInCred = JSON.parse(asyncData[3][1]!);
  const language = JSON.parse(asyncData[4][1]!);
  return { themeColor, onBoardingValue, loggedIn, logInCred, language };
};

export { initialStorageValueGet, removeUserDetail };
