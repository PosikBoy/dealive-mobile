import React, { FC } from "react";
import { Text } from "react-native";

interface IProps {
  NextPage: () => void;
}
const Register2: FC<IProps> = () => {
  return <Text>Экран регистрации два</Text>;
};

export default Register2;
