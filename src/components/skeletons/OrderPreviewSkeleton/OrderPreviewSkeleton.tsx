import Shimmer from "@/components/ui/Shimmer/Shimmer";
import { colors } from "@/constants/colors";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

const OrderPreviewSkeleton: FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
      <View style={styles.footer}>
        <Shimmer />
      </View>
    </View>
  );
};

export default OrderPreviewSkeleton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 250,
    width: "100%",
    gap: 20,
    alignItems: "center",
  },
  addresses: {
    gap: 15,
    width: "100%",
  },
  header: {
    height: 40,
    width: 150,
    borderRadius: 10,
    backgroundColor: "rgb(136, 136, 136)",
    position: "relative",
  },
  footer: {
    height: 50,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "rgb(136, 136, 136)",
    position: "relative",
  },
  address: {
    width: "100%",
    height: 30,
    backgroundColor: "rgb(136, 136, 136)",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
});
