import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import Messages from "./components/Messages";
import chatService from "@/services/chat/chat.service";
import * as ExpoImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import fileService from "@/services/files/files.service";
import { ServerMessages } from "@/constants/messages";
import { Attachment } from "@/types/chat.interface";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

const Support = () => {
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  useEffect(() => {
    const getOrCreateChat = async () => {
      try {
        // Пытаемся получить chatId из SecureStore
        const storedChat = await SecureStore.getItemAsync("supportChat");
        if (storedChat) {
          const parsedChat = JSON.parse(storedChat);
          setChatId(parsedChat.chatId); // Устанавливаем chatId из хранилища
        } else {
          // Генерируем новый chatId, если ничего не найдено
          const chat = await chatService.createChat();
          const newChatId = chat.id;
          const chatData = {
            chatId: newChatId,
            createdAt: new Date().toISOString(),
          };
          await SecureStore.setItemAsync(
            "supportChat",
            JSON.stringify(chatData)
          ); // Сохраняем в SecureStore
          setChatId(newChatId); // Устанавливаем новый chatId
        }
      } catch (error) {
        console.error("Ошибка при получении или создании чата:", error);
      }
    };

    getOrCreateChat();
  }, []);

  const sendMessageHandler = async () => {
    console.log(message, isLoading);
    if (!message || isLoading) return;
    await chatService.sendMessage({
      text: message,
      chatId,
      attachments,
    });
    setMessage("");
    setAttachments([]);
    setImages([]);
  };

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
      console.log(response.message);
      setIsLoading(false);

      // Устанавливаем массив с валидными файлами
    }
  };
  if (!chatId) return <></>;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Поддержка</Text>
      </View>
      <View style={styles.messagesContainer}>
        <Messages chatId={chatId} />
      </View>

      <View style={styles.footerContainer}>
        {images.length > 0 && (
          <View style={styles.attachmentsContainer}>
            {images.map((attachment, index) => {
              if (!attachment) return null;
              return (
                <Image
                  key={index}
                  source={{ uri: attachment }}
                  style={styles.attachment}
                />
              );
            })}
          </View>
        )}
        <View style={styles.inputBlock}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.5}
            onPress={addAttachmentHandler}
          >
            <Image
              source={icons.add}
              style={{ width: "100%", height: "100%" }}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Введите сообщение"
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.5}
            onPress={sendMessageHandler}
          >
            <Image
              source={icons.send}
              style={{ width: "100%", height: "100%" }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    position: "relative",
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  headerText: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
  },
  footerContainer: {
    width: "100%",
    position: "absolute",
    bottom: 10,
  },
  inputBlock: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    borderColor: colors.black,
    borderWidth: 1,
  },
  button: {
    height: 40,
    width: 40,
    padding: 6,
  },
  messagesContainer: {
    width: "100%",
    paddingBottom: 130,
  },
  attachmentsContainer: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    backgroundColor: colors.white,
  },
  attachment: {
    width: 75,
    height: 75,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray,
  },
});
