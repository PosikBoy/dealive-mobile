import * as SecureStore from "expo-secure-store";
import { IAuthResponseData } from "@/types/auth.interface";
import { IChat } from "@/types/chat.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthStorage {
  saveTokens = async (refreshToken: string, accessToken: string) => {
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    await SecureStore.setItemAsync("accessToken", accessToken);
  };

  saveAuthData = async (authData: IAuthResponseData) => {
    await this.saveTokens(authData.refreshToken, authData.accessToken);
    await this.setIsAuth(true);
  };

  setSupportChat = async (chat: IChat) => {
    try {
      await SecureStore.setItemAsync("supportChat", JSON.stringify(chat));
    } catch (e) {}
  };
  getSupportChat = async () => {
    try {
      const value = await SecureStore.getItemAsync("supportChat");
      return JSON.parse(value || "{}");
    } catch (e) {
      return null;
    }
  };
  getAccessToken = async () => {
    try {
      const value = await SecureStore.getItemAsync("accessToken");
      return value || null;
    } catch (e) {
      return null;
    }
  };

  getRefreshToken = async () => {
    try {
      const value = await SecureStore.getItemAsync("refreshToken");
      return value || null;
    } catch (e) {
      return null;
    }
  };

  removeTokens = async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
    } catch (e) {}
  };

  removeAuthData = async () => {
    await this.setIsAuth(false);
    await this.setSupportChat(null);
    await this.removeTokens();
    await AsyncStorage.clear();
  };

  setIsAuth = async (value: boolean) => {
    try {
      await SecureStore.setItemAsync("isAuth", value.toString());
    } catch (e) {}
  };

  getIsAuth = async () => {
    try {
      const value = await SecureStore.getItemAsync("isAuth");
      return value === "true";
    } catch (e) {
      return false;
    }
  };
}

const authStorage = new AuthStorage();
export default authStorage;
