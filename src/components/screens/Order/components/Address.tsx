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

interface IAdressProps {
  address: IAddress | IAddressWithoutSensitiveInfo;
  index: number;
  price: number;
}

const Address: FC<IAdressProps> = ({ address, index, price }) => {
  const handleOpenURL = () => {
    const url = "https://yandex.ru/maps/213/moscow/search/" + address.address;
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
          <View style={styles.addressIconContainer}>
            <Image source={icons.address} style={styles.addressIcon} />
          </View>
          <Text style={styles.addressText}>{address.address}</Text>
          <Text style={styles.addressIndex}>{index + 1}</Text>
        </View>
      </TouchableOpacity>
      {"phoneNumber" in address && (
        <TouchableOpacity onPress={handleCall} style={styles.phoneNumber}>
          <Text style={styles.phoneNumberLabel}>Номер телефона </Text>
          <Text style={styles.phoneNumberInfo}>
            {address.phoneNumber + " · " + address?.phoneName}
          </Text>
        </TouchableOpacity>
      )}
      <View>
        <Text style={styles.infoLabel}>Дополнительно</Text>
        <Text style={styles.info}>{address.info}</Text>
      </View>
      {index == 0 && (
        <View style={styles.priceContainer}>
          <Image source={icons.money} style={styles.priceIcon} />
          <Text style={styles.priceText}>{"Получить " + price + "₽"}</Text>
        </View>
      )}
      {"floor" in address && (
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
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
  },
  addressIndex: {
    position: "absolute",
    left: 8.5,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.inputGray,
    fontFamily: "Montserrat-SemiBold",
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
    fontFamily: "Montserrat-Regular",
  },
  phoneNumberInfo: {
    color: colors.black,
    fontFamily: "Montserrat-SemiBold",
  },
  info: {
    fontSize: 14,
    color: colors.black,
    fontFamily: "Montserrat-SemiBold",
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
    fontFamily: "Montserrat-SemiBold",
  },

  floorContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  floorText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: "Montserrat-SemiBold",
  },
  floorIcon: {
    width: 20,
    height: 20,
  },
  cancelOrderButton: {
    padding: 10,
  },
});
