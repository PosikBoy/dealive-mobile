import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useGetAvailableOrdersQuery } from "@/services/orders/orders.service";
import OrderPreview from "@/components/ui/OrderPreview/OrderPreview";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { IOrderWithoutSensitiveInfo } from "@/types/order.interface";
import geodataService from "@/services/geodata/geodata.service";
import { useTypedSelector } from "@/hooks/redux.hooks";
import { borderRadiuses, fonts, fontSizes } from "@/constants/styles";
import CustomBottomSheetModal from "@/components/ui/CustomBottomSheetModal/CustomBottomSheetModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
const AvailableOrders = () => {
  const [orders, setOrders] = useState<IOrderWithoutSensitiveInfo[]>([]);
  const location = useTypedSelector((state) => state.location);

  const [sortingRules, setSortingRules] = useState<
    "lastDate" | "priceASC" | "priceDESC" | "distance"
  >("lastDate");
  const ref = useRef<BottomSheetModal>(null);
  const { data, isLoading, refetch, isFetching } = useGetAvailableOrdersQuery(
    undefined,
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  useEffect(() => {
    if (!location.isLocationLoading && data) {
      const enrichedOrders = geodataService.enrichOrders(data, location);
      const sortedOrders = enrichedOrders.sort((a, b) => {
        if (sortingRules === "priceASC") {
          return a.price - b.price;
        } else if (sortingRules === "priceDESC") {
          return b.price - a.price;
        } else if (sortingRules === "distance") {
          return a.addresses[0].distance - b.addresses[0].distance;
        } else if (sortingRules === "lastDate") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });
      setOrders(sortedOrders);
    }
  }, [data, location, sortingRules]);

  if (location.isLocationLoading || isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.searchOrderContainer}>
          <ActivityIndicator size={"large"} color={colors.purple} />
          <Text style={styles.text}>
            Ищем заказы или пытаемся определить ваше местоположение
          </Text>
          <Text style={styles.text}>Подождите, пожалуйста</Text>
        </View>
      </View>
    );
  }
  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.searchOrderContainer}>
          <Image
            source={icons.searchOrders}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={orders}
          ListHeaderComponent={() => (
            <TouchableOpacity
              onPress={() => ref.current?.present()}
              style={styles.sortButton}
            >
              <Text style={styles.sortButtonText}> Сортировка заказов</Text>
            </TouchableOpacity>
          )}
          renderItem={({ item }) => <OrderPreview order={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListStyles}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity style={styles.update} onPress={() => refetch()}>
        {isFetching ? (
          <ActivityIndicator size="small" color={colors.purple} />
        ) : (
          <Image
            source={icons.refetch}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </TouchableOpacity>
      <CustomBottomSheetModal ref={ref}>
        <View>
          <Text style={styles.modalHeaderText}>Как отсортировать?</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setSortingRules("distance");
              ref.current.close();
            }}
          >
            <Text style={styles.modalButtonText}>
              По адресу (ближайший первый)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setSortingRules("lastDate");
              ref.current.close();
            }}
          >
            <Text style={styles.modalButtonText}> По дате (сначала новые)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setSortingRules("priceASC");
              ref.current.close();
            }}
          >
            <Text style={styles.modalButtonText}>
              По цене (от дешевых к дорогим)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setSortingRules("priceDESC");
              ref.current.close();
            }}
          >
            <Text style={styles.modalButtonText}>
              По цене (от дорогих к дешевым)
            </Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheetModal>
    </View>
  );
};

export default AvailableOrders;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal: 5,
    position: "relative",
  },
  text: {
    color: colors.black,
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.medium,
  },
  flatListStyles: {
    paddingBottom: 126,
  },
  searchOrderContainer: {
    marginHorizontal: "auto",
    marginTop: 100,
    height: 256,
    width: 256,
  },
  separator: {
    height: 20, // Отступ между элементами
    backgroundColor: "transparent",
  },
  update: {
    position: "absolute",
    bottom: 130,
    right: 20,
    width: 40,
    height: 40,
    padding: 10,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  sortButton: {
    padding: 5,
    alignSelf: "flex-start",
  },
  sortButtonText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.medium,
    color: colors.black,
    backgroundColor: colors.white,
    borderRadius: borderRadiuses.big,
    padding: 10,
  },
  modalHeaderText: {
    fontSize: fontSizes.big,
    fontFamily: fonts.semiBold,
    textAlign: "center",
  },
  modalButton: {
    paddingHorizontal: 10,
  },
  modalButtonText: {
    padding: 15,
    fontSize: fontSizes.medium,
    fontFamily: fonts.medium,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    textAlign: "center",
  },
});
