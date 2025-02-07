import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect, useState } from "react";
import * as Font from "expo-font";
import { fonts } from "@/constants/fonts";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import {
  fetchAuthStatus,
  fetchIsApprovedStatus,
  logOut,
} from "@/store/auth/auth.actions";
import { Redirect, SplashScreen } from "expo-router";
import { colors } from "@/constants/colors";
import authStorage from "@/helpers/authStorage";

SplashScreen.preventAutoHideAsync();

const indexPage = () => {
  const dispatch = useTypedDispatch();
  const { isAuth, isApproved, isLoading, error } = useTypedSelector(
    (state) => state.auth
  );
  const [isAppReady, setIsAppReady] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync(fonts);
  };

  const checkAuthStatus = async () => {
    try {
      const storedAuth = await authStorage.getIsAuth();
      if (storedAuth) {
        await dispatch(fetchAuthStatus()).unwrap();
        await dispatch(fetchIsApprovedStatus()).unwrap();
      }
    } catch (err) {
      console.log(err);
    } finally {
      await SplashScreen.hideAsync();
      setIsAppReady(true);
    }
  };

  useEffect(() => {
    loadFonts();
    checkAuthStatus();
  }, []);

  if (!isAppReady || isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  if (error) {
    dispatch(logOut());
  }

  if (!isAuth) {
    return <Redirect href={{ pathname: "/onBoarding" }} />;
  }

  if (!isApproved) {
    return <Redirect href={{ pathname: "/waitForApproval" }} />;
  }

  return <Redirect href={{ pathname: "/orders/main" }} />;
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default indexPage;
