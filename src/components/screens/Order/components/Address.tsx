import React, { FC, useCallback, useMemo } from 'react';
import { Image, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import Hyperlink from 'react-native-hyperlink';

import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { icons } from '@/constants/icons';
import { IAddress } from '@/domain/orders/types';
import { useTheme } from '@/hooks/useTheme';
import copyToClipboard from '@/utils/copyToClipBoard';
import { getMetroColor } from '@/utils/getColorMetro';
import { yandexMaps } from '@/utils/yandexMaps';

interface AddressProps {
  address: IAddress;
  index: number;
  price?: number;
  isActive?: boolean;
  isTypeShown?: boolean;
}

const ADDRESS_TYPE_LABELS = {
  DELIVER: 'Отдать заказ',
  PICKUP: 'Забрать заказ',
} as const;

const Address: FC<AddressProps> = ({
  address,
  index,
  price,
  isActive = false,
  isTypeShown = false,
}) => {
  const { colors } = useTheme();

  const handleOpenMap = useCallback(async () => {
    try {
      yandexMaps.getRouteToPoint(address.geoData.geoLat, address.geoData.geoLon);
    } catch (err) {
      console.error('Ошибка при открытии карты:', err);
    }
  }, [address.geoData]);

  const handleCopyAddress = useCallback(() => {
    copyToClipboard(address.address);
  }, [address.address]);

  const handleCall = useCallback(() => {
    if (address.phoneNumber) {
      Linking.openURL(`tel:${address.phoneNumber}`);
    }
  }, [address.phoneNumber]);

  const handleCopyPhone = useCallback(() => {
    if (address.phoneNumber) {
      copyToClipboard(address.phoneNumber);
    }
  }, [address.phoneNumber]);

  const handleOpenLink = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  // Computed values
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
  }, [address.geoData?.metro, colors.purple]);

  const phoneDisplayText = useMemo(() => {
    return `${address.phoneNumber || ''} ${address.phoneName || ''}`.trim();
  }, [address.phoneNumber, address.phoneName]);

  const addressTypeLabel = useMemo(() => {
    return address.type ? ADDRESS_TYPE_LABELS[address.type] : '';
  }, [address.type]);

  const isFirstAddress = index === 0;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }, isActive && styles.active]}
    >
      {/* Active Address Badge */}
      {isActive && (
        <View style={[styles.activeAddressBadge, { backgroundColor: colors.green }]}>
          <ThemedText>Активный адрес</ThemedText>
        </View>
      )}

      {/* Address Type Badge */}
      {address.type && isTypeShown && (
        <View style={[styles.typeBadge, { backgroundColor: colors.green }]}>
          <Image tintColor={colors.tint} source={icons.settings} style={styles.badgeIcon} />
          <ThemedText type='mediumText' weight='medium'>
            {addressTypeLabel}
          </ThemedText>
        </View>
      )}

      {/* Main Address */}
      <TouchableOpacity onPress={handleOpenMap} onLongPress={handleCopyAddress}>
        <View style={styles.addressRow}>
          <ThemedText type='title'>{index + 1}</ThemedText>
          <ThemedText type='mediumText' weight='bold' style={styles.addressText}>
            {address.address}
          </ThemedText>
        </View>
      </TouchableOpacity>

      {/* Phone Number */}
      {address.phoneNumber && (
        <TouchableOpacity
          onPress={handleCall}
          onLongPress={handleCopyPhone}
          style={[styles.phoneContainer, { backgroundColor: colors.lightPurple }]}
        >
          <ThemedText type='hint' color='primary' align='left'>
            Номер телефона
          </ThemedText>
          <ThemedText type='mediumText' weight='bold' align='left'>
            {phoneDisplayText}
          </ThemedText>
        </TouchableOpacity>
      )}

      {/* Metro & Distance Info */}
      <View style={[styles.locationBadge, { backgroundColor: metroBackgroundColor }]}>
        <ThemedText color='onPrimary'>{`${metroInfo} ${distanceText}`}</ThemedText>
      </View>

      {/* Additional Info */}
      {address.info && (
        <View>
          <ThemedText type='hint' align='left'>
            Дополнительно
          </ThemedText>
          <Hyperlink onPress={handleOpenLink}>
            <ThemedText weight='medium' align='left'>
              {address.info}
            </ThemedText>
          </Hyperlink>
        </View>
      )}

      {/* Price (only for first address) */}
      {isFirstAddress && price && (
        <View style={styles.infoRow}>
          <Image tintColor={colors.tint} source={icons.money} style={styles.icon} />
          <ThemedText type='mediumText' weight='medium'>
            {`Получить ${price} ₽`}
          </ThemedText>
        </View>
      )}

      {/* Floor & Apartment */}
      {address.floor && (
        <View style={styles.infoRow}>
          <Image tintColor={colors.black} source={icons.building} style={styles.icon} />
          <ThemedText type='mediumText' weight='medium'>
            {`${address.floor} этаж · ${address.apartment} кв.`}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

export default Address;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    gap: 10,
  },
  active: {
    paddingTop: 30,
  },
  activeAddressBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  typeBadge: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  badgeIcon: {
    width: 20,
    height: 20,
  },
  addressRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingRight: 10,
  },
  addressText: {
    textAlign: 'left',
    flex: 1,
  },
  phoneContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  locationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
});
