import React, { Fragment, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { moderateScale } from "@common/constants";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import { styles } from "@themes/index";
import EInput from "@components/common/EInput";

import CountryPicker, {
  DARK_THEME,
  DEFAULT_THEME,
  FlagButton,
  FlagType,
  getAllCountries,
} from "react-native-country-picker-modal";

import moment from "moment";
import { MobileValidation } from "@utils/validators";
import strings from "@i18n/strings";
import { dateFormat, isBlank } from "@utils/constant";
const AddInput = (props: any) => {
  const {
    type,
    value,
    leftIcon,
    rightIcon,
    onChange,
    autoCapitalize,
    setError,
    error,
    minimumDate,
    maximumDate,
    backgroundColor,
    localInputContainerStyle,
    ...inputProps
  } = props;
  const current = useAppSelector((state) => themeSelector(state, "current"));

  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [DatePickerVisible, setDatePickerVisible] = useState(false);

  const [callingCodeLib, setCallingCodeLib] = useState(91);
  const [countryCodeLib, setCountryCodeLib] = useState<any>("IN");
  const [visiblePiker, setVisiblePiker] = useState(false);

  const getCountries = async () => {
    const data = await getAllCountries(FlagType.EMOJI);
    if (data) {
      const callingCode = value.slice(0, -10);
      const countryData = data.find(
        (e) => e.callingCode.indexOf(callingCode) > -1
      );
      if (countryData) {
        setCallingCodeLib(callingCode);
        setCountryCodeLib(countryData.cca2);
      }
    }
  };

  useEffect(() => {
    if (type === "mobile" && value) {
      getCountries();
    }
  }, []);

  const getValue = () => {
    if (type === "date" && value) {
      return moment(value).format("YYYY/MM/DD");
    } else if (type === "MonthAndDay" && value) {
      return moment(value.toISOString()).format("MMM DD");
    } else if (type === "mobile" && value) {
      return value.slice(-10);
    }
    return value;
  };

  const [showingValue, setShowingValue] = useState(getValue());
  const HandleConfirmDate = (date: Date) => {
    valueChange(date);
    setDatePickerVisible(false);
  };

  useEffect(() => {
    if (!type) {
      setShowingValue(value);
    }
    else if (type === "date" || type === "datetime" || type === "MonthAndDay") {
      if (isBlank(value)) {
        setShowingValue("")
      }
      else {
        if (type === "date" && value) {
          setShowingValue(moment(value).format("DD-MM-YYYY"))
        } else if (type === "MonthAndDay" && value) {
          setShowingValue(moment(value.toISOString()).format("DD MMM"))
        }
      }
    }
  }, [value]);

  const valueChange = (val: any) => {
    let newValue = val;
    if (type === "mobile") {
      newValue = `${callingCodeLib}${newValue}`;
    }
    if (type === "date") {
      setShowingValue(moment(val.toISOString()).format("DD-MM-YYYY"));
      onChange(newValue);
    } else if (type === "datetime") {
      setShowingValue(moment(val.toISOString()).format(dateFormat));
      onChange(newValue);
    } else if (type === "MonthAndDay") {
      setShowingValue(moment(val.toISOString()).format("DD MMM"));
      onChange(newValue);
    } else if (type === "location") {
      setShowingValue(val.formatted_address);
      onChange(val);
    } else {
      setShowingValue(val);
      onChange(newValue.trim());
    }

    setTimeout(() => {
      if (type === "mobile") {
        const mobileError = MobileValidation(val);
        if (mobileError !== true && mobileError) {
          setError(mobileError);
        } else if (inputProps.required && !val) {
          if (typeof inputProps.required === "string") {
            setError(inputProps.required);
          } else {
            setError(
              `${inputProps.label ? `${inputProps.label} is` : ""} ${strings.required
              }`
            );
          }
        }
      }
    }, 0);
  };

  const BlurredStyle = {
    backgroundColor: current.backgroundColor1,
    borderColor: current.bcolor,
  };

  const FocusedStyle = {
    backgroundColor: current.backgroundColor1,
    borderColor: current.primary,
  };

  const [inputStyle, setInputStyle] = useState(BlurredStyle);

  const onFocusInput = () => {
    setInputStyle(FocusedStyle);
  };
  const onBlurInput = () => {
    setInputStyle(BlurredStyle);
  };
  const ShowDatePicker = () => {
    setDatePickerVisible(true);
  };
  const HideDatePicker = () => {
    setDatePickerVisible(false);
  };
  const RightPasswordEyeIcon = () => (
    <TouchableOpacity onPress={onPressPasswordEyeIcon}>
      <Ionicons
        name={isPasswordVisible ? "eye-off" : "eye"}
        size={moderateScale(20)}
        color={isPasswordVisible ? current.greyText : current.primary}
      />
    </TouchableOpacity>
  );
  const RightDateIcon = () => (
    <View>
      <TouchableOpacity onPress={ShowDatePicker}>
        <Ionicons
          name={"calendar"}
          size={moderateScale(20)}
          color={current.primary}
          style={{ padding: 8 }}
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={DatePickerVisible}
        mode="date"
        date={value ? value : new Date()}
        onConfirm={HandleConfirmDate}
        onCancel={HideDatePicker}
        {...(minimumDate && {
          minimumDate: minimumDate,
        })}
        {...(maximumDate && {
          maximumDate: maximumDate,
        })}
      />
    </View>
  );

  const onPressPasswordEyeIcon = () => setIsPasswordVisible(!isPasswordVisible);

  const openCountryPicker = () => setVisiblePiker(true);
  const closeCountryPicker = () => setVisiblePiker(false);

  const BlurredIconStyle = current.greyDark;
  const countryIcon = () => {
    return (
      <View style={styles.rowSpaceBetween}>
        <FlagButton
          value={callingCodeLib}
          onOpen={openCountryPicker}
          withEmoji={true}
          countryCode={countryCodeLib}
          withCallingCodeButton={true}
          containerButtonStyle={localStyles.countryPickerButton}
        />
        <Ionicons
          name="chevron-down-outline"
          size={moderateScale(20)}
          color={BlurredIconStyle}
          onPress={openCountryPicker}
        />
      </View>
    );
  };

  const onSelectCountry = (country: any) => {
    setCountryCodeLib(country.cca2);
    setCallingCodeLib("+" + country.callingCode[0]);

    onChange(`${country.callingCode[0]}${showingValue}`);

    closeCountryPicker();
  };

  return (
    <Fragment>
      <EInput
        _value={showingValue}
        _errorText={error ? error.message : null}
        autoCapitalize={autoCapitalize ?? "none"}
        insideLeftIcon={leftIcon}
        {...(rightIcon
          ? {
            rightAccessory: rightIcon,
          }
          : type === "password"
            ? {
              rightAccessory: () => <RightPasswordEyeIcon />,
              _isSecure: isPasswordVisible,
            }
            : type === "date" || type === "MonthAndDay"
              ? {
                rightAccessory: () => <RightDateIcon />,
              }
              : null)}
        type={type}
        ShowDatePicker={ShowDatePicker}
        toGetTextFieldValue={valueChange}
        inputContainerStyle={[
          localStyles.inputContainerStyle,
          inputStyle,
          localInputContainerStyle,
          { backgroundColor: backgroundColor ?? current.backgroundColor },
        ]}
        inputBoxStyle={[localStyles.inputBoxStyle]}
        _onFocus={onFocusInput}
        _onBlur={onBlurInput}
        {...(type === "mobile" && {
          keyBoardType: "number-pad",
          _maxLength: 10,
          insideLeftIcon: countryIcon,
        })}
        {...(type === "email" && {
          keyBoardType: "email-address",
          // insideLeftIcon: () => <EmailIcon />,
        })}
        {...(type === "number" && {
          keyBoardType: "number-pad",
          // insideLeftIcon: () => <EmailIcon />,
        })}
        // {...(type === 'password' && {
        //   insideLeftIcon: () => <LockIcon />,
        // })}
        {...inputProps}
      />
      <CountryPicker
        countryCode={"IN"}
        withFilter={true}
        visible={visiblePiker}
        withFlag={true}
        withFlagButton={true}
        onSelect={(country) => onSelectCountry(country)}
        withCallingCode={true}
        withAlphaFilter={true}
        withCountryNameButton={true}
        onClose={closeCountryPicker}
        renderFlagButton={() => {
          return null;
        }}
        theme={current.value === "dark" ? DARK_THEME : DEFAULT_THEME}
      />
    </Fragment>
  );
};
export default AddInput;

const localStyles = StyleSheet.create({
  inputContainerStyle: {
    borderRadius: moderateScale(6),
    borderWidth: moderateScale(1),
    ...styles.ph15,
  },
  inputBoxStyle: {
    maxHeight: 45,
    // ...styles.ph15,
  },
  countryPickerButton: {
    ...styles.alignStart,
    ...styles.justifyCenter,
  },
});
