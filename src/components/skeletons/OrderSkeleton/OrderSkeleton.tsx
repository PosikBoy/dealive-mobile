import Shimmer from "@/components/ui/Shimmer/Shimmer";
import { colors } from "@/constants/colors";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

const OrderSkeleton: FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Shimmer />
      </View>
      <View style={styles.toggler}>
        <Shimmer />
      </View>
      <View style={styles.addresses}>
        <View style={styles.address}>
          <Shimmer />
        </View>
        <View style={styles.address}>
          <Shimmer />
        </View>
      </View>
      <View style={styles.createdAt}>
        <Shimmer />
      </View>
      <View style={styles.footer}>
        <Shimmer />
      </View>
    </View>
  );
};

export default OrderSkeleton;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white,
    height: "100%",
    width: "100%",
    gap: 20,
    alignItems: "center",
  },
  header: {
    height: 20,
    width: 150,
    borderRadius: 10,
    backgroundColor: "rgb(136, 136, 136)",
    position: "relative",
  },
  toggler: {
    height: 35,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "rgb(136, 136, 136)",
    position: "relative",
  },
  addresses: {
    gap: 15,
    width: "100%",
  },
  address: {
    width: "100%",
    height: 220,
    backgroundColor: "rgb(136, 136, 136)",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },

  createdAt: {
    height: 70,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "rgb(136, 136, 136)",
    position: "relative",
  },

  footer: {
    height: 70,
    width: "120%",
    borderRadius: 10,
    backgroundColor: "rgb(136, 136, 136)",
    position: "absolute",
    bottom: 0,
  },
});
