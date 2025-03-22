import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { useGetAvailableOrdersQuery } from "@/services/orders/orders.service";
import OrderPreview from "@/components/features/OrderPreview/OrderPreview";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { useTypedSelector } from "@/hooks/redux.hooks";
import CustomBottomSheetModal from "@/components/shared/CustomBottomSheetModal/CustomBottomSheetModal";
import OrderPreviewSkeleton from "@/components/skeletons/OrderPreviewSkeleton/OrderPreviewSkeleton";
import { ActionSheetRef } from "react-native-actions-sheet";
import ThemedText from "@/components/ui/ThemedText/ThemedText";
import { borderRadiuses } from "@/constants/styles";
import { FlashList } from "@shopify/flash-list";

const sortingRuleOptions = [
  "lastDate",
  "priceASC",
  "priceDESC",
  "distance",
] as const;

const sortingRulesOptionsText = {
  lastDate: "По дате (сначала новые)",
  priceASC: "По цене (от дешевых к дорогим)",
  priceDESC: "По цене (от дорогих к дешевым)",
  distance: "По расстоянию (ближайший)",
};

type SortingRulesTypes = (typeof sortingRuleOptions)[number];

const AvailableOrders = () => {
  const colorScheme = useColorScheme() || "light";
  const location = useTypedSelector((state) => state.location);

  const [sortingRules, setSortingRules] =
    useState<SortingRulesTypes>("lastDate");

  const sortingRulesModalRef = useRef<ActionSheetRef>(null);

  const { data, isLoading, refetch, isFetching } = useGetAvailableOrdersQuery();

  const handleSortingRulePress = (type: SortingRulesTypes) => {
    setSortingRules(type);
    sortingRulesModalRef.current.hide();
  };

  const sortedOrders = useMemo(() => {
    return data
      ? [...data].sort((a, b) => {
          switch (sortingRules) {
            case "priceASC":
              return a.price - b.price;
            case "priceDESC":
              return b.price - a.price;
            case "distance":
              return a.addresses[0].distance - b.addresses[0].distance;
            case "lastDate":
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            default:
              return 0;
          }
        })
      : [];
  }, [data, sortingRules]);

  if (location.error) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
        </View>
        <View style={styles.loadingTextContainer}>
          <View
            style={[
              styles.loadingModal,
              { backgroundColor: colors[colorScheme].white },
            ]}
          >
            <ThemedText type="big" weight="medium">
              {location.error}
            </ThemedText>
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
          <View
            style={[
              styles.loadingModal,
              { backgroundColor: colors[colorScheme].white },
            ]}
          >
            <ActivityIndicator size={"large"} color={colors.purple} />
            <ThemedText type="big" weight="bold">
              {location.isLocationLoading
                ? "Пытаемся определить ваше местоположение"
                : "Запрашиваем заказы с сервера"}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => sortingRulesModalRef.current.show()}
          style={[
            styles.sortButton,
            { backgroundColor: colors[colorScheme].white },
          ]}
        >
          <ThemedText weight="medium" type="mediumText">
            Сортировка заказов
          </ThemedText>
        </TouchableOpacity>
        <FlashList
          data={sortedOrders}
          estimatedItemSize={150}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <OrderPreview order={item} />}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      <TouchableOpacity
        style={[styles.update, { backgroundColor: colors[colorScheme].white }]}
        onPress={() => refetch()}
        disabled={isFetching}
      >
        {isFetching ? (
          <ActivityIndicator size="small" color={colors.purple} />
        ) : (
          <Image
            tintColor={colors[colorScheme].black}
            source={icons.refetch}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </TouchableOpacity>
      <CustomBottomSheetModal ref={sortingRulesModalRef}>
        <View style={{ backgroundColor: colors[colorScheme].white }}>
          <ThemedText weight="semiBold" type="mediumText">
            Как отсортировать?
          </ThemedText>
          {sortingRuleOptions.map((item) => {
            return (
              <TouchableOpacity
                style={styles.modalButton}
                key={item}
                onPress={() => {
                  handleSortingRulePress(item);
                }}
              >
                <ThemedText weight="medium" type="mediumText">
                  {sortingRulesOptionsText[item]}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </CustomBottomSheetModal>
    </View>
  );
};

export default AvailableOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    paddingHorizontal: 5,
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
    backgroundColor: colors.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingModal: {
    transform: [{ translateY: -60 }],
    padding: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListStyles: {
    paddingBottom: 120,
    gap: 20,
  },
  searchOrderContainer: {
    marginHorizontal: "auto",
    marginTop: 100,
    height: 256,
    width: 256,
  },
  separator: {
    height: 5,
  },
  update: {
    position: "absolute",
    bottom: 50,
    right: 20,
    width: 40,
    height: 40,
    padding: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  sortButton: {
    borderRadius: borderRadiuses.big,
    padding: 10,
    marginVertical: 5,
  },
  modalButton: {
    paddingHorizontal: 10,
    padding: 15,
    borderBottomWidth: 1,
    textAlign: "center",
    borderColor: colors.gray,
  },
});
