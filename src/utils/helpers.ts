import { LoggedUser } from '@db/schemas/loggedUser.model';
import { SCREENS } from '@navigation/NavigationKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { PermissionsAndroid, Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import appJson from '../../app.json';

var Sound = require('react-native-sound');
Sound.setCategory('Playback');

// Set Async Storage Data
export const setAsyncStorageData = async (key: string, value: any) => {
  const stringData = JSON.stringify(value);
  await AsyncStorage.setItem(key, stringData);
};

export const addQueryParamsToUrl = (url: string, params: any) => {
  let newUrl: string = url;
  let addedAnyOne = false;
  Object.keys(params).forEach((e: string) => {
    if (params[e]) {
      if (addedAnyOne) {
        newUrl = `${newUrl}&${e}=${params[e]}`;
      } else {
        newUrl = `${newUrl}/?${e}=${params[e]}`;
        addedAnyOne = true;
      }
    }
  });
  return newUrl;
};

export const formatIndianAmount = (amount: any) => {
  if (isNaN(amount)) {
    return '';
  }
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
export const toFixed = (amount: any) => {
  if (isNaN(amount)) {
    return '';
  }
  return amount.toFixed(2);
};
export const isBlank = (val: any) => {
  return val === undefined || val === null || val === '';
};

export const playNotification = () => {
  const currentUser = LoggedUser.getActiveUser(globalThis.realm);
  if (currentUser?.alertSound) {
    var whoosh = new Sound(
      'notification.mp3',
      Sound.MAIN_BUNDLE,
      (error: any) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        console.log(
          'duration in seconds: ' +
            whoosh.getDuration() +
            'number of channels: ' +
            whoosh.getNumberOfChannels(),
        );
        // Play the sound with an onEnd callback

        whoosh.play((success: any) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      },
    );
  }
};

export const getSymbolNameFromIdentifier = (identifier: string) => {
  const name = identifier.split('_');
  return `${name[1]} ${name[2]}${
    identifier.startsWith('OPT') ? ` ${name[3]} ${name[4]}` : ``
  }`;
};

export const getAppName = () => {
  return appJson.displayName;
};

export function getOptions<T>(
  optionList: T[] | undefined,
  valueField: number | string,
  labelField: string,
  e: number,
) {
  return optionList
    ? optionList?.map(item => {
        return {
          label: item[labelField as keyof typeof item] as string,
          value: item[valueField as keyof typeof item] as number,
        };
      })
    : [];
}

export const checkPermission = (menu: any) => {
  const userData = LoggedUser.getActiveUser(globalThis.realm);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return menu.filter((e: any) => {
    if (e.access) {
      if (userData) {
        return e.access[userData && userData.role.slug!];
      } else {
        return false;
      }
    } else {
      return true;
    }
  });
};

export const typesKeyLabel = {
  market: 'Market',
  limit: 'Limit',
  bf: 'BF',
  cf: 'CF',
  manual: 'Manual',
};

export const getTypeLabel = (val: keyof typeof typesKeyLabel) => {
  return typesKeyLabel[val] ?? '';
};

export const getFileName = (image: ImageOrVideo) => {
  return image.path.replace(/^.*[\\/]/, '').replace(/ /g, '_');
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timer: any;
  return function (this: any, ...args: Parameters<T>): void {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(context, args), delay);
  };
};

export const pdfFunction = async (
  url: string,
  description: string,
  navigation: NavigationProp<any>,
  fileName: string,
) => {
  const currentUser = LoggedUser.getActiveUser(globalThis.realm);
  ReactNativeBlobUtil.fetch('GET', url, {
    Cookie: currentUser?.Cookie!,
  })
    .then(res => {
      let status = res.info().status;
      console.log('--------status', status);
      if (status === 200) {
        let base64Str = res.base64();
        navigation.navigate(SCREENS.PdfView, {
          base64Str,
          url,
          description,
          fileName,
        });
      }
    })
    .catch((err: any) => {
      Toast.show({ type: 'error', text1: JSON.stringify(err) });
    });
};

export function formatDateString(lastThursday: any) {
  const date = new Date(lastThursday);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date
    .toLocaleString('default', { month: 'short' })
    .toUpperCase();
  const year = date.getFullYear();

  return `${day}${month}${year}`;
}
