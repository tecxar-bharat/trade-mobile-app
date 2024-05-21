import { StyleSheet, Text, View } from 'react-native';
import { MultiSelect as Multi_Select } from 'react-native-element-dropdown';
import { useAppSelector } from '@store/index';
import { themeSelector } from '@reducers/theme.reducer';
import EText from '@commonComponents/EText';
import { colors } from '@themes/index';
const MultiSelect = ({
  value,
  onChange,
  search,
  options,
  error,
  required,
  labelField,
  label,
  dropdownPosition,
  valueField,
  placeholder,
  disabled,
  searchPlaceholder,
}: any) => {
  const current = useAppSelector(state => themeSelector(state, 'current'));
  const _errorText = error ? error.message : null;
  return (
    <View>
      {label && (
        <View style={{ flexDirection: 'row' }}>
          <EText style={styles.text}>{label}</EText>
          {required && <EText style={{ color: current.red }}>*</EText>}
        </View>
      )}

      <Multi_Select
        style={[
          styles.dropdown,
          disabled && styles.background,
          { backgroundColor: current.cardBackround },
        ]}
        containerStyle={[
          styles.contaner,
          { backgroundColor: current.cardBackround },
        ]}
        placeholderStyle={[styles.placeholderStyle, { color: current.textOne }]}
        selectedTextStyle={[
          styles.selectedTextStyle,
          { color: current.textOne },
        ]}
        data={options}
        search={search}
        dropdownPosition={dropdownPosition ?? 'auto'}
        itemTextStyle={{ color: '#000000' }}
        maxHeight={300}
        labelField={labelField}
        valueField={valueField}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        value={value ?? []}
        onChange={(item: any) => {
          onChange(item);
        }}
      />

      {_errorText && _errorText !== '' ? (
        <EText
          style={{
            color: current.alertColor,
          }}>
          {_errorText}
        </EText>
      ) : null}
    </View>
  );
};

export default MultiSelect;
const styles = StyleSheet.create({
  contaner: {
    borderRadius: 10,
  },
  dropdown: {
    height: 30,
    borderColor: colors.light.grayScale4,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 5,
  },

  background: {
    backgroundColor: colors.light.cardBackround,
  },
  placeholderStyle: {
    marginLeft: 10,
    fontSize: 14,
  },
  selectedTextStyle: {
    marginLeft: 10,
    fontSize: 12,
  },
  icon: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
  },
  fildcolor: {
    color: colors.light.grayScale7,
    fontSize: 12,
  },
  close: {
    color: colors.light.black,
  },
  text: {
    color: colors.light.grayScale3,
  },
});
