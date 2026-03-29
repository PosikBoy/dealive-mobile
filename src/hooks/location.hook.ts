import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import { calculateDistance } from '@/domain/orders/utils/enrichOrdersWithGeo';

interface ILocation {
  lon: number;
  lat: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<ILocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const requestPermissions = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error(
            'Для доступа к заказам необходимо выдать разрешение на доступ к местоположению устройства.',
          );
        }
        return true;
      } catch (error: any) {
        setError(error.message);
        return false;
      }
    };

    const getLocation = async () => {
      setIsLoading(true);

      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest,
        });

        if (data?.mocked) {
          setError('Приложение не поддерживает фиктивное местоположение.');
          return;
        }

        const newLocation = {
          lon: data.coords.longitude,
          lat: data.coords.latitude,
        };

        setLocation(prevLocation => {
          if (prevLocation) {
            const distance = calculateDistance(
              prevLocation.lat,
              prevLocation.lon,
              newLocation.lat,
              newLocation.lon,
            );
            return distance > 0.05 ? newLocation : prevLocation;
          }
          return newLocation;
        });

        setError(null);
      } catch (err: any) {
        setError(
          'Не удалось получить местоположение. Убедитесь, что на вашем устройстве включена геолокация.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    getLocation();

    interval = setInterval(getLocation, 5000);

    return () => clearInterval(interval);
  }, []);

  return { location, isLoading, error };
};
