import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";
interface IProps {
  title: string;
  linkSuggestion?: string;
  suggestion?: string;
  control: Control<any>;
  name: string;
  rules?: any;
}
import * as ExpoImagePicker from "expo-image-picker";
import { Control, useController } from "react-hook-form";
import { icons } from "@/constants/icons";

const ImagePicker = (props: IProps) => {
  const { title, linkSuggestion, control, name, rules = {} } = props;

  const { field } = useController({ control, name, rules });

  const selectImage = async () => {
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
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      field.onChange(result.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.suggestion}>
        <Text style={styles.title}>{title}</Text>
        {linkSuggestion && (
          <Link href={linkSuggestion}>
            <Text style={styles.linkSuggestion}>Пример</Text>
          </Link>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={selectImage}>
        <Image
          source={field.value ? field.value : icons.upload}
          style={{ width: 50, height: 50 }}
        />
        <Text style={styles.title}>
          {field.value
            ? "Загрузить другое изображение"
            : "Загрузить изображение"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  title: { fontFamily: "Montserrat-SemiBold", fontSize: 16 },
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  linkSuggestion: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: "blue",
    marginTop: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
});
export default ImagePicker;
