import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IOrderOfferPayload } from '@/domain/orders/types';

interface IOrderOfferState {
  offer: IOrderOfferPayload | null;
  isAcceptingOrders: boolean;
}

const initialState: IOrderOfferState = {
  offer: null,
  isAcceptingOrders: false,
};

export const orderOfferSlice = createSlice({
  name: 'orderOffer',
  initialState,
  reducers: {
    setOrderOffer(state, action: PayloadAction<IOrderOfferPayload>) {
      state.offer = action.payload;
    },
    clearOrderOffer(state) {
      state.offer = null;
    },
    setAcceptingOrders(state, action: PayloadAction<boolean>) {
      state.isAcceptingOrders = action.payload;
    },
  },
});

export const { setOrderOffer, clearOrderOffer, setAcceptingOrders } = orderOfferSlice.actions;

export default orderOfferSlice;
