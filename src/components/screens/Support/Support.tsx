import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import Messages from "./components/Messages";
import chatService from "@/services/chat/chat.service";
import * as FileSystem from "expo-file-system";
import fileService from "@/services/files/files.service";
import { ServerMessages } from "@/constants/messages";
import { Attachment } from "@/types/chat.interface";
import authStorage from "@/helpers/authStorage";
import ImagePicker from "./components/ImagePicker";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

const Support = () => {
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const getOrCreateChat = useCallback(async () => {
    try {
      // Пытаемся получить chatId из SecureStore
      const storedChat = await authStorage.getSupportChat();
      console.log(storedChat);
      if (storedChat) {
        setChatId(storedChat.chatId); // Устанавливаем chatId из хранилища
      } else {
        // Генерируем новый chatId, если ничего не найдено
        const chat = await chatService.createChat();
        const newChatId = chat.id;
        await authStorage.setSupportChat(chat); // Сохраняем в SecureStore
        setChatId(newChatId); // Устанавливаем новый chatId
      }
    } catch (error) {
      console.error("Ошибка при получении или создании чата:", error);
    }
  }, []);

  const sendMessageHandler = useCallback(async () => {
    console.log("attachments", message, isLoading);
    if (!message || isLoading) {
      return;
    }
    setMessage("");
    setAttachments([]);
    setImages([]);
    await chatService.sendMessage({
      text: message,
      chatId,
      attachments,
    });
  }, [message, isLoading, attachments, chatId]);

  useEffect(() => {
    getOrCreateChat();
  }, []);

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
          <ImagePicker
            setAttachments={setAttachments}
            setImages={setImages}
            setIsLoading={setIsLoading}
          />
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
  button: {
    height: 40,
    width: 40,
    padding: 8,
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
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    borderColor: colors.black,
    borderWidth: 1,
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
