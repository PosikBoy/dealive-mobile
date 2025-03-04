import React, { useEffect, useState } from "react";
import Orders from "@/components/screens/Orders/Orders";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import * as Font from "expo-font";
import { fonts } from "@/constants/fonts";
import authStorage from "@/helpers/authStorage";
import {
  fetchAuthStatus,
  fetchIsApprovedStatus,
  logOut,
} from "@/store/auth/auth.actions";
import * as SplashScreen from "expo-splash-screen";
import { Redirect } from "expo-router";

const TabsLayout = () => {
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

  if (error) {
    dispatch(logOut());
  }

  if (!isAuth && isAppReady) {
    return <Redirect href={{ pathname: "/(special)/onBoarding" }} />;
  }

  if (!isApproved && isAppReady) {
    return <Redirect href={{ pathname: "/(special)/waitForApproval" }} />;
  }

  return <Orders />;
};

export default TabsLayout;
