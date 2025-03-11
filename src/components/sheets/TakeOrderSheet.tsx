import { IOrder } from "@/types/order.interface";
import { StyleSheet, View } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import MyButton from "../ui/Button/Button";
import { gaps, paddings } from "@/constants/styles";
import { colors } from "@/constants/colors";
import ThemedText from "../ui/ThemedText/ThemedText";

export interface ITakeOrderSheet {
  order: IOrder;
  takeOrder: () => Promise<void>;
  error: any;
}

const TakeOrderSheet = (props: SheetProps<"take-order-sheet">) => {
  const { order, takeOrder, error } = props.payload;

  return (
    <ActionSheet
      gestureEnabled={true}
      containerStyle={{
        justifyContent: "center",
        alignItems: "center",
      }}
      openAnimationConfig={{
        stiffness: 1000, // Уменьшаем жесткость
        damping: 100000, // Увеличиваем затухание
        mass: 1, // Масса (оставляем по умолчанию)
      }}
    >
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <ThemedText type="subtitle" weight="bold">
            Информация о заказе
          </ThemedText>
          <View>
            <View style={styles.property}>
              <ThemedText type="mediumText">Вес посылки</ThemedText>
              <ThemedText type="mediumText">{order?.weight}</ThemedText>
            </View>
            <View style={styles.property}>
              <ThemedText type="mediumText">Цена заказа</ThemedText>
              <ThemedText type="mediumText">{order?.price}</ThemedText>
            </View>
            <View style={styles.property}>
              <ThemedText type="mediumText">Количество действий</ThemedText>
              <ThemedText type="mediumText">
                {order?.actions?.length}
              </ThemedText>
            </View>
            <View style={styles.property}>
              <ThemedText type="mediumText">Посылка</ThemedText>
              <ThemedText type="mediumText">{order?.parcelType}</ThemedText>
            </View>
          </View>
        </View>
        {error ? (
          <ThemedText type="hint" color="red">
            {error}
          </ThemedText>
        ) : (
          <ThemedText type="mediumText" weight="bold">
            Ознакомьтесь с деталями заказа перед тем, как взять его!
          </ThemedText>
        )}
        <MyButton onPress={takeOrder} buttonText="Взять заказ" />
      </View>
    </ActionSheet>
  );
};

export default TakeOrderSheet;

const styles = StyleSheet.create({
  container: {
    gap: gaps.medium,
    paddingVertical: paddings.big,
    paddingHorizontal: paddings.horizontal,
  },
  textContainer: {
    alignItems: "center",
    gap: gaps.small,
  },
  property: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: colors.inputGray,
    borderBottomWidth: 1,
    paddingVertical: paddings.small,
  },
});
