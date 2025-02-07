import MyButton from "@/components/ui/Button/Button";
import CustomBottomSheetModal from "@/components/shared/CustomBottomSheetModal/CustomBottomSheetModal";
import { colors } from "@/constants/colors";
import { fonts, fontSizes, gaps, paddings } from "@/constants/styles";
import { useTakeOrderMutation } from "@/services/orders/orders.service";
import { IOrder, IOrderWithoutSensitiveInfo } from "@/types/order.interface";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FC, ForwardedRef, forwardRef, Ref } from "react";
import { StyleSheet, Text, View } from "react-native";

interface IProps {
  order: IOrder | IOrderWithoutSensitiveInfo;
  ref: Ref<BottomSheetModal>;
  takeOrder: () => Promise<void>;
  error: any;
}

const TakeOrderModal = forwardRef<BottomSheetModal, IProps>(
  (props, ref: ForwardedRef<BottomSheetModal>) => {
    const { order, takeOrder, error } = props;

    return (
      <CustomBottomSheetModal ref={ref}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Информация о заказе</Text>
            <View style={styles.propertiesGroup}>
              <View style={styles.property}>
                <Text style={styles.propertyText}>Вес посылки</Text>
                <Text style={styles.propertyText}>{order.weight}</Text>
              </View>
              <View style={styles.property}>
                <Text style={styles.propertyText}>Цена заказа</Text>
                <Text style={styles.propertyText}>{order.price} ₽</Text>
              </View>
              <View style={styles.property}>
                <Text style={styles.propertyText}>Количество действий</Text>
                <Text style={styles.propertyText}>{order.actions.length}</Text>
              </View>
              <View style={styles.property}>
                <Text style={styles.propertyText}>Посылка</Text>
                <Text style={styles.propertyText}>{order.parcelType}</Text>
              </View>
            </View>
          </View>
          {error ? (
            <Text style={styles.bottomText}>{error}</Text>
          ) : (
            <Text style={styles.bottomText}>
              Ознакомьтесь с деталями заказа перед тем, как взять его!
            </Text>
          )}
          <MyButton onPress={takeOrder} buttonText="Взять заказ" />
        </View>
      </CustomBottomSheetModal>
    );
  }
);

export default TakeOrderModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: gaps.medium,
    paddingVertical: paddings.big,
    paddingHorizontal: paddings.horizontal,
  },
  textContainer: {
    alignItems: "center",
    flex: 1,
    gap: gaps.small,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 20,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    textAlign: "center",
  },
  propertiesGroup: {},
  property: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: colors.inputGray,
    borderBottomWidth: 1,
    paddingVertical: paddings.small,
  },
  propertyText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
  },
  bottomText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.medium,
    textAlign: "center",
  },
});
