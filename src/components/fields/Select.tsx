import EText from "@components/common/EText";
import { useAppSelector } from "@store/index";
import { themeSelector } from "@store/reducers/theme.reducer";
import React from "react";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Entypo from "react-native-vector-icons/Entypo";
const Select = ({
  value,
  onChange,
  error,
  required,
  options,
  label,
  placeholder,
  labelKey,
  valueKey,
  disabled,
  onValueChange,
  search,
  isClearable,
  marginTop,
  textTransform,
  ...inputProps
}: any) => {
  const getValue = () => {
    return options.find((e: any) => e[valueKey] === value);
  };
  const current = useAppSelector((state) => themeSelector(state, "current"));
  const _errorText = error ? error.message : null;
  const [isFocused, setIsFocused] = useState(false);

  const onBlur = () => {
    setIsFocused(false)
  }

  const onFocus = () => {
    setIsFocused(true)
  }


  return (
    <View>
      {label && (
        <View style={{ flexDirection: "row", marginTop: marginTop }}>
          <EText
            style={{ textAlign: "left", opacity: 0.9 }}
            type={"s14"}
            color={current.textColor}
          >
            {label}
          </EText>
          {required && <EText style={{ color: current.red }}>*</EText>}
        </View>
      )}
      <View style={{ marginTop: 5, flexDirection: "row" }}>
        <Dropdown
          style={[
            styles.dropdown,
            {
              backgroundColor: current.backgroundColor,
              borderColor: isFocused ? current.primary : current.bcolor,
            },
            disabled && { backgroundColor: current.grey },
          ]}
          containerStyle={[
            styles.container,
            { backgroundColor: current.backgroundColor },
          ]}
          placeholderStyle={[
            styles.placeholderStyle,
            { color: current.textColor },
          ]}
          activeColor={current.primaryLight}
          selectedTextStyle={[
            styles.selectedTextStyle,
            { color: current.textColor, textTransform: textTransform ?? 'none' },
          ]}
          fontFamily='OpenSans-Medium'
          inputSearchStyle={{ ...styles.inputSearchStyle, color: current.textColor }}
          iconStyle={styles.icon}
          data={options}
          searchPlaceholder="Search..."
          search={true}
          // maxHeight={200}
          labelField={labelKey}
          valueField={valueKey}
          placeholder={placeholder ? placeholder : `Select${label ? ` ${label}` : ''}`}
          value={getValue()}
          renderRightIcon={() => {
            if (getValue() && isClearable !== false) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (onChange) {
                      onChange(null);
                    }
                    if (onValueChange) {
                      onValueChange(null);
                    }
                  }}
                >
                  <Entypo
                    name={"cross"}
                    size={22}
                    color={current.textColor}
                    style={{ paddingHorizontal: 10 }}
                  />
                </TouchableOpacity>
              );
            }
            return (
              <Entypo
                name={"chevron-down"}
                size={22}
                color={current.textColor}
                style={{ paddingHorizontal: 10 }}
              />
            );
          }}
          onChange={(e: any) => {
            if (onChange) {
              onChange(e[valueKey]);
            }
            if (onValueChange) {
              onValueChange(e);
            }
          }}
          disable={disabled}
          itemTextStyle={{ textTransform: textTransform ?? 'none', color: current.textColor }}
          onFocus={onFocus}
          onBlur={onBlur}
          {...inputProps}
        />
      </View>
      {error && <EText style={{ color: current.red }}>{error.message}</EText>}
    </View>
  );
};

export default Select;

// const localStyles = StyleSheet.create({
//   dropdownStyle: {
//     // height: getHeight(60),
//     // borderRadius: moderateScale(9),
//     // borderWidth: moderateScale(1),
//     // ...styles.ph25,
//     height: 30,
//     borderColor: "grey",
//     borderWidth: 1,
//     borderRadius: 5,
//     marginRight: 5,
//     flex: 1,
//   },
//   labelText: {
//     textAlign: "left",
//     opacity: 0.9,
//   },
//   errorText: {
//     textAlign: "left",
//     ...typography.fontSizes.f12,
//     ...styles.mt5,
//     ...styles.ml10,
//   },
//   labelContainer: {
//     ...styles.mt10,
//     // ...styles.rowSpaceBetween,
//     ...styles.mb5,
//   },
// });
const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
  dropdown: {
    height: 45,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 5,
    flex: 1,
  },

  background: {
    backgroundColor: "white",
  },
  placeholderStyle: {
    marginLeft: 10,
    fontSize: 14,
  },
  selectedTextStyle: {
    marginLeft: 10,
    fontSize: 14,
  },
  icon: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
  },
  fildcolor: {
    color: "grey",
    fontSize: 14,
  },
  close: {
    color: "#000000",
  },
});
