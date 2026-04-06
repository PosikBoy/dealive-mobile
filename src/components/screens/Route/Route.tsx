import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Header } from '@/components/shared/Header/Header';
import { RouteList } from '@/components/shared/RouteList/RouteList';
import { Button } from '@/components/ui/Button/Button';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { icons } from '@/constants/icons';
import { borderRadiuses } from '@/constants/styles';
import { useActiveOrders } from '@/domain/orders/api';
import { useTypedSelector } from '@/hooks/redux.hooks';
import { useTheme } from '@/hooks/useTheme';
import { yandexMaps } from '@/utils/yandexMaps';

const Route = () => {
  const { colors } = useTheme();
  const routeData = useTypedSelector(state => state.route);
  const { data } = useActiveOrders();

  const sum = useMemo(() => {
    return data.reduce((sum, order) => sum + order.price, 0);
  }, [data]);

  const footerText = useMemo(
    () => `Расстояние ${routeData.distance.toFixed(2)} км | Доход ${sum.toFixed(0)}₽`,
    [routeData.distance, sum],
  );

  const openRoute = async () => {
    try {
      const points = routeData.route.map(address => yandexMaps.getPoint(address));
      yandexMaps.getRoute(points);
    } catch (error) {}
  };

  if (routeData.route?.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title='Маршрут' isButtonBackShown={false} />
        <View style={styles.emptyContainer}>
          <ThemedText type='mediumText' weight='medium' style={styles.emptyText}>
            На данный момент у вас нет активных заказов, поэтому маршрут пуст
          </ThemedText>
          <Image source={icons.noOrders} style={styles.emptyImage} resizeMode='contain' />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <Header title='Маршрут' isButtonBackShown={false} />
      <RouteList
        route={routeData.route}
        showTypeLabel={true}
        showFooter={false}
        contentContainerStyle={{
          gap: 5,
          paddingBottom: 120,
          width: '100%',
        }}
        style={{
          flex: 1,
          paddingTop: 10,
          paddingHorizontal: 5,
          width: '100%',
        }}
      />
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <ThemedText weight='medium' type='mediumText'>
          {footerText}
        </ThemedText>
        <Button buttonText='Открыть маршрут на карте' onPress={openRoute} color='primary' />
      </View>
    </View>
  );
};

export default Route;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyImage: {
    width: 330,
    height: 250,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 10,
    gap: 10,
    borderTopLeftRadius: borderRadiuses.medium,
    borderTopRightRadius: borderRadiuses.medium,
  },
});
