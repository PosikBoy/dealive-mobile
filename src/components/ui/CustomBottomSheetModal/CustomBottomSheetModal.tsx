import { colors } from "@/constants/colors";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  FC,
  forwardRef,
  ReactNode,
  Ref,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
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
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {children}
        </BottomSheetView>
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
  },
});
