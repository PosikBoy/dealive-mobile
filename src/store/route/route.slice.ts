import { createSlice } from '@reduxjs/toolkit';

import { ordersApi } from '@/services/orders/orders.service';
import routeService from '@/services/route/route.service';
import { IAddress } from '@/types/order.interface';

export interface IInitialState {
  route: IAddress[];
  distance: number;
}

const initialState: IInitialState = { route: [], distance: 0 };

export const routeSlice = createSlice({
  name: 'routeSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(ordersApi.endpoints.getActiveOrders.matchFulfilled, (state, action) => {
      const route = routeService.restoreRoute(action.payload);
      state.route = route.route;
      state.distance = route.distance;
    });
  },
});

export default routeSlice;
