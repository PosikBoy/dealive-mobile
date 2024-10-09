import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import NetInfo from "@react-native-community/netinfo";
import noConnectionImage from "@/../assets/icons/noConnection.png";
import { colors } from "@/constants/colors";

const index = () => {
  const handleCheckConnection = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        // Перенаправляем пользователя на другой экран
        console.log("Redirecting to another screen...");
      } else {
        console.log("No internet connection");
      }
    });
  };

  return (
    <View style={styles.container}>
      <Image source={noConnectionImage} />
      <Text>Нет подключения к интернету</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "semibold",
    color: colors.black,
  },
});

export default index;
