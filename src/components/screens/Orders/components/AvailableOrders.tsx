import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { useGetAvailableOrdersQueryWithSorting } from "@/services/orders/orders.service";
import OrderPreview from "@/components/features/OrderPreview/OrderPreview";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { useTypedSelector } from "@/hooks/redux.hooks";
import { borderRadiuses, fonts, fontSizes } from "@/constants/styles";
import CustomBottomSheetModal from "@/components/shared/CustomBottomSheetModal/CustomBottomSheetModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import OrderPreviewSkeleton from "@/components/features/OrderPreviewSkeleton/OrderPreviewSkeleton";

const AvailableOrders = () => {
  const location = useTypedSelector((state) => state.location);

  const [sortingRules, setSortingRules] = useState<
    "lastDate" | "priceASC" | "priceDESC" | "distance"
  >("lastDate");
  const ref = useRef<BottomSheetModal>(null);
  const { data, isLoading, refetch, isFetching } =
    useGetAvailableOrdersQueryWithSorting(sortingRules);

  if (location.error) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
        </View>
        <View style={styles.loadingTextContainer}>
          <View style={styles.loadingModal}>
            <Text style={styles.text}>{location.error}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (location.isLocationLoading || isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
        </View>
        <View style={styles.loadingTextContainer}>
          <View style={styles.loadingModal}>
            <ActivityIndicator size={"large"} color={colors.purple} />
            <Text style={styles.text}>
              {location.isLocationLoading
                ? "Пытаемся определить ваше местоположение"
                : "Запрашиваем заказы с сервера"}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={data}
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
  loadingContainer: {
    marginTop: 16,
    gap: 20,
  },
  loadingTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingModal: {
    transform: [{ translateY: -60 }],
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
