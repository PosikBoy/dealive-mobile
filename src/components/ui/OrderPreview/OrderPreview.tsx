import { colors } from "@/constants/colors";
import { IOrderWithoutSensitiveInfo } from "@/types/order.interface";
import { FC } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import formatDate from "@/helpers/formatDate";
import { router } from "expo-router";
import { icons } from "@/constants/icons";
import {
  borderRadiuses,
  fonts,
  fontSizes,
  gaps,
  paddings,
} from "@/constants/styles";
interface OrderDetailsProps {
  order: IOrderWithoutSensitiveInfo;
}
const OrderPreview: FC<OrderDetailsProps> = ({ order }) => {
  const { id, date, parcelType, weight, price, addresses } = order;
  const createdAtString = formatDate(date);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => router.push(`/orders/${id}`)}
      >
        <View style={styles.innerCointainer}>
          <Text style={styles.headerText}>
            {order.addresses.length + " адреса | № " + id}
          </Text>
          <View style={styles.addresses}>
            {addresses.map((address, index) => {
              return (
                <View key={address.id} style={styles.address}>
                  <View style={styles.addressIconContainer}>
                    <Image source={icons.address} style={styles.addressIcon} />
                  </View>
                  <Text style={styles.addressText}>{address.address}</Text>
                  <Text style={styles.addressIndex}>{index + 1}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.footer}>
            <View style={styles.info}>
              <Text style={styles.parcelTypeText}>
                {parcelType + " · " + weight}
              </Text>
              <View style={styles.price}>
                <Text style={styles.priceText}>{price + "₽"}</Text>
              </View>
            </View>
            <View style={styles.meta}>
              <Text style={styles.createdAtText}>
                {"Заказ создан " + createdAtString}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OrderPreview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadiuses.medium,
    paddingHorizontal: paddings.medium,
    paddingVertical: paddings.medium,
  },
  innerCointainer: {
    width: "100%",
    gap: gaps.medium,
    justifyContent: "center",
  },
  headerText: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: 18,
    textAlign: "center",
  },
  addresses: {
    gap: 8,
  },
  address: {
    flexDirection: "row",
    gap: 10,
  },
  addressIconContainer: {
    width: 22,
    height: 24,
  },
  addressIcon: {
    width: "100%",
    height: "100%",
  },
  addressText: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: fontSizes.medium,
    flex: 1,
  },
  addressIndex: {
    position: "absolute",
    left: 8.5,
    top: -2,
  },
  footer: {
    width: "100%",
    gap: 5,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  parcelTypeText: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.medium,
  },
  price: {
    backgroundColor: colors.purple,
    borderRadius: 20,
    padding: 5,
  },
  priceText: {
    color: colors.white,
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.medium,
  },
  meta: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  createdAtText: {
    color: colors.gray,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  moreText: {
    color: colors.gray,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
});
