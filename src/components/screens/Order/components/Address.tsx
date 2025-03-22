import { FC } from "react";
import { IAddress } from "@/types/order.interface";
import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import Hyperlink from "react-native-hyperlink";
import { getMetroColor } from "@/utils/getColorMetro";
import copyToClipboard from "@/utils/copyToClipBoard";
import yandexMaps from "@/utils/yandexMaps";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

interface IAddressProps {
  address: IAddress;
  index: number;
  price?: number;
  isActive?: boolean;
  isTypeShown?: boolean;
}

const Address: FC<IAddressProps> = (props) => {
  const { address, index, price, isActive, isTypeShown = false } = props;

  const handleOpenURL = async () => {
    try {
      yandexMaps.getRouteToPoint(
        address.geoData.geoLat,
        address.geoData.geoLon
      );
    } catch (err) {
      console.error("Ошибка при открытии URL:", err);
    }
  };

  const handleCall = () => {
    Linking.openURL(
      `tel:${"phoneNumber" in address ? address.phoneNumber : ""}`
    );
  };

  const metroString = address.geoData?.metro?.[0]?.name
    ? address.geoData?.metro?.[0]?.name + " |"
    : "";
  const distance = address.distance?.toFixed(1) || "";

  return (
    <View style={[styles.address, isActive && styles.active]}>
      {isActive && (
        <View style={styles.activeAddressTooltip}>
          <ThemedText>Активный адрес</ThemedText>
        </View>
      )}
      <TouchableOpacity
        onPress={handleOpenURL}
        onLongPress={() => {
          copyToClipboard(address.address);
        }}
      >
        <View style={styles.addressTextContainer}>
          <ThemedText type="title">{index + 1}</ThemedText>
          <ThemedText
            type="mediumText"
            weight="bold"
            style={{ textAlign: "left", flex: 1 }}
          >
            {address.address}
          </ThemedText>
        </View>
      </TouchableOpacity>
      {address.phoneNumber && (
        <TouchableOpacity
          onPress={handleCall}
          style={styles.phoneNumber}
          onLongPress={() => {
            copyToClipboard(address.phoneNumber);
          }}
        >
          <ThemedText type="hint" color="gray" align="left">
            Номер телефона
          </ThemedText>
          <ThemedText type="mediumText" weight="bold" align="left">
            {`${address.phoneNumber} ${address?.phoneName}`}
          </ThemedText>
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
        <ThemedText color="white">{`${metroString} ${distance} км от вас`}</ThemedText>
      </View>
      {address.info && (
        <View>
          <ThemedText type="hint" align="left">
            Дополнительно
          </ThemedText>
          <Hyperlink onPress={(url) => Linking.openURL(url)}>
            <ThemedText weight="medium" align="left">
              {address.info}
            </ThemedText>
          </Hyperlink>
        </View>
      )}

      {index == 0 && (
        <View style={styles.priceContainer}>
          <Image source={icons.money} style={styles.priceIcon} />
          <ThemedText type="mediumText" weight="medium">
            {`Получить ${price} ₽`}
          </ThemedText>
        </View>
      )}
      {address.floor && (
        <View style={styles.floorContainer}>
          <Image source={icons.building} style={styles.floorIcon} />
          <ThemedText type="mediumText" weight="medium">
            {`${address.floor} этаж ·  ${address.apartment} кв.`}
          </ThemedText>
        </View>
      )}
      {address.type && isTypeShown && (
        <View style={styles.typeContainer}>
          <Image source={icons.settings} style={styles.floorIcon} />
          <ThemedText type="mediumText" weight="medium">
            {address.type == "DELIVER" ? "Отдать заказ" : "Забрать заказ"}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

export default Address;

const styles = StyleSheet.create({
  address: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: colors.white,
    borderRadius: 20,
    gap: 10,
  },
  active: {
    paddingTop: 30,
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
  phoneNumber: {
    backgroundColor: colors.lightPurple,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  priceContainer: {
    flexDirection: "row",
    gap: 5,
  },
  priceIcon: {
    width: 20,
    height: 20,
  },

  floorContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },

  floorIcon: {
    width: 20,
    height: 20,
  },
  cancelOrderButton: {
    padding: 10,
  },
  locationInfo: {
    alignSelf: "flex-start",
    gap: 5,
    backgroundColor: colors.purple,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
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
});
