import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Linking, Platform, StyleSheet, ToastAndroid, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import { ApiError } from '@/axios/api-error';
import { Header } from '@/components/shared/Header/Header';
import { Button } from '@/components/ui/Button/Button';
import { Toggler } from '@/components/ui/HorizontalToggler/HorizontalToggler';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { icons } from '@/constants/icons';
import { orderStatuses } from '@/constants/orderStatuses';
import { fonts } from '@/constants/styles';
import { useTakeOrderMutation } from '@/domain/orders/api';
import { IAddress, IOrder } from '@/domain/orders/types';
import { useTypedSelector } from '@/hooks/redux.hooks';
import { useTheme } from '@/hooks/useTheme';
import { routeService } from '@/services/route/route.service';
import { yandexMaps } from '@/utils/yandexMaps';

import Actions from './components/Actions';
import Addresses from './components/Addresses';
import Route from './components/Route';
import { TEXTS } from './constants/texts';

interface IProps {
  order: IOrder;
}

interface IRouteState {
  distance: number;
  route: IAddress[];
}

const ANIMATION_OFFSET = 20;

const Order: FC<IProps> = ({ order }) => {
  const { colors } = useTheme();

  const [activeTab, setActiveTab] = useState<string>(TEXTS.tabs.addresses);
  const [takeOrder, { error }] = useTakeOrderMutation();
  const routeState = useTypedSelector(state => state.route);

  const showTakeOrderButton = order?.statusId === orderStatuses.searchCourier;
  const showCompleteActionButton = order?.statusId === orderStatuses.courierInTransit;

  const tabs = useMemo(() => {
    if (order?.statusId == orderStatuses.delivered) {
      return [TEXTS.tabs.addresses, TEXTS.tabs.actions];
    }

    return [TEXTS.tabs.addresses, TEXTS.tabs.actions, TEXTS.tabs.route];
  }, [order?.statusId]);

  const route = useMemo(() => {
    if (order?.statusId === orderStatuses.searchCourier) {
      const route = routeService.getRouteWithNewOrder(routeState.route, order);
      return route;
    }

    return routeState;
  }, [order, routeState]);

  const takeOrderHandler = async () => {
    try {
      await takeOrder({ orderId: order.id }).unwrap();
      SheetManager.hide('take-order-sheet');
    } catch (err) {
      const apiError = err as ApiError;
      if (Platform.OS === 'android') {
        ToastAndroid.show(apiError.message, ToastAndroid.SHORT);
      } else {
        console.error('Take order error:', apiError.message);
      }
    }
  };

  const takeOrderModalShow = () => {
    SheetManager.show('take-order-sheet', {
      payload: {
        order: order,
        error: error?.message,
        takeOrder: takeOrderHandler,
      },
    });
  };

  const lastAction = order?.actions?.find(action => !action.isCompleted);

  const lastAddress = order?.addresses?.find(address => address.id === lastAction?.addressId);

  const completeActionPayload = useMemo(
    () => ({
      address: lastAddress,
      action: lastAction,
    }),
    [lastAddress, lastAction],
  );

  const completeActionModalShow = useCallback(() => {
    SheetManager.show('complete-action-sheet', {
      payload: completeActionPayload,
    });
  }, [completeActionPayload]);

  const openMaps = async () => {
    if (!lastAddress?.geoData) {
      console.error('No address or geodata available');
      return;
    }

    try {
      yandexMaps.getRouteToPoint(lastAddress.geoData.geoLat, lastAddress.geoData.geoLon);
    } catch (err) {
      console.error('Ошибка при открытии URL:', err);
    }
  };

  const callPhone = () => {
    if (!lastAddress) {
      console.error('No address available');
      return;
    }

    const phoneNumber = 'phoneNumber' in lastAddress ? lastAddress.phoneNumber : '';
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  //Анимации

  const tabAnimation = useRef(new Animated.Value(tabs.indexOf(activeTab))).current;

  useEffect(() => {
    Animated.spring(tabAnimation, {
      toValue: tabs.indexOf(activeTab),
      useNativeDriver: true,
      bounciness: 5,
      speed: 12,
    }).start();
  }, [activeTab, tabs, tabAnimation]);

  const availableTranslate = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, -ANIMATION_OFFSET, -ANIMATION_OFFSET],
      }),
    [tabAnimation],
  );

  const activeTranslate = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [ANIMATION_OFFSET, 0, -ANIMATION_OFFSET],
      }),
    [tabAnimation],
  );

  const routeTranslate = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [ANIMATION_OFFSET, -ANIMATION_OFFSET, 0],
      }),
    [tabAnimation],
  );

  const availableOpacity = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [1, 0, 0],
      }),
    [tabAnimation],
  );

  const activeOpacity = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 1, 0],
      }),
    [tabAnimation],
  );

  const routeOpacity = useMemo(
    () =>
      tabAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 0, 1],
      }),
    [tabAnimation],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <Header title={TEXTS.header(order?.id)} style={styles.header} />
      <View style={styles.togglerContainer}>
        <Toggler options={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </View>

      <View style={styles.orderContainer}>
        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: availableOpacity,
              transform: [{ translateX: availableTranslate }],
              pointerEvents: activeTab === TEXTS.tabs.addresses ? 'auto' : 'none',
            },
          ]}
        >
          <Addresses order={order} activeAddressId={lastAction?.addressId} />
        </Animated.View>

        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: activeOpacity,
              transform: [{ translateX: activeTranslate }],
              pointerEvents: activeTab === TEXTS.tabs.actions ? 'auto' : 'none',
            },
          ]}
        >
          <Actions order={order} />
        </Animated.View>
        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: routeOpacity,
              transform: [{ translateX: routeTranslate }],
              pointerEvents: activeTab === TEXTS.tabs.route ? 'auto' : 'none',
            },
          ]}
        >
          <Route route={route.route} orderId={order?.id} />
        </Animated.View>
      </View>
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.footerInfo}>
          {TEXTS.orderInfo(order.price, order.weight, order.parcelType)}
        </ThemedText>
        <View style={styles.buttonsContainer}>
          {showTakeOrderButton && (
            <Button buttonText={TEXTS.buttons.takeOrder} onPress={takeOrderModalShow} />
          )}
          {showCompleteActionButton && (
            <>
              <View style={styles.actionButton}>
                <Button
                  buttonText={TEXTS.actionSnippets[lastAction.actionType]}
                  onPress={completeActionModalShow}
                />
              </View>

              {lastAddress?.geoData && (
                <Button
                  leftIcon={<Image style={styles.iconFull} source={icons.location} />}
                  variant='outlined'
                  iconOnly
                  onPress={openMaps}
                />
              )}
              {lastAddress?.phoneNumber && (
                <Button
                  leftIcon={<Image style={styles.icon} source={icons.phone} />}
                  variant='outlined'
                  iconOnly
                  onPress={callPhone}
                />
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBlockEnd: 10,
  },
  togglerContainer: {
    paddingHorizontal: 5,
  },
  orderContainer: {
    flex: 1,
  },
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
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
  tabContent: {
    paddingHorizontal: 5,

    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
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
