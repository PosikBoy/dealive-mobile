import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import MyButton from "@/components/ui/Button/Button";
import { router } from "expo-router";
import { icons } from "@/constants/icons";
import { fonts } from "@/constants/styles";
import { colors } from "@/constants/colors";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

const index = () => {
  const colorScheme = useColorScheme();
  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors[colorScheme].white }]}
    >
      <View style={styles.textContainer}>
        <ThemedText type="title" weight="bold" align="left">
          DEALIVE
        </ThemedText>
      </View>
      <ThemedText type="subtitle" weight="bold" align="left">
        Поможем с работой!
      </ThemedText>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={icons.box} resizeMode="contain" />
      </View>
      <View style={styles.buttonContainer}>
        <MyButton buttonText="Войти" onPress={handleLogin} />
        <TouchableHighlight
          style={styles.registerButton}
          onPress={handleRegister}
          underlayColor="#fff"
        >
          <ThemedText style={styles.registerLabel}>
            {" "}
            Зарегистрироваться
          </ThemedText>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  textContainer: {
    marginTop: 64,
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.semiBold,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  imageContainer: {
    marginTop: 50,
    height: 300,
    width: 300,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },

  buttonContainer: {
    marginTop: 50,
    width: "100%",
    gap: 15,
    flex: 1,
  },
  registerButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignSelf: "center",
  },
  registerLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
  },
});
