import * as Location from 'expo-location';
import { useEffect, useRef } from 'react';

import { useTypedDispatch } from '@/hooks/redux.hooks';
import { pushError, pushLocation } from '@/store/location/location.slice';
import { calculateDistance } from '@/utils/calculateDistance';

const LOCATION_INTERVAL_MS = 5000;
const MIN_DISTANCE_METERS = 50;
const MIN_DISTANCE_KILOMETERS = MIN_DISTANCE_METERS / 1000;

interface ILocation {
  lon: number;
  lat: number;
}

export const useLocation = () => {
  const dispatch = useTypedDispatch();
  const prevLocationRef = useRef<ILocation | null>(null);
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const requestLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== 'granted') {
      const res = await Location.requestForegroundPermissionsAsync();

      if (res.status !== 'granted') {
        dispatch(pushError('Не удалось получить разрешение на местоположение.'));
      }
    }
  };

  const initLocation = async () => {
    locationSubscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: MIN_DISTANCE_METERS,
        timeInterval: LOCATION_INTERVAL_MS,
      },
      data => {
        if (data?.mocked) {
          dispatch(pushError('Фиктивная геолокация не поддерживается.'));
          return;
        }

        const newLocation: ILocation = {
          lon: data.coords.longitude,
          lat: data.coords.latitude,
        };

        const prev = prevLocationRef.current;

        if (!prev) {
          prevLocationRef.current = newLocation;
          dispatch(pushLocation(newLocation));
          return;
        }

        const distance = calculateDistance(prev.lat, prev.lon, newLocation.lat, newLocation.lon);

        if (distance > MIN_DISTANCE_KILOMETERS) {
          prevLocationRef.current = newLocation;
          dispatch(pushLocation(newLocation));
        }
      },
    );
  };

  useEffect(() => {
    requestLocationPermission();
    initLocation();

    return () => {
      locationSubscriptionRef.current?.remove();
    };
  }, []);
};
