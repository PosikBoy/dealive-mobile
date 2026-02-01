import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import { profileApi } from '@/services/profile/profile.service';

import { ordersApi } from '@/domain/orders/api';
import { authSlice } from './auth/auth.slice';
import { locationSlice } from './location/location.slice';
import routeSlice from './route/route.slice';
import { signupFormSlice } from './signupForm/signupForm.slice';
import { supportChatSlice } from './supportChat/supportChat.slice';

const persistRouteConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['route', 'distance'],
};

const rootReducer = combineReducers({
  [ordersApi.reducerPath]: ordersApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  signupForm: signupFormSlice.reducer,
  auth: authSlice.reducer,
  supportChat: supportChatSlice.reducer,
  location: locationSlice.reducer,
  route: persistReducer(persistRouteConfig, routeSlice.reducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
      .concat(ordersApi.middleware)
      .concat(profileApi.middleware),
});

export default store;

export const persistor = persistStore(store);

export type TypeRootState = ReturnType<typeof store.getState>;
export type TypeDispatch = typeof store.dispatch;
