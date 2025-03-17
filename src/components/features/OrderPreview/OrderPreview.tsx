import { colors } from "@/constants/colors";
import { FC, memo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import formatDate from "@/helpers/formatDate";
import { router } from "expo-router";
import { borderRadiuses, gaps, paddings } from "@/constants/styles";
import { getMetroColor } from "@/utils/getColorMetro";
import { IOrder } from "@/types/order.interface";
import Animated, { FadeInLeft } from "react-native-reanimated";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

interface OrderDetailsProps {
  order: IOrder;
  incomePerHour?: number;
}

const getOrderHeaderText = (length, id, income) => {
  return (
    length +
    " адреса | № " +
    id +
    (income ? " | +" + income.toFixed(0) + "₽/ч" : "")
  );
};
// Оборачиваем в memo для оптимизации
const OrderPreview: FC<OrderDetailsProps> = memo(({ order, incomePerHour }) => {
  const colorScheme = useColorScheme();
  const { id, date, parcelType, weight, price, addresses } = order;
  const createdAtString = formatDate(date);

  const navigateToOrder = () => {
    router.push(`/orders/${id}`);
  };

  return (
    <Animated.View
      entering={FadeInLeft.duration(500)}
      style={[styles.container, { backgroundColor: colors[colorScheme].white }]}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={navigateToOrder}>
        <View style={styles.innerContainer}>
          <ThemedText weight="bold" type="heading">
            {getOrderHeaderText(order.addresses.length, id, incomePerHour)}
          </ThemedText>
          <View style={styles.addresses}>
            {addresses.map((address, index) => {
              const metroString = address.geoData?.metro?.[0]?.name
                ? address.geoData?.metro?.[0]?.name + " |"
                : "";
              const distance = address.distance?.toFixed(1) || "";

              return (
                <View key={address.id} style={styles.address}>
                  <View style={styles.addressIndexContainer}>
                    <ThemedText weight="medium" type="title">
                      {index + 1}
                    </ThemedText>
                  </View>
                  <View style={styles.addressTextContainer}>
                    <ThemedText
                      type="mediumText"
                      weight="medium"
                      style={{ textAlign: "left" }}
                    >
                      {address.address}
                    </ThemedText>

                    <View
                      style={[
                        styles.locationInfo,
                        address.geoData?.metro && {
                          backgroundColor: getMetroColor(
                            address.geoData.metro[0].line
                          ),
                        },
                      ]}
                    >
                      <ThemedText color="white">{`${metroString} ${distance} км от вас`}</ThemedText>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.footer}>
            <View style={styles.info}>
              <ThemedText weight="semiBold" type="mediumText">
                {`${parcelType} · ${weight}`}
              </ThemedText>
              <View style={styles.price}>
                <ThemedText
                  color="white"
                  type="mediumText"
                  weight="medium"
                >{`${price} ₽`}</ThemedText>
              </View>
            </View>
            <View style={styles.meta}>
              <ThemedText color="gray" type="hint">
                {`Заказ создан ${createdAtString}`}
              </ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// Экспортируем уже обернутый компонент
export default OrderPreview;

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadiuses.medium,
    paddingHorizontal: paddings.medium,
    paddingVertical: paddings.medium,
  },
  innerContainer: {
    width: "100%",
    gap: gaps.medium,
    justifyContent: "center",
  },

  addresses: {
    gap: 5,
  },
  address: {
    flexDirection: "row",
    gap: 10,
  },
  addressTextContainer: {
    flex: 1,
    gap: 5,
  },
  addressIndexContainer: {
    width: 30,
  },
  locationInfo: {
    alignSelf: "flex-start",
    gap: 5,
    backgroundColor: colors.purple,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  footer: {
    width: "100%",
    gap: 5,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    backgroundColor: colors.purple,
    borderRadius: 20,
    padding: 2,
    paddingHorizontal: 10,
  },
  meta: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
