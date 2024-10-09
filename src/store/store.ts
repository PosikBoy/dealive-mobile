import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { signupFormSlice } from "./signupForm/signupForm.slice";

const rootReducer = combineReducers({
  auth: signupFormSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type TypeRootState = ReturnType<typeof store.getState>;
export type TypeDispatch = typeof store.dispatch;
