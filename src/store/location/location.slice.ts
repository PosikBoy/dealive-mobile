import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  lon: number;
  lat: number;
  isLocationLoading: boolean;
}

const initialState: IInitialState = {
  lon: 0,
  lat: 0,
  isLocationLoading: true,
};
export const locationSlice = createSlice({
  name: "signupForm",
  initialState,
  reducers: {
    pushLocation(state, action) {
      state.lon = action.payload.location.lon;
      state.lat = action.payload.location.lat;
      state.isLocationLoading = false;
    },
  },
});

export const { pushLocation } = locationSlice.actions;
