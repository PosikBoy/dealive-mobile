import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import { colors } from "@/constants/colors";
import AvailableOrders from "./components/AvailableOrders";
import ActiveOrders from "./components/ActiveOrders";
import { fonts, fontSizes } from "@/constants/styles";

const OrdersScreen = () => {
  const [currentPage, setCurrentPage] = useState<"available" | "active">(
    "available"
  );
  const [sortingRules, setSortingRules] = useState<
    "date" | "price" | "distance"
  >("date");
  return (
    <View style={styles.container}>
      <View style={styles.ordersHeader}>
        <Text style={styles.ordersHeaderText}>Заказы</Text>
        <View style={styles.togglerType}>
          <TouchableOpacity
            onPress={() => setCurrentPage("available")}
            style={[
              styles.togglerOption,
              currentPage === "available" && styles.activeTogglerOption,
            ]}
          >
            <Text
              style={[
                styles.togglerText,
                currentPage === "available" && styles.activeTogglerText,
              ]}
            >
              Доступные
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentPage("active")}
            style={[
              styles.togglerOption,
              currentPage === "active" && styles.activeTogglerOption,
            ]}
          >
            <Text
              style={[
                styles.togglerText,
                currentPage === "active" && styles.activeTogglerText,
              ]}
            >
              Активные
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.ordersContainer}>
        {currentPage === "available" ? <AvailableOrders /> : <ActiveOrders />}
      </View>
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  ordersHeader: {
    paddingVertical: 20,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    gap: 7,
  },
  ordersHeaderText: {
    fontSize: fontSizes.big,
    fontFamily: fonts.semiBold,
    textAlign: "center",
  },
  togglerType: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 40,
    backgroundColor: colors.lightGray,
    overflow: "hidden",
  },
  togglerText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  togglerOption: {
    padding: 7,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },

  activeTogglerOption: {
    backgroundColor: colors.purple,
  },
  activeTogglerText: {
    color: colors.white,
  },
  ordersContainer: {},
});
