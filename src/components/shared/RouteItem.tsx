import { FC } from "react";
import { IAddress } from "@/types/order.interface";
import { Image, StyleSheet, useColorScheme, View } from "react-native";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { getMetroColor } from "@/utils/getColorMetro";
import { Link } from "expo-router";
import ThemedText from "../ui/ThemedText/ThemedText";

interface IRouteItemProps {
  address: IAddress;
  index: number;
  isTypeShown?: boolean;
  isHighlighted?: boolean;
}

const RouteItem: FC<IRouteItemProps> = (props) => {
  const colorScheme = useColorScheme();
  const { address, index, isTypeShown = false, isHighlighted } = props;

  const metroString = address.geoData?.metro?.[0]?.name
    ? address.geoData?.metro?.[0]?.name + " |"
    : "";
  const distance = address.distance?.toFixed(1) || "";

  return (
    <Link href={`/orders/${address.orderId}`}>
      <View style={styles.addressContainer}>
        <View style={styles.addressIndexContainer}>
          <ThemedText style={{ color: colors.white }} weight="bold">
            {index + 1}
          </ThemedText>
        </View>

        <View
          style={[
            styles.address,
            isHighlighted && styles.highlited,
            isTypeShown && { paddingTop: 30 },
            { backgroundColor: colors[colorScheme].white },
          ]}
        >
          <View style={styles.addressTextContainer}>
            <ThemedText type="title" weight="medium">
              {address.orderId}
            </ThemedText>
            <ThemedText
              type="mediumText"
              weight="medium"
              style={{ textAlign: "left", flex: 1 }}
            >
              {address.address}
            </ThemedText>
          </View>

          <View
            style={[
              styles.locationInfo,
              address.geoData?.metro && {
                backgroundColor: getMetroColor(address.geoData.metro[0].line),
              },
            ]}
          >
            <ThemedText
              style={{ color: colors.white }}
            >{`${metroString} ${distance} км от вас`}</ThemedText>
          </View>

          {address.type && isTypeShown && (
            <View
              style={[
                styles.typeContainer,
                { backgroundColor: colors[colorScheme].green },
              ]}
            >
              <Image source={icons.settings} style={styles.floorIcon} />
              <ThemedText type="hint">
                {address.type == "DELIVER" ? "Отдать заказ" : "Забрать заказ"}
              </ThemedText>
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
    paddingTop: 10,
    paddingBottom: 10,
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
  typeContainer: {
    flexDirection: "row",
    gap: 5,
    position: "absolute",
    top: 0,
    left: 0,
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
});
