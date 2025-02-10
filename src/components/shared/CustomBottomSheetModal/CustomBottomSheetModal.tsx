import { colors } from "@/constants/colors";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, ReactNode, Ref, useCallback } from "react";
import { StyleSheet } from "react-native";

interface IProps {
  children: ReactNode;
  ref: Ref<BottomSheetModal>;
}

const CustomBottomSheetModal = forwardRef<BottomSheetModal, IProps>(
  (props, ref) => {
    const { children } = props;
    const renderBackdrop = useCallback(
      (props) => (
        <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} />
      ),
      []
    );

    return (
      <BottomSheetModal
        style={styles.bottomSheet}
        backdropComponent={renderBackdrop}
        ref={ref}
        maxDynamicContentSize={1000}
      >
        <BottomSheetScrollView style={styles.bottomSheetContent}>
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);
export default CustomBottomSheetModal;

const styles = StyleSheet.create({
  bottomSheet: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flex: 1,
    backgroundColor: colors.white,
  },
  bottomSheetContent: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
