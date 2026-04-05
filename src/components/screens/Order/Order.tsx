import { router } from 'expo-router';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';

import { Header } from '@/components/shared/Header/Header';
import { Toggler } from '@/components/ui/HorizontalToggler/HorizontalToggler';
import { orderStatuses } from '@/constants/orderStatuses';
import { IOrder } from '@/domain/orders/types';
import { useTypedDispatch, useTypedSelector } from '@/hooks/redux.hooks';
import { useTheme } from '@/hooks/useTheme';
import { routeService } from '@/services/route/route.service';
import { clearOrderOffer } from '@/store/orderOffer/orderOffer.slice';

import { Actions } from './components/Actions';
import { Addresses } from './components/Addresses';
import { OrderFooter } from './components/OrderFooter';
import { Route } from './components/Route';
import { TEXTS } from './constants/texts';
import { useOrderActions } from './hooks/useOrderActions';
import { useTabAnimation } from './hooks/useTabAnimation';

interface IProps {
  order: IOrder;
}

const Order: FC<IProps> = ({ order }) => {
  const { colors } = useTheme();
  const dispatch = useTypedDispatch();

  const [activeTab, setActiveTab] = useState<string>(TEXTS.tabs.addresses);
  const routeState = useTypedSelector(state => state.route);
  const activeOffer = useTypedSelector(state => state.orderOffer.offer);

  const isOfferOrder =
    order?.statusId === orderStatuses.offeringCourier && activeOffer?.order.id === order?.id;

  const showTakeOrderButton = order?.statusId === orderStatuses.searchCourier;
  const showCompleteActionButton = order?.statusId === orderStatuses.courierInTransit;

  const handleOfferExpire = useCallback(() => {
    dispatch(clearOrderOffer());
    SheetManager.show('offer-expired-sheet');
    router.back();
  }, [dispatch]);

  const tabs = useMemo(() => {
    if (order?.statusId == orderStatuses.delivered) {
      return [TEXTS.tabs.addresses, TEXTS.tabs.actions];
    }

    return [TEXTS.tabs.addresses, TEXTS.tabs.actions, TEXTS.tabs.route];
  }, [order?.statusId]);

  const route = useMemo(() => {
    if (
      order?.statusId === orderStatuses.searchCourier ||
      order?.statusId === orderStatuses.offeringCourier
    ) {
      return routeService.getRouteWithNewOrder(routeState.route, order);
    }

    return routeState;
  }, [order, routeState]);

  const lastAction = order?.actions?.find(action => !action.isCompleted);
  const lastAddress = order?.addresses?.find(address => address.id === lastAction?.addressId);

  const {
    isDeclining,
    takeOrderModalShow,
    completeActionModalShow,
    openMaps,
    callPhone,
    declineOrderHandler,
    handleBackPress,
  } = useOrderActions(order, isOfferOrder);

  const {
    availableTranslate,
    activeTranslate,
    routeTranslate,
    availableOpacity,
    activeOpacity,
    routeOpacity,
  } = useTabAnimation(activeTab, tabs);

  if (!order) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <Header title={TEXTS.header(order?.id)} style={styles.header} onPressBack={handleBackPress} />
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

      <OrderFooter
        price={order.price}
        weight={order.weight}
        parcelType={order.parcelType}
        isOfferOrder={isOfferOrder}
        activeOffer={activeOffer}
        onOfferExpire={handleOfferExpire}
        onDecline={declineOrderHandler}
        onTakeOrder={takeOrderModalShow}
        isDeclining={isDeclining}
        showTakeOrderButton={showTakeOrderButton}
        showCompleteActionButton={showCompleteActionButton}
        lastAction={lastAction}
        lastAddress={lastAddress}
        onCompleteAction={completeActionModalShow}
        onOpenMaps={openMaps}
        onCallPhone={callPhone}
      />
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
  tabContent: {
    paddingHorizontal: 5,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
});
