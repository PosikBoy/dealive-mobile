import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import MyButton from "@/components/ui/Button/Button";
import { colors } from "@/constants/colors";

import { router } from "expo-router";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import { icons } from "@/constants/icons";
import {
  fetchAuthStatus,
  fetchIsApprovedStatus,
} from "@/store/auth/auth.actions";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

const waitForApproval = () => {
  const colorScheme = useColorScheme();
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
    <View
      style={[styles.container, { backgroundColor: colors[colorScheme].white }]}
    >
      <View style={styles.header}>
        <ThemedText type="title" weight="bold">
          Вы успешно зарегистрировались
        </ThemedText>
      </View>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={icons.success}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textContainer}>
        <ThemedText type="title" weight="bold">
          Поздравляем!
        </ThemedText>
        <ThemedText type="subtitle">
          Вы успешно зарегистрировались. Обработка ваших персональных данных
          займет около двух часов. Спасибо за ожидание.
        </ThemedText>
      </View>

      {error && <ThemedText color="red">{error}</ThemedText>}
      {}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.purple} />
      ) : (
        !isApproved && (
          <ThemedText type="subtitle">
            Мы все еще проверяем ваш аккаунт{" "}
          </ThemedText>
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
