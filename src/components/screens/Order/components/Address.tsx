import { FC } from "react";
import {
  IAddress,
  IAddressWithoutSensitiveInfo,
} from "@/types/order.interface";
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
import Hyperlink from "react-native-hyperlink";
import { getMetroColor } from "@/utils/getColorMetro";

interface IAdressProps {
  address: IAddress | IAddressWithoutSensitiveInfo;
  index: number;
  price: number;
}

const Address: FC<IAdressProps> = ({ address, index, price }) => {
  const handleOpenURL = () => {
    const url = `https://yandex.ru/maps/?rtext=~${address.geoData.geoLat}%2C${address.geoData.geoLon}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        }
      })
      .catch((err) => console.error("Ошибка при открытии URL: ", err));
  };

  const handleCall = () => {
    Linking.openURL(
      `tel:${"phoneNumber" in address ? address.phoneNumber : ""}`
    );
  };

  return (
    <View style={styles.address}>
      <TouchableOpacity onPress={handleOpenURL}>
        <View style={styles.addressTextContainer}>
          <Text style={styles.addressIndex}>{index + 1}</Text>
          <Text style={styles.addressText}>{address.address}</Text>
        </View>
      </TouchableOpacity>
      {"phoneNumber" in address && (
        <TouchableOpacity onPress={handleCall} style={styles.phoneNumber}>
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
      {address.info && (
        <View>
          <Text style={styles.infoLabel}>Дополнительно</Text>
          <Hyperlink onPress={(url) => Linking.openURL(url)}>
            <Text style={styles.info}>{address.info}</Text>
          </Hyperlink>
        </View>
      )}

      {index == 0 && (
        <View style={styles.priceContainer}>
          <Image source={icons.money} style={styles.priceIcon} />
          <Text style={styles.priceText}>{"Получить " + price + "₽"}</Text>
        </View>
      )}
      {"floor" in address && address.floor && (
        <View style={styles.floorContainer}>
          <Image source={icons.building} style={styles.floorIcon} />
          <Text style={styles.floorText}>
            {address.floor + " этаж · " + address.apartment + " кв."}
          </Text>
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
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    gap: 10,
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
});
