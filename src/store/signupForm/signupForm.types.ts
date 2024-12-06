import { IImagePickerAsset } from "@/types/auth.interface";

export type IInitialState = {
  phoneNumber: string;
  password: string;
  code: string;
  email: string;
  isRulesAccepted: boolean;
  name: string;
  secondName: string;
  lastName: string;
  birthDate: string;
  documentNumber: string;
  documentFiles: IImagePickerAsset[];
};
