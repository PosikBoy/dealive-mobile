import { colors } from "@/constants/colors";
import { FC, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const Shimmer: FC = () => {
  const shimmerOpacity = useSharedValue(0.3);

  useEffect(() => {
    shimmerOpacity.value = withRepeat(
      withTiming(0.7, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    return {
      opacity: shimmerOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.shimmer, shimmerStyle]} />
    </View>
  );
};

export default Shimmer;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgb(255, 255, 255)", // Полупрозрачный белый
  },
});
