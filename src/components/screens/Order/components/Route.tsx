import { View, StyleSheet, FlatList } from "react-native";
import React from "react";
import { IAddress } from "@/types/order.interface";
import Address from "./Address";

interface IProps {
  route: IAddress[];
}

const Route = (props: IProps) => {
  const { route } = props;
  console.log(route);
  return (
    <View style={styles.container}>
      <FlatList
        data={route}
        renderItem={(address) => (
          <Address
            address={address.item}
            index={address.item.orderId - 1}
            isTypeShown={true}
          />
        )}
        contentContainerStyle={{
          gap: 10,
          paddingBottom: 150,
          width: "100%",
        }}
        keyExtractor={(item) => item.id.toString()}
        style={{
          paddingTop: 10,
          width: "100%",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});

export default Route;
