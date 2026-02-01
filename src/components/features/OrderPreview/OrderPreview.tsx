import { router } from 'expo-router';
import { FC, memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';

import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { colors } from '@/constants/colors';
import { borderRadiuses, gaps, paddings } from '@/constants/styles';
import { IOrder } from '@/domain/orders/types';
import { useTheme } from '@/hooks/useTheme';
import formatDate from '@/utils/formatDate';
import { getMetroColor } from '@/utils/getColorMetro';

import { getOrderHeaderText } from './utils';

interface OrderDetailsProps {
  order: IOrder;
  incomePerHour?: number;
}

const OrderPreview: FC<OrderDetailsProps> = memo(({ order, incomePerHour }) => {
  const { id, date, parcelType, weight, price, addresses } = order;

  const { colors } = useTheme();
  const createdAtString = formatDate(date);

  const navigateToOrder = useCallback(() => {
    router.push(`/orders/${id}`);
  }, [id]);

  return (
    <Animated.View
      entering={FadeInLeft.duration(500)}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={navigateToOrder}>
        <View style={styles.innerContainer}>
          <ThemedText weight='bold' type='heading'>
            {getOrderHeaderText(order.addresses.length, id, incomePerHour)}
          </ThemedText>
          <View style={styles.addresses}>
            {addresses.map((address, index) => {
              const metroString = address.geoData?.metro?.[0]?.name
                ? address.geoData?.metro?.[0]?.name + ' |'
                : '';
              const distance = address.distance?.toFixed(1) || '';

              return (
                <View key={address.id} style={styles.address}>
                  <View style={styles.addressIndexContainer}>
                    <ThemedText weight='medium' type='title'>
                      {index + 1}
                    </ThemedText>
                  </View>
                  <View style={styles.addressTextContainer}>
                    <ThemedText type='mediumText' weight='medium' style={{ textAlign: 'left' }}>
                      {address.address}
                    </ThemedText>

                    <View
                      style={[
                        styles.locationInfo,

                        address.geoData?.metro && {
                          backgroundColor: getMetroColor(address.geoData.metro[0].line),
                        },
                      ]}
                    >
                      <ThemedText
                        style={{ color: colors.textOnPrimary }}
                      >{`${metroString} ${distance} км от вас`}</ThemedText>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.footer}>
            <View style={styles.info}>
              <ThemedText weight='semiBold' type='mediumText'>
                {`${parcelType} · ${weight}`}
              </ThemedText>
              <View style={styles.price}>
                <ThemedText
                  style={{ color: colors.textOnPrimary }}
                  type='mediumText'
                  weight='medium'
                >{`${price} ₽`}</ThemedText>
              </View>
            </View>
            <View style={styles.meta}>
              <ThemedText color='secondary' type='hint'>
                {`Заказ создан ${createdAtString}`}
              </ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// Экспортируем уже обернутый компонент
export default OrderPreview;

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadiuses.medium,
    paddingHorizontal: paddings.medium,
    paddingVertical: paddings.medium,
  },
  innerContainer: {
    width: '100%',
    gap: gaps.medium,
    justifyContent: 'center',
  },

  addresses: {
    gap: 5,
  },
  address: {
    flexDirection: 'row',
    gap: 10,
  },
  addressTextContainer: {
    flex: 1,
    gap: 5,
  },
  addressIndexContainer: {
    width: 30,
  },
  locationInfo: {
    alignSelf: 'flex-start',
    gap: 5,
    backgroundColor: colors.purple,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  footer: {
    width: '100%',
    gap: 5,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    backgroundColor: colors.purple,
    borderRadius: 20,
    padding: 2,
    paddingHorizontal: 10,
  },
  meta: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
