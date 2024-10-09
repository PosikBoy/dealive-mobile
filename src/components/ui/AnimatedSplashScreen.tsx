import React, { useEffect, useRef, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedSplashScreen = ({ isAppReady, splashScreenImage, children }) => {
  const opacity = useSharedValue(1);

  const animatedContainerStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedImageStyles = useAnimatedStyle(() => ({
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  }));

  useEffect(() => {
    if (isAppReady) {
      opacity.value = withTiming(0, {
        duration: 1000,
        easing: Easing.in(Easing.quad),
        reduceMotion: ReduceMotion.System,
      });
    }
  }, [isAppReady, opacity]);

  return (
    <Animated.View style={[styles.splashScreenStyle, animatedContainerStyles]}>
      <Animated.Image
        source={splashScreenImage}
        style={[styles.splashScreenImage, animatedImageStyles]}
      />
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  splashScreenStyle: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  splashScreenImage: {
    flex: 1,
  },
});

export default AnimatedSplashScreen;
