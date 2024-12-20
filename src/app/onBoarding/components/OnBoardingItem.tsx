import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/styles";

const OnBoardingItem = ({ title, subtitle, iconUri }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.container, { width }]}>
      <Image
        source={iconUri}
        style={[styles.image, { width, resizeMode: "contain" }]}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
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
  title: {
    fontFamily: fonts.semiBold,
    color: colors.black,
    fontSize: 24,
  },
  subtitle: {
    fontFamily: fonts.regular,
    color: colors.black,
    fontSize: 14,
  },
});
