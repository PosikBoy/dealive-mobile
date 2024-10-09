enum Gender {
  male = "male",
  female = "female",
}

export type IUserData = {
  firstName: string;
  secondName: string;
  thirdName: string;
  phoneNumber: string;
  accountStatus: string;
  gender: Gender;
};

export type IAuthData = {
  accessToken: string;
  refreshToken: string;
  userData: IUserData;
};
