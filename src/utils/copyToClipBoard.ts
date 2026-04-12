import * as Clipboard from 'expo-clipboard';

import store from '@/store/store';
import { showToast } from '@/store/toast/toast.slice';

const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);
  store.dispatch(
    showToast({ message: 'Скопировано в буфер обмена', type: 'success', timeout: 2000 }),
  );
};

export default copyToClipboard;
