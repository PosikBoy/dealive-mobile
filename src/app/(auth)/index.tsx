import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import React from "react";
import box from "@/../assets/icons/box.png";
import MyButton from "@/components/ui/Button/Button";
import { router } from "expo-router";

const main = () => {
  const handleLogin = () => {
    router.push("/(auth)/login");
  };
  const handleRegister = () => {
    router.push("/(auth)/register");
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>DEALIVE</Text>
        <Text style={styles.subtitle}>Поможем с работой!</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={box} resizeMode="contain" />
      </View>
      <View style={styles.buttonContainer}>
        <MyButton buttonText="Войти" onPress={handleLogin} />
        <TouchableHighlight
          style={styles.registerButton}
          onPress={handleRegister}
          underlayColor="#fff"
        >
          <Text style={styles.registerLabel}> Зарегистрироваться</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  textContainer: {
    marginTop: 64,
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: "Montserrat-SemiBold",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
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
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
  },
});
