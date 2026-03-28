import { Redirect } from 'expo-router';
import { FC, PropsWithChildren } from 'react';

import { useAuth } from './useAuth';

interface IProps {}

export const AuthGuard: FC<PropsWithChildren<IProps>> = ({ children }) => {
  const { isApproved, isAuth, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuth) {
    return <Redirect href={{ pathname: '/(special)/onBoarding' }} />;
  }

  if (!isApproved) {
    return <Redirect href={{ pathname: '/(special)/waitForApproval' }} />;
  }

  return <>{children}</>;
};
