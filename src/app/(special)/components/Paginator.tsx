import {
  Animated,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { colors } from "@/constants/colors";

const Paginator = ({ data, scrollX }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [15, 40, 15],
          extrapolate: "clamp",
        });

        const dotColor = scrollX.interpolate({
          inputRange,
          outputRange: [colors.gray, colors.purple, colors.gray],
          extrapolate: "clamp",
        });
        const dotOpacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            style={[
              styles.dot,
              {
                width: dotWidth,
                backgroundColor: dotColor,
                opacity: dotOpacity,
              },
            ]}
            key={index.toString()}
          />
        );
      })}
    </View>
  );
};

export default Paginator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.purple,
    marginHorizontal: 5,
  },
});
