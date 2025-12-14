import Orders from "@/components/screens/Orders/Orders";
import { fonts } from "@/constants/fonts";
import authStorage from "@/helpers/authStorage";
import { useTypedDispatch, useTypedSelector } from "@/hooks/redux.hooks";
import {
  fetchAuthStatus,
  fetchIsApprovedStatus,
  logOut,
} from "@/store/auth/auth.actions";
import * as Font from "expo-font";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";

const TabsLayout = () => {
  const dispatch = useTypedDispatch();

  const { isAuth, isApproved, error } = useTypedSelector((state) => state.auth);

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
      console.log("aksdn");
      await SplashScreen.hideAsync();
      setIsAppReady(true);
    }
  };

  useEffect(() => {
    console.log("some data");
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
