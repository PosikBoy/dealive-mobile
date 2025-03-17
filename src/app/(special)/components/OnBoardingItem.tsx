import { Image, StyleSheet, useWindowDimensions, View } from "react-native";
import React from "react";
import { colors } from "@/constants/colors";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

const OnBoardingItem = ({ title, subtitle, iconUri }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.container, { width }]}>
      <Image
        source={iconUri}
        style={[styles.image, { width, resizeMode: "contain" }]}
      />
      <View style={styles.textContainer}>
        <ThemedText type="title" weight="bold" style={{ textAlign: "left" }}>
          {title}
        </ThemedText>
        <ThemedText type="mediumText" style={{ textAlign: "left" }}>
          {subtitle}
        </ThemedText>
      </View>
    </View>
  );
};
export default OnBoardingItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  textContainer: {
    gap: 15,
  },
});
