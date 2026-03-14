import { router } from 'expo-router';
import { FC, memo, useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';

import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { colors } from '@/constants/colors';
import { borderRadiuses, gaps, paddings } from '@/constants/styles';
import { IAddress, IOrder } from '@/domain/orders/types';
import { useTheme } from '@/hooks/useTheme';
import formatDate from '@/utils/formatDate';
import { getMetroColor } from '@/utils/getColorMetro';

import { getOrderHeaderText } from './utils';

interface OrderPreviewProps {
  order: IOrder;
  incomePerHour?: number;
}

interface AddressItemProps {
  address: IAddress;
  index: number;
  textOnPrimaryColor: string;
}

const ANIMATION_DURATION = 500;

// Вынесен в отдельный компонент для оптимизации
const AddressItem: FC<AddressItemProps> = memo(({ address, index, textOnPrimaryColor }) => {
  const metroInfo = useMemo(() => {
    const metroName = address.geoData?.metro?.[0]?.name;
    return metroName ? `${metroName} |` : '';
  }, [address.geoData?.metro]);

  const distanceText = useMemo(() => {
    return address.distance ? `${address.distance.toFixed(1)} км от вас` : '';
  }, [address.distance]);

  const metroBackgroundColor = useMemo(() => {
    return address.geoData?.metro?.[0]
      ? getMetroColor(address.geoData.metro[0].line)
      : colors.purple;
  }, [address.geoData?.metro]);

  return (
    <View style={styles.address}>
      <View style={styles.addressIndexContainer}>
        <ThemedText weight='medium' type='title'>
          {index + 1}
        </ThemedText>
      </View>
      <View style={styles.addressTextContainer}>
        <ThemedText type='mediumText' weight='medium' style={styles.addressText}>
          {address.address}
        </ThemedText>
        <View style={[styles.locationBadge, { backgroundColor: metroBackgroundColor }]}>
          <ThemedText style={{ color: textOnPrimaryColor }}>
            {`${metroInfo} ${distanceText}`}
          </ThemedText>
        </View>
      </View>
    </View>
  );
});

AddressItem.displayName = 'AddressItem';

const OrderPreview: FC<OrderPreviewProps> = memo(({ order, incomePerHour }) => {
  const { id, date, parcelType, weight, price, addresses } = order;
  const { colors } = useTheme();

  // Computed values
  const createdAtString = useMemo(() => formatDate(date), [date]);

  const headerText = useMemo(
    () => getOrderHeaderText(addresses.length, id, incomePerHour),
    [addresses.length, id, incomePerHour],
  );

  const orderInfo = useMemo(() => `${parcelType} · ${weight}`, [parcelType, weight]);

  const priceText = useMemo(() => `${price} ₽`, [price]);

  const createdAtText = useMemo(() => `Заказ создан ${createdAtString}`, [createdAtString]);

  // Handlers
  const navigateToOrder = useCallback(() => {
    router.push(`/orders/${id}`);
  }, [id]);

  return (
    <Animated.View
      entering={FadeInLeft.duration(ANIMATION_DURATION)}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={navigateToOrder}>
        <View style={styles.innerContainer}>
          {/* Header */}
          <ThemedText weight='bold' type='heading'>
            {headerText}
          </ThemedText>

          {/* Addresses List */}
          <View style={styles.addressesList}>
            {addresses.map((address, index) => (
              <AddressItem
                key={address.id}
                address={address}
                index={index}
                textOnPrimaryColor={colors.textOnPrimary}
              />
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.infoRow}>
              <ThemedText weight='semiBold' type='mediumText'>
                {orderInfo}
              </ThemedText>
              <View style={[styles.priceBadge, { backgroundColor: colors.purple }]}>
                <ThemedText
                  style={{ color: colors.textOnPrimary }}
                  type='mediumText'
                  weight='medium'
                >
                  {priceText}
                </ThemedText>
              </View>
            </View>
            <View style={styles.metaRow}>
              <ThemedText color='secondary' type='hint'>
                {createdAtText}
              </ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

OrderPreview.displayName = 'OrderPreview';

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
  addressesList: {
    gap: 5,
  },
  address: {
    flexDirection: 'row',
    gap: 10,
  },
  addressIndexContainer: {
    width: 30,
  },
  addressTextContainer: {
    flex: 1,
    gap: 5,
  },
  addressText: {
    textAlign: 'left',
  },
  locationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  footer: {
    width: '100%',
    gap: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceBadge: {
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  metaRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
