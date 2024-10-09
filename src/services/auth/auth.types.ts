enum Gender {
  male = "male",
  female = "female",
}
type Image = {
  uri: string;
  name: string;
  type: string;
};

export type ILoginRequestData = {
  phoneNumber: string;
};

export type IRegisterRequestData = {
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

export type IUserData = {
  id: number;
  firstName: string;
  secondName: string;
  thirdName: string;
  phoneNumber: string;
  accountStatus: string;
  gender: Gender;
};

export type IAuthResponseData = {
  accessToken: string;
  refreshToken: string;
  userData: IUserData;
};
