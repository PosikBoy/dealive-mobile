import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  // checkAuth,
  fetchAuthStatus,
  fetchIsApprovedStatus,
  login,
  logOut,
  register,
} from "./auth.actions";
import { isError } from "@/helpers/isReduxError";

interface IInitialState {
  isLoading: boolean;
  error: string | null;
  isAuth: boolean | null;
  isApproved: boolean;
}

const initialState: IInitialState = {
  isLoading: false,
  error: null,
  isAuth: null,
  isApproved: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(login.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logOut.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.error = null;
      })
      .addCase(fetchAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = action.payload;
      })
      .addCase(fetchIsApprovedStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIsApprovedStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isApproved = action.payload;
      })
      .addMatcher(
        (action) => isError(action, "auth"),
        (state, action: PayloadAction<string>) => {
          state.error = action.payload;
          state.isLoading = false;
        }
      );
  },
});
