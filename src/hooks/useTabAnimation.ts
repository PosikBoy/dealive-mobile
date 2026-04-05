import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

const ANIMATION_OFFSET = 20;

interface TabAnimations {
  availableTranslate: Animated.AnimatedInterpolation<number>;
  activeTranslate: Animated.AnimatedInterpolation<number>;
  routeTranslate: Animated.AnimatedInterpolation<number>;
  availableOpacity: Animated.AnimatedInterpolation<number>;
  activeOpacity: Animated.AnimatedInterpolation<number>;
  routeOpacity: Animated.AnimatedInterpolation<number>;
}

export const useTabAnimation = (activeTab: string, tabs: string[]): TabAnimations => {
  const tabAnimation = useRef(new Animated.Value(tabs.indexOf(activeTab))).current;

  useEffect(() => {
    Animated.spring(tabAnimation, {
      toValue: tabs.indexOf(activeTab),
      useNativeDriver: true,
      bounciness: 5,
      speed: 12,
    }).start();
  }, [activeTab, tabs, tabAnimation]);

  const availableTranslate = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, -ANIMATION_OFFSET, -ANIMATION_OFFSET],
      }),
    [tabAnimation],
  );

  const activeTranslate = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [ANIMATION_OFFSET, 0, -ANIMATION_OFFSET],
      }),
    [tabAnimation],
  );

  const routeTranslate = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [ANIMATION_OFFSET, -ANIMATION_OFFSET, 0],
      }),
    [tabAnimation],
  );

  const availableOpacity = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [1, 0, 0],
      }),
    [tabAnimation],
  );

  const activeOpacity = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 1, 0],
      }),
    [tabAnimation],
  );

  const routeOpacity = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 0, 1],
      }),
    [tabAnimation],
  );

  return {
    availableTranslate,
    activeTranslate,
    routeTranslate,
    availableOpacity,
    activeOpacity,
    routeOpacity,
  };
};
