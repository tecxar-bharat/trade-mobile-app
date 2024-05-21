//Library Imports
import React, { ReactElement, ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

//Local Imports
import { useAppSelector } from "../../store";
import { styles } from "../../themes";
import EText from "./EText";

interface IButton extends TouchableOpacityProps {
  title?: string;
  type?: string;
  color?: string;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  style?: TextStyle;
  icon?: ReactElement;
  frontIcon?: ReactElement;
  bgColor?: string;
  children?: ReactNode;
  height?: number;
  loading?: boolean;
  borderRadius?: number;
}

export default function EButton({
  title,
  type,
  color,
  onPress,
  loading,
  containerStyle,
  style,
  icon,
  frontIcon,
  bgColor,
  children,
  height,
  borderRadius,
  ...props
}: IButton) {
  const localStyle = StyleSheet.create({
    btnContainer: {
      height: height ? height : 50,
      borderRadius: 5,
    },
  });

  const colors = useAppSelector((state) => state.theme.current);
  return (
    <TouchableOpacity
      style={[
        localStyle.btnContainer,
        styles.rowCenter,
        containerStyle,
        bgColor
          ? { backgroundColor: bgColor }
          : { backgroundColor: colors.new_primary },
        { opacity: props.disabled || loading ? 0.3 : 1 },
      ]}
      onPress={onPress}
      {...props}
    >
      {frontIcon && frontIcon}
      {loading ? (
        <ActivityIndicator />
      ) : (
        title && (
          <EText
            type={"b16"}
            {...(style
              ? { style: { ...style, textTransform: "uppercase" } }
              : { style: { textTransform: "uppercase" } })}
            color={color ? color : colors.white}
          >
            {title}
          </EText>
        )
      )}
      {icon && icon}
      {children && children}
    </TouchableOpacity>
  );
}
