import * as Clipboard from "expo-clipboard";
import { ToastAndroid } from "react-native";

const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);
  ToastAndroid.show("Скопировано в буфер обмена", ToastAndroid.SHORT);
};

export default copyToClipboard;
