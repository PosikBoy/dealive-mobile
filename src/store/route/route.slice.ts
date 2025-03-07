import routeService from "@/services/route/route.service";
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
      state.distance = action.payload.distance;
    },
    removeAddressFromRoute(state, action) {
      const newRoute = state.route.filter(
        (address) => address.id !== action.payload
      );
      const distance = routeService.calculateRouteDistance(newRoute);
      state.route = newRoute;
      state.distance = distance;
    },
  },
});

export const { pushRoute, removeAddressFromRoute } = routeSlice.actions;
export default routeSlice;
