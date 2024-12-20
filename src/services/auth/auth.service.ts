import axios from "axios";
import {
  GET_IS_APPROVAL,
  IS_USER_EXIST_URL,
  LOGIN_URL,
  REFRESH_TOKEN_URL,
  REGISTER_URL,
} from "@/constants/urls";
import {
  IAuthResponseData,
  IIsUserExist,
  ILoginRequestData,
  IRegisterRequestData,
} from "@/types/auth.interface";
import authHelper from "@/helpers/authStorage";
import instance from "@/axios/interceptor";
import { errorCatch } from "@/helpers/errorCatch";

class AuthService {
  async login(data: ILoginRequestData) {
    try {
      const response = await axios.post<
        ILoginRequestData,
        { data: IAuthResponseData }
      >(LOGIN_URL, data);
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
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "documentFiles" && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`documentFiles`, {
              uri: file.uri,
              name: file.fileName,
              type: file.mimeType,
            } as any); // Cast для React Native
          });
        } else {
          formData.append(key, value as string);
        }
      });

      const response = await axios.post<
        IRegisterRequestData,
        { data: IAuthResponseData }
      >(REGISTER_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response?.data.accessToken) {
        await authHelper.saveAuthData(response.data);
      }
      return response?.data;
    } catch (error: any) {
      throw Error(error.response.data.message);
    }
  }
  async checkIsApproved() {
    try {
      const response = await instance.get<{ isApproved: boolean }>(
        GET_IS_APPROVAL,
        {
          withCredentials: true,
        }
      );
      console.log("response in checkIsApproved", response.data);
      return response?.data?.isApproved;
    } catch (error: any) {
      console.log("error", JSON.stringify(error));

      throw Error(error.response.data.message);
    }
  }
  async getNewTokens() {
    try {
      const refreshToken = await authHelper.getRefreshToken();
      const response = await axios.post<string, { data: IAuthResponseData }>(
        REFRESH_TOKEN_URL,
        { refreshToken },
        { withCredentials: true }
      );
      if (response?.data?.accessToken) {
        await authHelper.saveAuthData(response.data);
      }

      return response.data;
    } catch (error: any) {
      throw Error(error.response.data.message);
    }
  }
  async logOut() {
    try {
      await authHelper.removeAuthData();
      return true;
    } catch (error: any) {
      throw Error(error.response.data.message);
    }
  }
  async isUserExist(data: IIsUserExist) {
    try {
      const response = await axios.post<
        IIsUserExist,
        { data: { message: string; isExist: boolean } }
      >(IS_USER_EXIST_URL, data);
      return response;
    } catch (error: any) {
      throw Error(error.response.data.message);
    }
  }
}

const authService = new AuthService();
export default authService;
