import store from "@/store/store";
import { Provider } from "react-redux";
import React from "react"; // Добавляем этот импорт

export const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
