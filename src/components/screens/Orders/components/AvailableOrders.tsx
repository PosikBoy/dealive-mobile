import { FlashList } from '@shopify/flash-list';
import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActionSheetRef } from 'react-native-actions-sheet';

import OrderPreview from '@/components/features/OrderPreview/OrderPreview';
import CustomBottomSheetModal from '@/components/shared/CustomBottomSheetModal/CustomBottomSheetModal';
import OrderPreviewSkeleton from '@/components/skeletons/OrderPreviewSkeleton/OrderPreviewSkeleton';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { colors } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { borderRadiuses } from '@/constants/styles';
import { useAvailableOrders } from '@/domain/orders/api';
import { useTypedSelector } from '@/hooks/redux.hooks';
import { useTheme } from '@/hooks/useTheme';

const sortingRuleOptions = ['lastDate', 'priceASC', 'priceDESC', 'distance'] as const;

const sortingRulesOptionsText = {
  lastDate: 'По дате (сначала новые)',
  priceASC: 'По цене (от дешевых к дорогим)',
  priceDESC: 'По цене (от дорогих к дешевым)',
  distance: 'По расстоянию (ближайший)',
};

type SortingRulesTypes = (typeof sortingRuleOptions)[number];

const AvailableOrders = () => {
  const { colors } = useTheme();

  const location = useTypedSelector(state => state.location);

  const [sortingRules, setSortingRules] = useState<SortingRulesTypes>('lastDate');

  const sortingRulesModalRef = useRef<ActionSheetRef>(null);

  const { data, isLoading, refetch, isFetching } = useAvailableOrders();

  const handleSortingRulePress = (type: SortingRulesTypes) => {
    setSortingRules(type);
    sortingRulesModalRef.current.hide();
  };

  const sortedOrders = useMemo(() => {
    return data
      ? [...data].sort((a, b) => {
          switch (sortingRules) {
            case 'priceASC':
              return a.price - b.price;
            case 'priceDESC':
              return b.price - a.price;
            case 'distance':
              return a.addresses[0].distance - b.addresses[0].distance;
            case 'lastDate':
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
          <View style={[styles.loadingModal]}>
            <ThemedText type='big' weight='medium'>
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
          <View style={[styles.loadingModal, { backgroundColor: colors.background }]}>
            <ActivityIndicator size={'large'} color={colors.primary} />
            <ThemedText type='big' weight='bold'>
              {location.isLocationLoading
                ? 'Пытаемся определить ваше местоположение'
                : 'Запрашиваем заказы с сервера'}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => sortingRulesModalRef.current.show()}
          style={[styles.sortButton, { backgroundColor: colors.background }]}
        >
          <ThemedText weight='medium' type='mediumText'>
            Сортировка заказов
          </ThemedText>
        </TouchableOpacity>
        <FlashList
          data={sortedOrders}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <OrderPreview order={item} />}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      <TouchableOpacity
        style={[styles.update, { backgroundColor: colors.background }]}
        onPress={() => refetch()}
        disabled={isFetching}
      >
        {isFetching ? (
          <ActivityIndicator size='small' color={colors.primary} />
        ) : (
          <Image
            tintColor={colors.tint}
            source={icons.refetch}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </TouchableOpacity>
      <CustomBottomSheetModal ref={sortingRulesModalRef}>
        <View style={{ backgroundColor: colors.background }}>
          <ThemedText weight='semiBold' type='mediumText'>
            Как отсортировать?
          </ThemedText>
          {sortingRuleOptions.map(item => {
            return (
              <TouchableOpacity
                style={styles.modalButton}
                key={item}
                onPress={() => {
                  handleSortingRulePress(item);
                }}
              >
                <ThemedText weight='medium' type='mediumText'>
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
    position: 'relative',
    paddingHorizontal: 5,
  },
  loadingContainer: {
    marginTop: 16,
    gap: 20,
  },
  loadingTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModal: {
    transform: [{ translateY: -60 }],
    padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListStyles: {
    paddingBottom: 120,
    gap: 20,
  },
  searchOrderContainer: {
    marginHorizontal: 'auto',
    marginTop: 100,
    height: 256,
    width: 256,
  },
  separator: {
    height: 5,
  },
  update: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 40,
    height: 40,
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
    borderColor: colors.gray,
  },
});
