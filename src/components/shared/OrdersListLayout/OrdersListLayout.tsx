import { FlashList } from '@shopify/flash-list';
import React, { ReactElement, ReactNode } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActionSheetRef } from 'react-native-actions-sheet';

import CustomBottomSheetModal from '@/components/shared/CustomBottomSheetModal/CustomBottomSheetModal';
import OrderPreviewSkeleton from '@/components/skeletons/OrderPreviewSkeleton/OrderPreviewSkeleton';
import { Button } from '@/components/ui/Button/Button';
import { RefetchButton } from '@/components/ui/RefetchButton/RefetchButton';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { colors } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { borderRadiuses } from '@/constants/styles';
import { IOrder } from '@/domain/orders/types';
import { useTypedSelector } from '@/hooks/redux.hooks';
import { useTheme } from '@/hooks/useTheme';

interface OrdersListLayoutProps<T = IOrder> {
  // Данные
  data: T[];
  isLoading: boolean;
  isFetching?: boolean;

  // Функции
  refetch: () => void;
  renderItem: (item: T) => ReactElement;
  keyExtractor: (item: T) => string;

  // Опциональные настройки
  emptyMessage?: string;
  loadingMessage?: string;
  showSortButton?: boolean;
  sortingRulesModalRef?: React.RefObject<ActionSheetRef>;
  sortingRuleOptions?: readonly string[];
  sortingRulesOptionsText?: Record<string, string>;
  onSortingRulePress?: (rule: string) => void;
  refetchButtonBottom?: number;

  // Кастомный контент для пустого состояния
  emptyComponent?: ReactNode;

  // Дополнительный контент перед списком
  headerComponent?: ReactNode;
}

export const OrdersListLayout = <T extends any>({
  data,
  isLoading,
  isFetching = false,
  refetch,
  renderItem,
  keyExtractor,
  emptyMessage = 'Похоже, что сейчас мы не можем порекомендовать вам заказы',
  loadingMessage = 'Запрашиваем заказы с сервера',
  showSortButton = false,
  sortingRulesModalRef,
  sortingRuleOptions,
  sortingRulesOptionsText,
  onSortingRulePress,
  refetchButtonBottom = 50,
  emptyComponent,
  headerComponent,
}: OrdersListLayoutProps<T>) => {
  const { colors } = useTheme();
  const location = useTypedSelector(state => state.location);

  // Состояние ошибки геолокации
  if (location.error) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
        </View>
        <View style={styles.loadingTextContainer}>
          <View style={[styles.loadingModal, { backgroundColor: colors.background }]}>
            <ThemedText type='big' weight='medium'>
              {location.error}
            </ThemedText>
          </View>
        </View>
        <RefetchButton onPress={refetch} isLoading={isFetching} bottom={refetchButtonBottom} />
      </View>
    );
  }

  // Состояние загрузки
  if (location.isLocationLoading || isLoading) {
    return (
      <View style={[styles.container]}>
        <View style={styles.loadingContainer}>
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
          <OrderPreviewSkeleton />
        </View>
        <View style={styles.loadingTextContainer}>
          <View style={[styles.loadingModal, { backgroundColor: colors.background }]}>
            <ActivityIndicator size='large' color={colors.primary} />
            <ThemedText type='big' weight='bold'>
              {location.isLocationLoading
                ? 'Пытаемся определить ваше местоположение'
                : loadingMessage}
            </ThemedText>
          </View>
        </View>
        <RefetchButton onPress={refetch} isLoading={isFetching} bottom={refetchButtonBottom} />
      </View>
    );
  }

  // Пустое состояние
  if (data.length === 0) {
    return (
      <View style={styles.container}>
        {emptyComponent || (
          <View style={styles.emptyContainer}>
            <ThemedText weight='medium' type='mediumText'>
              {emptyMessage}
            </ThemedText>
            <Image source={icons.noOrders} style={styles.emptyImage} resizeMode='cover' />
          </View>
        )}
        <RefetchButton onPress={refetch} isLoading={isFetching} bottom={refetchButtonBottom} />
      </View>
    );
  }

  // Основное состояние со списком
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {headerComponent}

        {showSortButton && sortingRulesModalRef && (
          <Button
            onPress={() => sortingRulesModalRef.current?.show()}
            style={[styles.sortButton, { backgroundColor: colors.background }]}
            buttonText='Сортировка заказов'
            size='small'
            variant='outlined'
          />
        )}

        <FlashList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => renderItem(item)}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      <RefetchButton onPress={refetch} isLoading={isFetching} bottom={refetchButtonBottom} />

      {showSortButton && sortingRulesModalRef && sortingRuleOptions && sortingRulesOptionsText && (
        <CustomBottomSheetModal ref={sortingRulesModalRef}>
          <View style={{ backgroundColor: colors.background }}>
            <ThemedText weight='semiBold' type='mediumText'>
              Как отсортировать?
            </ThemedText>
            {sortingRuleOptions.map(item => (
              <TouchableOpacity
                style={styles.modalButton}
                key={item}
                onPress={() => onSortingRulePress?.(item)}
              >
                <ThemedText weight='medium' type='mediumText'>
                  {sortingRulesOptionsText[item]}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </CustomBottomSheetModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 330,
    height: 250,
  },
  loadingContainer: {
    gap: 5,
  },
  loadingTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  separator: {
    height: 5,
  },
  sortButton: {
    borderRadius: borderRadiuses.big,
    marginBlockEnd: 5,
  },
  modalButton: {
    paddingHorizontal: 10,
    padding: 15,
    borderBottomWidth: 1,
    textAlign: 'center',
    borderColor: colors.gray,
  },
});
