import { colors } from "@/constants/colors";
import { forwardRef, ReactNode, Ref } from "react";
import { useColorScheme } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";

interface IProps {
  children: ReactNode;
  ref: Ref<ActionSheetRef>;
}

const CustomBottomSheetModal = forwardRef<ActionSheetRef, IProps>(
  (props, ref) => {
    const colorScheme = useColorScheme();
    const { children } = props;

    return (
      <ActionSheet
        ref={ref}
        gestureEnabled={true}
        containerStyle={{ backgroundColor: colors[colorScheme].white }}
      >
        {children}
      </ActionSheet>
    );
  }
);

export default CustomBottomSheetModal;
