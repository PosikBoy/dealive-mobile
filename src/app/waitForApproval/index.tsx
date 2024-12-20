import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import MyButton from "@/components/ui/Button/Button";
import { colors } from "@/constants/colors";

import { router } from "expo-router";
import { useTypedSelector } from "@/hooks/redux.hooks";
import { icons } from "@/constants/icons";
import { fonts } from "@/constants/styles";

const waitForApproval = () => {
  const { isApproved, isLoading, error } = useTypedSelector(
    (state) => state.auth
  );

  const checkApproval = async () => {
    router.replace("/");
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Вы успешно зарегистрировались</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={icons.success}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Поздравляем!</Text>
        <Text style={styles.subtitle}>
          Вы успешно зарегистрировались. Обработка ваших персональных данных
          займет около двух часов. Спасибо за ожидание.
        </Text>
      </View>
      {isLoading && <ActivityIndicator size="large" color={colors.purple} />}
      {!isApproved && (
        <Text style={styles.subtitle}>Мы все еще проверяем ваш аккаунт</Text>
      )}
      {error && <Text style={styles.subtitle}>{error}</Text>}

      <View style={styles.buttonContainer}>
        <MyButton
          buttonText="Проверить подтверждение"
          onPress={checkApproval}
        />
      </View>
    </View>
  );
};

export default waitForApproval;

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
    fontFamily: fonts.semiBold,
  },
  subtitle: {
    width: "100%",
    fontSize: 16,
    textAlign: "center",

    fontFamily: fonts.regular,
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
  },
  buttonContainer: {
    width: "100%",
    position: "absolute",
    bottom: 20,
  },
});
