import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MyButton from "@/components/ui/Button/Button";
import { colors } from "@/constants/colors";

import { router } from "expo-router";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import { icons } from "@/constants/icons";
import { fonts } from "@/constants/styles";
import {
  fetchAuthStatus,
  fetchIsApprovedStatus,
} from "@/store/auth/auth.actions";

const waitForApproval = () => {
  const { isApproved, isLoading, error } = useTypedSelector(
    (state) => state.auth
  );

  const dispatch = useTypedDispatch();

  const checkApproval = async () => {
    try {
      await dispatch(fetchAuthStatus()).unwrap();
      const isApproved = await dispatch(fetchIsApprovedStatus()).unwrap();
      if (isApproved) {
        router.replace("/");
      }
    } catch (error) {
      console.log(error);
    }
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

      {error && <Text style={styles.subtitle}>{error}</Text>}
      {}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.purple} />
      ) : (
        !isApproved && (
          <Text style={styles.approvalText}>
            Мы все еще проверяем ваш аккаунт{" "}
          </Text>
        )
      )}

      <View style={styles.supportButton}>
        <MyButton
          buttonText="Связаться с техподдержкой"
          onPress={() => Linking.openURL("https://t.me/DealiveSupport")}
        />
      </View>
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
    backgroundColor: colors.white,
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
  approvalText: {
    width: "100%",
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.bold,
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
  supportButton: {
    width: "100%",
    position: "absolute",
    bottom: 80,
  },
});
