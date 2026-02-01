import { forwardRef, ReactNode, Ref } from 'react';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';

import { useTheme } from '@/hooks/useTheme';

interface IProps {
  children: ReactNode;
  ref: Ref<ActionSheetRef>;
}

const CustomBottomSheetModal = forwardRef<ActionSheetRef, IProps>((props, ref) => {
  const { colors } = useTheme();

  const { children } = props;

  return (
    <ActionSheet
      ref={ref}
      gestureEnabled={true}
      containerStyle={{ backgroundColor: colors.background }}
    >
      {children}
    </ActionSheet>
  );
});

export default CustomBottomSheetModal;
