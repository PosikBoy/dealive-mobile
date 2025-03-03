import { IAddress } from "@/types/order.interface";
import { createSlice } from "@reduxjs/toolkit";

export interface IInitialState {
  route: IAddress[];
}

const initialState: IInitialState = { route: [] };

export const routeSlice = createSlice({
  name: "routeSlice",
  initialState,
  reducers: {
    pushRoute(state, action) {
      state.route = action.payload.route;
    },
  },
});

export const { pushRoute } = routeSlice.actions;
