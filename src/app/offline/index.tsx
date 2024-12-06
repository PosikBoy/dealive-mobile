import { View, Text, StyleSheet, Image, ToastAndroid } from "react-native";
import React from "react";
import NetInfo from "@react-native-community/netinfo";
import { colors } from "@/constants/colors";
import MyButton from "@/components/ui/Button/Button";
import { router } from "expo-router";
import { icons } from "@/constants/icons";

const index = () => {
  const handleCheckConnection = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        router.replace("/");
      } else {
        ToastAndroid.show("Нет подключения к интернету", ToastAndroid.SHORT);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Image source={icons.noConnection} style={styles.image} />
      <Text style={styles.title}>Нет подключения к интернету</Text>
      <Text style={styles.subtitle}>
        Проверьте соединение и попробуйте еще раз
      </Text>
      <View style={styles.buttonContainer}>
        <MyButton
          buttonText="Проверить соединение"
          onPress={handleCheckConnection}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "semibold",
    color: colors.black,
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
    marginTop: 10,
  },
  buttonContainer: {
    width: "100%",
    flex: 1,
    position: "absolute",
    bottom: 16,
  },
});

export default index;
