import { useEffect, useState } from 'react';

import { authStorage } from '@/helpers/authStorage';
import { useTypedDispatch, useTypedSelector } from '@/hooks/redux.hooks';
import { fetchAuthStatus, fetchIsApprovedStatus, logOut } from '@/store/auth/auth.actions';

export const useAuth = () => {
  const dispatch = useTypedDispatch();
  const { isApproved, isAuth } = useTypedSelector(state => state.auth);
  const [isReady, setIsReady] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const storedAuth = await authStorage.getIsAuth();

      if (storedAuth) {
        await dispatch(fetchAuthStatus()).unwrap();
        await dispatch(fetchIsApprovedStatus()).unwrap();
      }
    } catch {
      //TODO: Add classifying error and action to do
      dispatch(logOut());
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return { isLoading: !isReady, isApproved, isAuth };
};
