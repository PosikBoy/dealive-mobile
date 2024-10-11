import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import React from "react";
import box from "@/../assets/icons/box.png";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MyButton from "@/components/ui/Button/Button";

const main = () => {
  const route = useRoute();
  console.log(route.name);
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>DEALIVE</Text>
        <Text style={styles.subtitle}>Поможем с работой!</Text>
      </View>
      <Image
        style={styles.image}
        source={box}
        style={{ width: 200, height: 200 }}
      />
      <View>
        <MyButton buttonText="Войти" handlePress={() => {}} />
        <TouchableHighlight>
          <Text>Зарегистрироваться</Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

export default main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Montserrat-SemiBold",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
});
