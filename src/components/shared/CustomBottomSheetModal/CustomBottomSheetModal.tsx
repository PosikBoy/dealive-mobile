import { forwardRef, ReactNode, Ref } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";

interface IProps {
  children: ReactNode;
  ref: Ref<ActionSheetRef>;
}

const CustomBottomSheetModal = forwardRef<ActionSheetRef, IProps>(
  (props, ref) => {
    const { children } = props;

    return (
      <ActionSheet ref={ref} gestureEnabled={true}>
        {children}
      </ActionSheet>
    );
  }
);

export default CustomBottomSheetModal;
