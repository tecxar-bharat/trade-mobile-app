import React, { useEffect } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import LottieView from 'lottie-react-native';

type IMode = "fullscreen" | "button";
type ISize = "small" | "medium" | "large";

const ELoader = ({
  loading,
  mode,
  size,
}: {
  loading: boolean;
  mode: IMode;
  size: ISize;
}) => {
  const spinValue = new Animated.Value(0);

  const spin = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1200, // Adjust the duration as needed
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => spin());
  };

  useEffect(() => {
    spin();
  }, []);

  const getSize = () => {
    if (size === "large") {
      return 60;
    } else if (size === "medium") {
      return 40;
    } else {
      return 20;
    }
  };

  if (!loading) {
    return null;
  }

  return (
    <View style={mode === "fullscreen" ? styles.fullScreen : styles.button}>
      <LottieView source={require('../../assets/animatedIcon/spinner.json')} autoPlay loop style={{ width: getSize(), height: getSize() }} />
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ELoader;
