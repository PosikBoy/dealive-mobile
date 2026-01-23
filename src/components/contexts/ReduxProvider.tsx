import React from 'react'; // Добавляем этот импорт
import { Provider } from 'react-redux';

import store from '@/store/store';

export const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
