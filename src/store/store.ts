import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { signupFormSlice } from "./signupForm/signupForm.slice";
import { authSlice } from "./auth/auth.slice";
import { ordersApi } from "@/services/orders/orders.service";
import { profileApi } from "@/services/profile/profile.service";
const rootReducer = combineReducers({
  [ordersApi.reducerPath]: ordersApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  signupForm: signupFormSlice.reducer,
  auth: authSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ordersApi.middleware)
      .concat(profileApi.middleware),
});

export default store;

export type TypeRootState = ReturnType<typeof store.getState>;
export type TypeDispatch = typeof store.dispatch;
