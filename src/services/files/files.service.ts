import instance from "@/axios/interceptor";
import { SERVER_URL } from "@/constants/urls";
import * as FileSystem from "expo-file-system";
class FilesService {
  async uploadFiles(files: any[]) {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        console.log(file);
        formData.append("files", {
          uri: file.uri,
          name: file.fileName, // или другое поле, если есть
          type: file.mimeType, // или "image/jpeg", "application/pdf" и т.д.
        } as any);
      });
      const response = await instance.post(
        SERVER_URL + "/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response?.data;
    } catch (error: any) {
      throw Error(error.response.data.message);
    }
  }
  async downloadFile(fileName: string) {
    try {
      // Получаем данные файла с сервера
      const response = await instance.get(
        SERVER_URL + `/files/download/${fileName}`,
        {
          responseType: "arraybuffer", // Получаем данные как arraybuffer
        }
      );

      // Путь для сохранения файла
      const downloadDest = `${FileSystem.documentDirectory}${fileName}`;

      // Преобразуем бинарные данные в base64
      const base64 = arrayBufferToBase64(response.data);

      // Записываем данные в файл в формате Base64
      await FileSystem.writeAsStringAsync(downloadDest, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return downloadDest;
    } catch (error) {
      console.error("Error downloading file:", error.message || error);
      console.error("Full error:", error);
    }
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer);
  let binary = "";
  uint8Array.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary); // Преобразование в base64
}
// Функция для преобразования ArrayBuffer в Base64

const fileService = new FilesService();
export default fileService;
