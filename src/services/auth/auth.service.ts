import { instance } from "@/axios/interceptor";
import {
  GET_IS_APPROVAL,
  IS_USER_EXIST_URL,
  LOGIN_URL,
  REFRESH_TOKEN_URL,
  REGISTER_URL,
} from "@/constants/urls";
import { authStorage } from "@/helpers/authStorage";
import {
  IAuthResponseData,
  IIsUserExist,
  ILoginRequestData,
  IRegisterRequestData,
} from "@/types/auth.interface";
import axios from "axios";

class AuthService {
  async login(data: ILoginRequestData) {
    const response = await axios.post<
      ILoginRequestData,
      { data: IAuthResponseData }
    >(LOGIN_URL, data);

    if (response?.data.accessToken) {
      await authStorage.saveAuthData(response.data);
    }

    return response.data;
  }
  async register(data: IRegisterRequestData) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "documentFiles" && Array.isArray(value)) {
        value.forEach((file, index) => {
          formData.append(`documentFiles`, {
            uri: file.uri,
            name: file.fileName,
            type: file.mimeType,
          } as any);
        });
      } else {
        if (key == "birthDate" && typeof value == "string") {
          const parts = value.split(".");
          const day = parts[0];
          const month = parts[1];
          const year = parts[2];

          value = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }

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
      await authStorage.saveAuthData(response.data);
    }

    return response?.data;
  }

  async checkIsApproved() {
    const response = await instance.get<{ isApproved: boolean }>(
      GET_IS_APPROVAL,
      {
        withCredentials: true,
      }
    );
    return response?.data?.isApproved;
  }
  async getNewTokens() {
    const refreshToken = await authStorage.getRefreshToken();
    const response = await axios.post<string, { data: IAuthResponseData }>(
      REFRESH_TOKEN_URL,
      { refreshToken },
      { withCredentials: true }
    );
    if (response?.data?.accessToken) {
      await authStorage.saveAuthData(response.data);
    }

    return response.data;
  }
  async logOut() {
    try {
      await authStorage.removeAuthData();
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw Error(error.message);
      }
    }
  }

  async isUserExist(data: IIsUserExist) {
    const response = await axios.post<
      IIsUserExist,
      { data: { message: string; isExist: boolean } }
    >(IS_USER_EXIST_URL, data);

    return response.data;
  }
}

const authService = new AuthService();
export default authService;
