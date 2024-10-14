type Image = {
  uri: string;
  name: string;
  type: string;
};

export enum Gender {
  male = "male",
  female = "female",
}

export type IInitialState = {
  phoneNumber: string;
  password: string;
  code: string;
  isRulesAccepted: boolean;
  firstName: string;
  secondName: string;
  thirdName: string;
  birthDate: string;
  passportNumber: string;
  issueDate: string;
  passportPhotoImage?: Image;
  selfieWithPassportImage?: Image;
};
