import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ANIMATION_DURATION, BANNER_HEIGHT } from '../constants';

interface IUseToastAnimation {
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
  animateIn: () => void;
  animateOut: (onDone?: () => void) => void;
}

export const useToastAnimation = (): IUseToastAnimation => {
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
    overflow: 'hidden',
  }));

  const animateIn = () => {
    height.value = withTiming(BANNER_HEIGHT, { duration: ANIMATION_DURATION });
    opacity.value = withTiming(1, { duration: ANIMATION_DURATION });
  };

  const animateOut = (onDone?: () => void) => {
    opacity.value = withTiming(0, { duration: ANIMATION_DURATION });
    height.value = withTiming(0, { duration: ANIMATION_DURATION }, finished => {
      if (finished && onDone) {
        runOnJS(onDone)();
      }
    });
  };

  return { animatedStyle, animateIn, animateOut };
};
