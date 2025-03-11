import { View, StyleSheet, Image, ToastAndroid } from "react-native";
import React from "react";
import NetInfo from "@react-native-community/netinfo";
import MyButton from "@/components/ui/Button/Button";
import { router } from "expo-router";
import { icons } from "@/constants/icons";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

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
      <ThemedText type="title" weight="bold">
        Нет подключения к интернету
      </ThemedText>
      <ThemedText type="subtitle" weight="bold" color="gray">
        Проверьте соединение и попробуйте еще раз
      </ThemedText>
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
  buttonContainer: {
    width: "100%",
    flex: 1,
    position: "absolute",
    bottom: 16,
  },
});

export default index;
