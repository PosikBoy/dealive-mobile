import { IAddress } from "@/types/order.interface";
import { createSlice } from "@reduxjs/toolkit";

export interface IInitialState {
  route: IAddress[];
  distance: number;
}

const initialState: IInitialState = { route: [], distance: 0 };

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
export default routeSlice;
