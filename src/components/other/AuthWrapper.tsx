import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchAuthStatus,
  fetchIsApprovedStatus,
} from "@/store/auth/auth.actions";
import { Redirect } from "expo-router";
import { colors } from "@/constants/colors";

type Props = {
  children: React.ReactNode;
};

const AuthWrapper: FC<Props> = ({ children }) => {
  const dispatch = useTypedDispatch();
  const { isAuth, isApproved, isLoading, error } = useTypedSelector(
    (state) => state.auth
  );

  const [isInitialLoading, setIsInitialLoading] = useState(true); // Локальное состояние загрузки

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem("isAuth");
        if (storedAuth) {
          await dispatch(fetchAuthStatus()).unwrap();
          await dispatch(fetchIsApprovedStatus()).unwrap();
        }
      } catch (err) {
        console.error("Ошибка проверки авторизации:", err);
      } finally {
        setIsInitialLoading(false); // Завершаем инициализацию
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  if (isInitialLoading || isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ошибка: {error}</Text>
      </View>
    );
  }

  if (!isAuth) {
    return <Redirect href="/onBoarding" />;
  }

  if (!isApproved) {
    return <Redirect href="/waitForApproval" />;
  }

  return <>{children}</>; // Рендерим детей только после успешной проверки
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default AuthWrapper;
