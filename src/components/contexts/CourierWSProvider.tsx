import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';

import { IOrderOfferPayload, IRoutePoint } from '@/domain/orders/types';
import { authStorage } from '@/helpers/authStorage';
import { useTypedDispatch, useTypedSelector } from '@/hooks/redux.hooks';
import { courierRoutesService } from '@/services/courier/courier-routes.service';
import { courierWsService } from '@/services/courier/courier-ws.service';
import { clearOrderOffer, setOrderOffer } from '@/store/orderOffer/orderOffer.slice';
import { showToast } from '@/store/toast/toast.slice';

const ROUTE_PUSH_INTERVAL_MS = 3 * 60 * 1000;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const CourierWSProvider = () => {
  const dispatch = useTypedDispatch();
  const isAuth = useTypedSelector(state => state.auth.isAuth);
  const isAcceptingOrders = useTypedSelector(state => state.orderOffer.isAcceptingOrders);
  const location = useTypedSelector(state => state.location);
  const { route, distance } = useTypedSelector(state => state.route);

  const locationRef = useRef(location);
  const routeRef = useRef(route);
  const distanceRef = useRef(distance);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    routeRef.current = route;
    distanceRef.current = distance;
  }, [route, distance]);

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      if (existingStatus !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    if (!isAuth || !isAcceptingOrders) {
      courierWsService.disconnect();
      return;
    }

    const handleOffer = async (payload: IOrderOfferPayload) => {
      dispatch(setOrderOffer(payload));
      dispatch(showToast({ message: 'Мы подобрали для вас выгодный заказ ✨', type: 'info' }));

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Новый заказ!',
          body: `${payload.order.parcelType} · ${payload.order.price} ₽ · ${payload.order.addresses.length} адреса`,
          sound: true,
        },
        trigger: null,
      });

      router.push({ pathname: '/orders/[id]', params: { id: payload.order.id } });
    };

    const handleOfferCancelled = () => {
      dispatch(clearOrderOffer());
    };

    const connectWs = async () => {
      const token = await authStorage.getAccessToken();
      if (!token) {
        return;
      }
      courierWsService.connect(token);
      courierWsService.onOrderOffer(handleOffer);
      courierWsService.onOrderOfferCancelled(handleOfferCancelled);
    };

    connectWs();

    return () => {
      courierWsService.offOrderOffer(handleOffer);
      courierWsService.offOrderOfferCancelled(handleOfferCancelled);
    };
  }, [isAuth, isAcceptingOrders, dispatch]);

  useEffect(() => {
    if (!isAuth || !isAcceptingOrders) return;

    const pushRoute = async () => {
      const loc = locationRef.current;
      if (!loc?.lat || !loc?.lon) return;

      const routePoints: IRoutePoint[] = routeRef.current.map(address => ({
        id: address.id,
        orderId: address.orderId,
        address: address.address,
        isCompleted: address.isCompleted ?? false,
        geoData: {
          lat: address.geoData?.geoLat ?? '0',
          lon: address.geoData?.geoLon ?? '0',
        },
      }));

      try {
        await courierRoutesService.updateState({
          currentLocation: { lat: loc.lat, lon: loc.lon },
          route: routePoints,
          totalDistance: distanceRef.current,
          isOnline: true,
        });
      } catch (err) {}
    };

    pushRoute();
    const interval = setInterval(pushRoute, ROUTE_PUSH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isAuth, isAcceptingOrders]);

  useEffect(() => {
    if (isAuth === false || (isAuth && !isAcceptingOrders)) {
      courierRoutesService.deleteState().catch(() => {});
      courierWsService.disconnect();
    }
  }, [isAuth, isAcceptingOrders]);

  return null;
};
