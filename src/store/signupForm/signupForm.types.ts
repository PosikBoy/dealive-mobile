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
  isRulesAccepted: boolean;
  firstName: string;
  secondName: string;
  thirdName: string;
  birthDay: string;
  gender: Gender;
  passportNumber: string;
  issueDate: string;
  passportPhotoImage?: Image;
  selfieWithPassportImage?: Image;
};
