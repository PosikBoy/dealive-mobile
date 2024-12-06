export interface IImagePickerAsset {
  assetId: string | null;
  base64: string | null; // Если включена опция base64
  duration: number | null; // Если это видео
  exif: Record<string, any> | null; // Если включена опция exif
  fileName: string | null; // Имя файла
  fileSize: number | null; // Размер файла в байтах
  height: number | null; // Высота изображения
  mimeType: string | null; // MIME-тип файла
  rotation: number | null; // Поворот изображения
  type: "image" | "video"; // Тип файла
  uri: string; // URI файла
  width: number | null; // Ширина изображения
}

export type ILoginRequestData = {
  phoneNumber: string;
  password: string;
};

export type IRegisterRequestData = {
  phoneNumber: string;
  password: string;
  email: string;
  name: string;
  secondName: string;
  lastName: string;
  birthDate: string;
  documentNumber: string;
  documentFiles: IImagePickerAsset[];
};

export type ICourierData = {
  id: number;
  name: string;
  secondName: string;
  lastName: string;
  phoneNumber: string;
  isApproved: string;
};

export type IAuthResponseData = {
  accessToken: string;
  refreshToken: string;
};

export type IIsUserExist = {
  phoneNumber: string;
  email: string;
};
