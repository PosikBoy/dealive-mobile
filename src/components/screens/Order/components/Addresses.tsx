import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button/Button';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { IOrder } from '@/domain/orders/types';
import formatDate from '@/utils/formatDate';
import { yandexMaps } from '@/utils/yandexMaps';

import Address from './Address';

type Props = {
  order: IOrder;
  activeAddressId: number;
};

export const Addresses = (props: Props) => {
  const { order, activeAddressId } = props;

  const openRoute = async () => {
    try {
      const points = order.addresses.map(address => yandexMaps.getPoint(address));

      yandexMaps.getRoute(points);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={order.addresses}
        renderItem={({ item, index }) => (
          <Address
            address={item}
            index={index}
            price={order.price}
            isActive={item.id == activeAddressId}
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{
          gap: 10,
          paddingTop: 10,
          paddingBottom: 150,
        }}
        ListFooterComponent={
          <>
            <Button buttonText='Открыть маршрут на карте' onPress={openRoute} color='primary' />
            <View style={styles.creationDateContainer}>
              <ThemedText type='mediumText' weight='medium'>
                {`Создан ${formatDate(order.date)}`}
              </ThemedText>
            </View>
            {order.statusId == 5 && <ThemedText type='title'>Заказ завершен, спасибо!</ThemedText>}
          </>
        }
        ListFooterComponentStyle={{ gap: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
  },
  creationDateContainer: {
    paddingVertical: 20,
    borderRadius: 20,
  },
});
