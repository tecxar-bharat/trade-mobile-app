import { useNavigation } from "@react-navigation/native";
import React, { Fragment } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { getHeight, moderateScale } from "../../common/constants";
import { SCREENS } from "../../navigation/NavigationKeys";
import { useAppSelector } from "../../store";
import { styles } from "../../themes";
import typography from "../../themes/typography";
import EText from "./EText";

export default EInput = (props) => {
  let {
    type,
    _value,
    label,
    inputContainerStyle,
    inputBoxStyle,
    toGetTextFieldValue,
    placeHolder,
    _onFocus,
    _onBlur,
    _errorText,
    _autoFocus,
    _isSecure,
    _maxLength,
    autoCapitalize,
    required = false,
    labelStyle,
    multiline,
    errorStyle,
    fieldRef,
    insideLeftIcon,
    showError = true,
    rightAccessory,
    ShowDatePicker,
    keyBoardType,
  } = props;

  const colors = useAppSelector((state) => state.theme.current);
  const navigation = useNavigation();
  // Change Text Input Value
  const onChangeText = (val) => {
    toGetTextFieldValue(val);
  };

  return (
    <View style={styles.mv10}>
      {label && (
        <View style={[localStyle.labelContainer, labelStyle]}>
          <View style={styles.flexRow}>
            <EText
              style={localStyle.labelText}
              type={"s14"}
              color={colors.textColor}
            >
              {label}
            </EText>
            {required && (
              <EText style={{ color: colors.alertColor }}>{" *"}</EText>
            )}
          </View>
        </View>
      )}
      <View
        style={[
          localStyle.inputContainer,
          {
            borderColor: _errorText ? colors.red : colors.bcolor,
            // minHeight: getHeight(60),
          },
          inputContainerStyle,
          props.disabled === true && { backgroundColor: colors.grey },
        ]}
      >
        {insideLeftIcon ? (
          <View style={styles.pl10}>{insideLeftIcon()}</View>
        ) : null}

        {type === "location" ? (
          <Fragment>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                navigation.navigate(SCREENS.AddressPicker, {
                  onPress: onChangeText,
                })
              }
            >
              <EText>{_value}</EText>
            </TouchableOpacity>
          </Fragment>
        ) : type === "datetime" ||
          type === "date" ||
          type === "MonthAndDay" ||
          type === "time" ? (
          <Fragment>
            <TouchableOpacity style={{ flex: 1 }} onPress={ShowDatePicker}>
              <EText>{_value}</EText>
            </TouchableOpacity>
          </Fragment>
        ) : (
          <TextInput
            ref={fieldRef}
            secureTextEntry={_isSecure}
            value={_value ? _value.toString() : _value}
            maxLength={_maxLength}
            defaultValue={_value}
            autoFocus={_autoFocus}
            autoCorrect={false}
            {...(multiline && {
              textAlignVertical: "top",
            })}
            autoCapitalize={autoCapitalize}
            placeholderTextColor={colors.placeHolderColor}
            onChangeText={onChangeText}
            multiline={multiline}
            onFocus={_onFocus}
            onBlur={_onBlur}
            editable={props.disabled ? false : true}
            placeholder={placeHolder}
            style={[
              localStyle.inputBox,
              { color: colors.textColor },
              { height: multiline ? null : getHeight(60) },
              inputBoxStyle,
            ]}
            {...(keyBoardType && { keyBoardType })}
            {...props}
          />
        )}

        {/* Right Icon And Content Inside TextInput */}
        <View>{rightAccessory ? rightAccessory() : null}</View>
      </View>
      {/* Error Text Message Of Input */}
      {_errorText && _errorText !== "" ? (
        <EText
          style={{
            ...localStyle.errorText,
            ...errorStyle,
            color: colors.alertColor,
          }}
        >
          {_errorText}
        </EText>
      ) : null}

      {_maxLength && showError && _value?.length > _maxLength ? (
        <EText style={{ ...localStyle.errorText, ...errorStyle }}>
          {`It should be maximum ${_maxLength} character`}
        </EText>
      ) : null}
    </View>
  );
};

const localStyle = StyleSheet.create({
  labelText: {
    textAlign: "left",
    opacity: 0.9,
  },
  inputBox: {
    ...typography.fontSizes.f14,
    ...typography.fontWeights.Regular,
    ...styles.ph10,
    ...styles.flex,
  },
  inputContainer: {
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(6),
    ...styles.rowSpaceBetween,
    width: "100%",
  },
  labelContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mb5,
  },
  errorText: {
    textAlign: "left",
    ...typography.fontSizes.f12,
    ...styles.mt5,
    ...styles.ml10,
  },
});
