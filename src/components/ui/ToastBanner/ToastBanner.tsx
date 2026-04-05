import React, { FC, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { palette } from '@/constants/colors';
import { useTypedDispatch, useTypedSelector } from '@/hooks/redux.hooks';
import { hideToast, IToast } from '@/store/toast/toast.slice';

import { BANNER_HEIGHT } from './constants';
import { useToastAnimation } from './hooks/useToastAnimation';
import { useToastColor } from './hooks/useToastColor';

interface IToastItemProps {
  toast: IToast;
}

const ToastItem: FC<IToastItemProps> = ({ toast }) => {
  const dispatch = useTypedDispatch();
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backgroundColor = useToastColor(toast.type);
  const { animatedStyle, animateIn, animateOut } = useToastAnimation();

  const dispatchHide = () => dispatch(hideToast(toast.id));

  useEffect(() => {
    animateIn();

    if (!toast.persistent) {
      hideTimerRef.current = setTimeout(() => {
        animateOut(dispatchHide);
      }, toast.timeout);
    }

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const handlePress = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    animateOut(dispatchHide);
  };

  return (
    <Animated.View style={[animatedStyle, { backgroundColor }]}>
      <TouchableOpacity style={styles.inner} onPress={handlePress} activeOpacity={0.85}>
        <ThemedText type='hint' weight='medium' style={styles.text}>
          {toast.message}
        </ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const ToastBanner: FC = () => {
  const toasts = useTypedSelector(state => state.toast.toasts);

  return (
    <>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    justifyContent: 'center',
    height: BANNER_HEIGHT,
  },
  text: {
    color: palette.white,
  },
});
