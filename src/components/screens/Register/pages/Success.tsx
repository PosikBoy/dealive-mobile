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
import SuccessIcon from "assets/icons/success.png";
const Success = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ваш аккаунт на подтверждении</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={SuccessIcon} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Поздравляем!</Text>
        <Text style={styles.subtitle}>
          Вы успешно зарегистрировались. Обработка ваших персональных данных
          займет около двух часов. Спасибо за ожидание.
        </Text>
      </View>
    </View>
  );
};

export default Success;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    width: "100%",
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Montserrat-SemiBold",
  },
  subtitle: {
    width: "100%",
    fontSize: 16,
    textAlign: "center",

    fontFamily: "Montserrat-Regular",
  },
  imageContainer: {
    marginTop: 50,
    height: 200,
    width: 200,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    width: "100%",
    marginTop: 50,
    gap: 15,
    textAlign: "center",

    alignItems: "center",
  },
});
