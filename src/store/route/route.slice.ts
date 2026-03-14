import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAddress, IOrder } from '@/domain/orders/types';
import { routeService } from '@/services/route/route.service';

export interface IInitialState {
  route: IAddress[];
  distance: number;
}

const initialState: IInitialState = { route: [], distance: 0 };

export const routeSlice = createSlice({
  name: 'routeSlice',
  initialState,
  reducers: {
    updateRoute: (state, action: PayloadAction<IOrder[]>) => {
      if (action.payload && action.payload.length > 0) {
        const route = routeService.restoreRoute(action.payload);
        state.route = route.route;
        state.distance = route.distance;
      } else {
        state.route = [];
        state.distance = 0;
      }
    },
  },
});

export const { updateRoute } = routeSlice.actions;

export default routeSlice;
