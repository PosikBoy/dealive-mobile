import { createSlice } from "@reduxjs/toolkit";

export interface ILocationInitialState {
  lon: number;
  lat: number;
  isLocationLoading: boolean;
  error: string | null;
}

const initialState: ILocationInitialState = {
  lon: 0,
  lat: 0,
  isLocationLoading: true,
  error: null,
};
export const locationSlice = createSlice({
  name: "signupForm",
  initialState,
  reducers: {
    pushLocation(state, action) {
      state.lon = action.payload?.lon;
      state.lat = action.payload?.lat;
      state.isLocationLoading = false;
      state.error = null;
    },
    pushError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { pushLocation, pushError } = locationSlice.actions;
