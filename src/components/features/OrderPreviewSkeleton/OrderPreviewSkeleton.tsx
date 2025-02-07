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

const OrderPreviewSkeleton: FC = () => {
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
  }, []); // Запуск анимации только один раз при монтировании компонента

  const shimmerStyle = useAnimatedStyle(() => {
    return {
      opacity: shimmerOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animated.View style={[styles.shimmer, shimmerStyle]} />
      </View>
      <View style={styles.addresses}>
        <View style={styles.address}>
          <Animated.View style={[styles.shimmer, shimmerStyle]} />
        </View>
        <View style={styles.address}>
          <Animated.View style={[styles.shimmer, shimmerStyle]} />
        </View>
      </View>
      <View style={styles.footer}>
        <Animated.View style={[styles.shimmer, shimmerStyle]} />
      </View>
    </View>
  );
};

export default OrderPreviewSkeleton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 250,
    width: "100%",
    gap: 20,
    alignItems: "center",
  },
  addresses: {
    gap: 15,
    width: "100%",
  },
  header: {
    height: 40,
    width: 150,
    borderRadius: 10,
    backgroundColor: "rgb(136, 136, 136)",
    position: "relative",
  },
  footer: {
    height: 50,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "rgb(136, 136, 136)",
    position: "relative",
  },
  address: {
    width: "100%",
    height: 30,
    backgroundColor: "rgb(136, 136, 136)",
    borderRadius: 10,
    overflow: "hidden",
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
