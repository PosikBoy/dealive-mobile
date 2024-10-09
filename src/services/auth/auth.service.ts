import axios from "axios";
import "dotenv/config";
import { LOGIN_URL, REFRESH_TOKEN_URL, REGISTER_URL } from "@/constants/urls";
import {
  IAuthResponseData,
  ILoginRequestData,
  IRegisterRequestData,
} from "./auth.types";
import authHelper from "@/helpers/auth.helper";

class AuthService {
  async login(data: ILoginRequestData) {
    try {
      const response = await axios.post<
        ILoginRequestData,
        { data: IAuthResponseData }
      >(LOGIN_URL + "/" + "login", data);
      if (response?.data.accessToken) {
        authHelper.saveAuthData(response.data);
      }
      return response.data;
    } catch (error: any) {
      throw Error(error.response.data.message);
    }
  }
  async register(data: IRegisterRequestData) {
    try {
      const response = await axios.post<
        IRegisterRequestData,
        { data: IAuthResponseData }
      >(REGISTER_URL, data);

      if (response?.data.accessToken) {
        authHelper.saveAuthData(response.data);
      }
      return response.data;
    } catch (error: any) {
      throw Error(error.response.data.message);
    }
  }
  async getNewTokens() {
    try {
      const response = await axios.get<string, { data: IAuthResponseData }>(
        REFRESH_TOKEN_URL,
        { withCredentials: true }
      );

      if (response.data.accessToken) {
        authHelper.saveAuthData(response.data);
      }

      return response.data;
    } catch (error: any) {
      throw Error(error.response.data.message);
    }
  }
  async logOut() {
    try {
      authHelper.removeAuthData();
      return true;
    } catch (error: any) {
      throw Error(error.response.data.message);
    }
  }
}

const authService = new AuthService();
export default authService;
