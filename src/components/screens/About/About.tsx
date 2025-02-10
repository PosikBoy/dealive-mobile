import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "@/components/shared/Header/Header";
import logo from "assets/adaptive-icon.png";

import { colors } from "@/constants/colors";
import { fonts, fontSizes } from "@/constants/styles";

const About = () => {
  return (
    <View style={styles.container}>
      <Header title="О приложении" />
      <View style={styles.content}>
        <Image source={logo} style={{ width: 200, height: 200 }} />
        <Text style={styles.text}>Версия приложения: 1.1.2</Text>
        <Text style={styles.text}>Создано в учебных целях</Text>
      </View>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.white,
  },
  content: {
    marginTop: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 20,
    fontFamily: fonts.regular,
    fontSize: fontSizes.medium,
    color: colors.black,
  },
});
