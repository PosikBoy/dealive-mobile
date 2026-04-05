import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button/Button';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { icons } from '@/constants/icons';
import { IAddress, IOrderAction, IOrderOfferPayload } from '@/domain/orders/types';
import { useTheme } from '@/hooks/useTheme';

import { TEXTS } from '../constants/texts';
import { OfferTimer } from './OfferTimer';

interface IProps {
  price: number;
  weight: string;
  parcelType: string;

  isOfferOrder: boolean;
  activeOffer: IOrderOfferPayload | null;
  onOfferExpire: () => void;
  onDecline: () => void;
  onTakeOrder: () => void;
  isDeclining: boolean;

  showTakeOrderButton: boolean;

  showCompleteActionButton: boolean;
  lastAction: IOrderAction | undefined;
  lastAddress: IAddress | undefined;
  onCompleteAction: () => void;
  onOpenMaps: () => void;
  onCallPhone: () => void;
}

export const OrderFooter: FC<IProps> = ({
  price,
  weight,
  parcelType,
  isOfferOrder,
  activeOffer,
  onOfferExpire,
  onDecline,
  onTakeOrder,
  isDeclining,
  showTakeOrderButton,
  showCompleteActionButton,
  lastAction,
  lastAddress,
  onCompleteAction,
  onOpenMaps,
  onCallPhone,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.footer, { backgroundColor: colors.background }]}>
      {isOfferOrder && activeOffer && (
        <OfferTimer initialSeconds={activeOffer.timeoutSeconds} onExpire={onOfferExpire} />
      )}

      <ThemedText style={styles.footerInfo}>
        {TEXTS.orderInfo(price, weight, parcelType)}
      </ThemedText>

      <View style={styles.buttonsContainer}>
        {isOfferOrder && (
          <>
            <View style={styles.actionButton}>
              <Button
                buttonText='Отказаться'
                variant='outlined'
                onPress={onDecline}
                disabled={isDeclining}
              />
            </View>
            <View style={styles.actionButton}>
              <Button buttonText={TEXTS.buttons.takeOrder} onPress={onTakeOrder} />
            </View>
          </>
        )}

        {showTakeOrderButton && (
          <Button buttonText={TEXTS.buttons.takeOrder} onPress={onTakeOrder} />
        )}

        {showCompleteActionButton && lastAction && (
          <>
            <View style={styles.actionButton}>
              <Button
                buttonText={TEXTS.actionSnippets[lastAction.actionType]}
                onPress={onCompleteAction}
              />
            </View>

            {lastAddress?.geoData && (
              <Button
                leftIcon={<Image style={styles.iconFull} source={icons.location} />}
                variant='outlined'
                iconOnly
                onPress={onOpenMaps}
              />
            )}

            {lastAddress?.phoneNumber && (
              <Button
                leftIcon={<Image style={styles.icon} source={icons.phone} />}
                variant='outlined'
                iconOnly
                onPress={onCallPhone}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '100%',
    gap: 10,
  },
  footerInfo: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
  },
  iconFull: {
    width: '100%',
    height: 20,
  },
});
