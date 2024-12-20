import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
import * as ExpoImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Attachment } from "@/types/chat.interface";
import fileService from "@/services/files/files.service";
import { ServerMessages } from "@/constants/messages";

type Props = {
  setAttachments: (attachments: Attachment[]) => void;
  setImages: (attachments: string[]) => void;
  setIsLoading: (isLoading: boolean) => void;
};

const ImagePicker = (props: Props) => {
  const { setAttachments, setIsLoading, setImages } = props;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const addAttachmentHandler = async () => {
    // Запрашиваем разрешение на доступ к галерее
    const permissionResult =
      await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert(
        "Мы не можем получить доступ к галерее, так как вы не предоставили нам разрешение."
      );
      return;
    }

    // Открываем галерею для выбора изображения
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.5,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      if (result.assets.length > 5) {
        alert("Вы можете выбрать не более 5 файлов.");
        return;
      }
      setIsLoading(true);
      const availableAttachments = await Promise.all(
        result.assets.map(async (asset) => {
          const fileInfo = await FileSystem.getInfoAsync(asset.uri);
          if (fileInfo.exists && fileInfo.size) {
            if (fileInfo.size > MAX_FILE_SIZE) {
              alert("Файл слишком большой. Максимальный размер — 5MB.");
              return null; // Возвращаем null, чтобы исключить файл из массива
            }
          }
          return asset; // Возвращаем URI, если файл прошел все проверки
        })
      );

      // Фильтруем все элементы, которые равны null
      const filteredAttachments = availableAttachments.filter(
        (uri) => uri !== null
      );
      setImages(availableAttachments.map((attachment) => attachment.uri));

      // Отправляем только валидные файлы
      const response = await fileService.uploadFiles(filteredAttachments);
      if (response.message == ServerMessages.FILES_WAS_UPLOADED_SUCCESSFULLY) {
        setAttachments(response.files);
      }
      setIsLoading(false);

      // Устанавливаем массив с валидными файлами
    }
  };
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.5}
      onPress={addAttachmentHandler}
    >
      <Image source={icons.add} style={{ width: "100%", height: "100%" }} />
    </TouchableOpacity>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: 40,
    padding: 8,
  },
});
