import { IOrder } from "@/types/order.interface";
import { StyleSheet, Text, View } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import MyButton from "../ui/Button/Button";
import { fonts, fontSizes, gaps, paddings } from "@/constants/styles";
import { colors } from "@/constants/colors";

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
    >
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Информация о заказе</Text>
          <View style={styles.propertiesGroup}>
            <View style={styles.property}>
              <Text style={styles.propertyText}>Вес посылки</Text>
              <Text style={styles.propertyText}>{order?.weight}</Text>
            </View>
            <View style={styles.property}>
              <Text style={styles.propertyText}>Цена заказа</Text>
              <Text style={styles.propertyText}>{order?.price} ₽</Text>
            </View>
            <View style={styles.property}>
              <Text style={styles.propertyText}>Количество действий</Text>
              <Text style={styles.propertyText}>{order?.actions?.length}</Text>
            </View>
            <View style={styles.property}>
              <Text style={styles.propertyText}>Посылка</Text>
              <Text style={styles.propertyText}>{order?.parcelType}</Text>
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
