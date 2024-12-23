import authService from "@/services/auth/auth.service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  IRegisterRequestData,
  ILoginRequestData,
  IAuthResponseData,
} from "@/types/auth.interface";
import authStorage from "@/helpers/authStorage";

export const register = createAsyncThunk<
  IAuthResponseData,
  IRegisterRequestData,
  { rejectValue: string }
>("auth/registration", async (data, thunkApi) => {
  try {
    const response = await authService.register(data);
    return response;
  } catch (error: any) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const login = createAsyncThunk<
  IAuthResponseData,
  ILoginRequestData,
  { rejectValue: string }
>("auth/login", async (data, thunkApi) => {
  try {
    const response = await authService.login(data);
    return response;
  } catch (error: any) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const logOut = createAsyncThunk("auth/logout", async (_, thunkApi) => {
  try {
    const response = await authService.logOut();
    return response;
  } catch (error: any) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const fetchAuthStatus = createAsyncThunk(
  "auth/fetchAuthStatus",
  async (_, thunkAPI) => {
    try {
      const isAuth = await authStorage.getIsAuth();
      return isAuth;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchIsApprovedStatus = createAsyncThunk(
  "auth/fetchIsApprovedStatus",
  async (_, thunkAPI) => {
    try {
      const isApproved = await authService.checkIsApproved();
      return isApproved;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
