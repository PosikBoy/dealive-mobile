import { FC } from "react";
import { IAddress } from "@/types/order.interface";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { fonts, fontSizes } from "@/constants/styles";
import { getMetroColor } from "@/utils/getColorMetro";
import copyToClipboard from "@/utils/copyToClipBoard";
import { Link } from "expo-router";

interface IRouteItemProps {
  address: IAddress;
  index: number;
  isTypeShown?: boolean;
  isHighlighted?: boolean;
}

const RouteItem: FC<IRouteItemProps> = (props) => {
  const { address, index, isTypeShown = false, isHighlighted } = props;
  return (
    <Link href={`/orders/${address.orderId}`}>
      <View style={styles.addressContainer}>
        <View style={styles.addressIndexContainer}>
          <Text style={styles.addressIndexText}>{index + 1}</Text>
        </View>

        <View style={[styles.address, isHighlighted && styles.highlited]}>
          <View style={styles.addressTextContainer}>
            <Text style={styles.addressIndex}>{address.orderId}</Text>
            <Text style={styles.addressText}>{address.address}</Text>
          </View>
          {address.phoneNumber && (
            <TouchableOpacity
              style={styles.phoneNumber}
              onLongPress={() => {
                copyToClipboard(address.phoneNumber);
              }}
            >
              <Text style={styles.phoneNumberLabel}>Номер телефона </Text>
              <Text style={styles.phoneNumberInfo}>
                {address.phoneNumber + "  " + address?.phoneName}
              </Text>
            </TouchableOpacity>
          )}
          <View
            style={[
              styles.locationInfo,
              address.geoData?.metro && {
                backgroundColor: getMetroColor(address.geoData.metro[0].line),
              },
            ]}
          >
            {address.geoData?.metro && (
              <Text style={styles.locationInfoText}>
                {address.geoData?.metro[0]?.name + " |"}
              </Text>
            )}
            <Text style={styles.locationInfoText}>
              {address?.distance.toFixed(1) + " км от вас"}
            </Text>
          </View>

          {address.type && isTypeShown && (
            <View style={styles.typeContainer}>
              <Image source={icons.settings} style={styles.floorIcon} />
              <Text style={styles.floorText}>
                {address.type == "DELIVER" ? "Отдать заказ" : "Забрать заказ"}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Link>
  );
};

export default RouteItem;

const styles = StyleSheet.create({
  address: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 20,
    gap: 10,
    flex: 1,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    flex: 1,
  },
  highlited: {
    backgroundColor: colors.green,
  },
  activeAddressTooltip: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: colors.green,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  addressTextContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
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
    flex: 1,
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  addressIndex: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: fontSizes.extraBig,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.inputGray,
    fontFamily: fonts.semiBold,
  },
  phoneNumber: {
    backgroundColor: colors.lightPurple,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 12,
    borderRadius: 20,
  },
  phoneNumberLabel: {
    color: colors.gray,
    fontFamily: fonts.regular,
  },
  phoneNumberInfo: {
    color: colors.black,
    fontFamily: fonts.semiBold,
  },
  info: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fonts.semiBold,
  },
  priceContainer: {
    flexDirection: "row",
    gap: 5,
  },
  priceIcon: {
    width: 20,
    height: 20,
  },
  priceText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fonts.semiBold,
  },

  floorContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  floorText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fonts.semiBold,
  },
  floorIcon: {
    width: 20,
    height: 20,
  },
  cancelOrderButton: {
    padding: 10,
  },
  locationInfo: {
    flexGrow: 0,
    flexDirection: "row",
    alignSelf: "flex-start",
    width: "auto",
    gap: 5,
    backgroundColor: colors.purple,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  locationInfoText: {
    color: colors.white,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 5,

    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: colors.green,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  addressIndexContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.purple,
    justifyContent: "center",
    alignItems: "center",
  },
  addressIndexText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
});
