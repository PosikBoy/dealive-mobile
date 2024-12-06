import * as SecureStore from "expo-secure-store";
import { IAuthResponseData } from "@/types/auth.interface";

class AuthStorage {
  saveTokens = async (refreshToken: string, accessToken: string) => {
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    await SecureStore.setItemAsync("accessToken", accessToken);
  };

  saveAuthData = async (authData: IAuthResponseData) => {
    await this.saveTokens(authData.refreshToken, authData.accessToken);
    await this.setIsAuth(true);
  };

  getAccessToken = async () => {
    try {
      const value = await SecureStore.getItemAsync("accessToken");
      return value || null;
    } catch (e) {
      console.log("Error getting access token:", e);
      return null;
    }
  };

  getRefreshToken = async () => {
    try {
      const value = await SecureStore.getItemAsync("refreshToken");
      return value || null;
    } catch (e) {
      console.log("Error getting refresh token:", e);
      return null;
    }
  };

  removeTokens = async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
    } catch (e) {
      console.log("Error removing tokens:", e);
    }
  };

  removeAuthData = async () => {
    await this.setIsAuth(false);
    await this.removeTokens();
  };

  setIsAuth = async (value: boolean) => {
    try {
      await SecureStore.setItemAsync("isAuth", value.toString());
    } catch (e) {
      console.log("Error setting isAuth:", e);
    }
  };

  getIsAuth = async () => {
    try {
      const value = await SecureStore.getItemAsync("isAuth");
      return value === "true";
    } catch (e) {
      console.log("Error getting isAuth:", e);
      return false;
    }
  };
}

const authStorage = new AuthStorage();
export default authStorage;
