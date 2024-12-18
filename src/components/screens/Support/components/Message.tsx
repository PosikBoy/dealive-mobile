import { Image, StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { IMessage } from "@/types/chat.interface";
import { colors } from "@/constants/colors";
import formatDate from "@/helpers/formatDate";
import fileService from "@/services/files/files.service";
import * as FileSystem from "expo-file-system";

interface IProps {
  message: IMessage;
  myId: number;
}
const Message: FC<IProps> = (props: IProps) => {
  const [images, setImages] = useState<string[]>();
  const { text, createdAt } = props.message;
  const isMe = props?.myId == props.message.senderId;
  const date = new Date(createdAt);

  const time = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  useEffect(() => {
    const fetchAttachments = async () => {
      const files = props.message.attachments.map(async (file) => {
        const fileUri = `${FileSystem.documentDirectory}${file.fileName}`;

        try {
          // Проверяем, существует ли файл в файловой системе
          await FileSystem.readAsStringAsync(fileUri);

          return fileUri; // Если файл существует, возвращаем его путь
        } catch (error) {
          console.log(`Файл ${file.fileName} не найден, скачиваем с сервера.`);
          // Если файл не найден, скачиваем его с сервера
          const downloadedFileUri = await fileService.downloadFile(
            file.fileName
          );
          return downloadedFileUri;
        }
      });

      setImages(await Promise.all(files));
    };

    if (props.message.attachments?.length > 0) {
      fetchAttachments();
    }
  }, []);
  return (
    <View style={styles.container}>
      <View
        style={
          isMe ? styles.myMessageTextContainer : styles.messageTextContainer
        }
      >
        {!isMe && <Text style={styles.label}>Служба поддержки</Text>}
        <Text style={styles.messageText}>{text}</Text>

        <View style={styles.imageContainer}>
          {images?.length > 0 &&
            images.map((imageUri, index) => (
              <Image
                key={index}
                source={{ uri: `file://${imageUri}` }}
                style={{
                  width: images.length > 1 ? 100 : 200,
                  height: images.length > 1 ? 100 : 200,
                }}
              />
            ))}
        </View>
        <Text style={styles.createdAt}>{time}</Text>
      </View>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 20,
    padding: 5,
  },
  messageText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: colors.white,
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: colors.lightGray,
  },
  myMessageTextContainer: {
    width: "80%",
    alignSelf: "flex-end",
    backgroundColor: colors.purple,
    color: colors.white,
    borderRadius: 20,
    padding: 10,
  },
  messageTextContainer: {
    width: "80%",
    backgroundColor: colors.lightRed,
    borderRadius: 20,
    padding: 10,
  },
  createdAt: {
    alignSelf: "flex-end",
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: colors.white,
  },
  imageContainer: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
});
