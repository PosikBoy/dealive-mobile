import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import { IMessage } from "@/types/chat.interface";
import chatService from "@/services/chat/chat.service";
import { ServerMessages } from "@/constants/messages";
import Message from "./Message";
import { useGetProfileQuery } from "@/services/profile/profile.service";

type Props = {
  chatId: number;
};

const Messages = (props: Props) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [page, setPage] = useState(1);
  const { data: myProfileData } = useGetProfileQuery();
  const myId = myProfileData?.id;
  console.log("myId", myId, props);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await chatService.getMessages(props.chatId, page);
        setMessages((prevMessages) => [...response, ...prevMessages]);
      } catch (error) {
        console.log("error", JSON.stringify(error));
      }
    };
    subscribe();
    getMessages();
  }, []);

  const subscribe = async () => {
    try {
      const response = await chatService.pollMessages(props.chatId);
      setMessages((prevMessages) => {
        // Проверяем, есть ли сообщение уже в списке
        const isDuplicate = prevMessages.some((msg) => msg.id === response.id);
        if (isDuplicate) {
          return prevMessages;
        }
        return [response, ...prevMessages]; // Добавляем только уникальное сообщение
      });
      await subscribe();
    } catch (error) {
      if (error.message == ServerMessages.NO_NEW_MESSAGES) {
        setTimeout(subscribe, 1000);
      }
    }
  };

  if (!myProfileData) return <ActivityIndicator />;
  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        inverted
        renderItem={({ item }) => <Message message={item} myId={myId} />}
        style={{ height: "100%" }}
        scrollEnabled={true}
      />
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});