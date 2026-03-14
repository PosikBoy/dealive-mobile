import { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';

const Shimmer: FC = () => {
  const { colors } = useTheme();
  const shimmerOpacity = useSharedValue(0.3);

  useEffect(() => {
    shimmerOpacity.value = withRepeat(
      withTiming(0.1, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      true,
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    return {
      opacity: shimmerOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.shimmer, shimmerStyle, { backgroundColor: colors.textSecondary }]}
      />
    </View>
  );
};

export default Shimmer;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
