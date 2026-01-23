import { File, Paths } from 'expo-file-system';

import { instance } from '@/axios/interceptor';
import { SERVER_URL } from '@/constants/urls';

class FilesService {
  async uploadFiles(files: any[]) {
    const formData = new FormData();
    files.forEach(file => {
      console.log(file);
      formData.append('files', {
        uri: file.uri,
        name: file.fileName,
        type: file.mimeType,
      } as any);
    });
    const response = await instance.post(SERVER_URL + '/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response?.data;
  }
  async downloadFile(fileName: string) {
    // Получаем данные файла с сервера
    const response = await instance.get(SERVER_URL + `/files/download/${fileName}`, {
      responseType: 'arraybuffer', // Получаем данные как arraybuffer
    });

    // Преобразуем бинарные данные в base64
    const base64 = arrayBufferToBase64(response.data);

    // Записываем данные в файл в формате Base64
    const file = new File(Paths.document, fileName);

    file.create();
    file.write(base64);

    return `${Paths.document.uri}/${fileName}}`;
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer);
  let binary = '';
  uint8Array.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary); // Преобразование в base64
}
// Функция для преобразования ArrayBuffer в Base64

const fileService = new FilesService();
export default fileService;
