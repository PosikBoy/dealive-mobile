import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { RouteItem } from '@/components/shared/RouteItem';
import { Button } from '@/components/ui/Button/Button';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { IAddress } from '@/domain/orders/types';
import { yandexMaps } from '@/utils/yandexMaps';

interface RouteListProps {
  route: IAddress[];
  orderId?: number;
  showTypeLabel?: boolean;
  emptyMessage?: string;
  showFooter?: boolean;
  footerComponent?: React.ComponentType | React.ReactElement;
  contentContainerStyle?: object;
  style?: object;
}

export const RouteList: React.FC<RouteListProps> = ({
  route,
  orderId,
  showTypeLabel = false,
  emptyMessage = 'Маршрут пуст',
  showFooter = true,
  footerComponent,
  contentContainerStyle,
  style,
}) => {
  const openRoute = async () => {
    try {
      const points = route.map(address => yandexMaps.getPoint(address));
      yandexMaps.getRoute(points);
    } catch (error) {}
  };

  if (route.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText weight='medium' type='mediumText'>
          {emptyMessage}
        </ThemedText>
      </View>
    );
  }

  const DefaultFooter = () => (
    <Button buttonText='Открыть маршрут на карте' onPress={openRoute} color='primary' />
  );

  return (
    <FlatList
      data={route}
      renderItem={({ item, index }) => (
        <RouteItem
          address={item}
          index={index}
          isTypeShown={showTypeLabel}
          isHighlighted={orderId ? item.orderId === orderId : false}
        />
      )}
      contentContainerStyle={contentContainerStyle}
      keyExtractor={item => item.id.toString()}
      style={style}
      ListFooterComponent={showFooter ? footerComponent || DefaultFooter : undefined}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
});
