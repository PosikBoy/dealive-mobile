import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { signupFormSlice } from "./signupForm/signupForm.slice";
import { authSlice } from "./auth/auth.slice";
import { ordersApi } from "@/services/orders/orders.service";
import { profileApi } from "@/services/profile/profile.service";
import { supportChatSlice } from "./supportChat/supportChat.slice";
import { locationSlice } from "./location/location.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
import routeSlice from "./route/route.slice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["route"],
};

const rootReducer = combineReducers({
  [ordersApi.reducerPath]: ordersApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  signupForm: signupFormSlice.reducer,
  auth: authSlice.reducer,
  supportChat: supportChatSlice.reducer,
  location: locationSlice.reducer,
  route: persistReducer(persistConfig, routeSlice.reducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Игнорируем ошибки сериализации для персистентных данных
      },
    })
      .concat(ordersApi.middleware)
      .concat(profileApi.middleware),
});

export default store;

export const persistor = persistStore(store);

export type TypeRootState = ReturnType<typeof store.getState>;
export type TypeDispatch = typeof store.dispatch;
