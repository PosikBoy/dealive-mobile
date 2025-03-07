import { useEffect, useState } from "react";
import * as Location from "expo-location";
import geodataService from "@/services/geodata/geodata.service";

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
        if (status !== "granted") {
          throw new Error(
            "Для доступа к заказам необходимо выдать разрешение на доступ к местоположению устройства."
          );
        }
        return true;
      } catch (error: any) {
        setError(error.message);
        return false;
      }
    };

    const getLocation = async () => {
      setIsLoading(true); // Начинаем загрузку

      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest,
        });

        // if (data?.mocked) {
        //   setError("Приложение не поддерживает фиктивное местоположение.");
        //   return;
        // }

        const newLocation = {
          lon: data.coords.longitude,
          lat: data.coords.latitude,
        };

        if (location) {
          // Вычисляем расстояние между текущей и новой локацией
          const distance = geodataService.calculateDistance(
            location.lat,
            location.lon,
            newLocation.lat,
            newLocation.lon
          );
          // Обновляем локацию только если она изменилась на 50 метров или больше
          if (distance > 0.05) {
            setLocation(newLocation);
            setError(null);
          }
        } else {
          // Если локации ещё нет, просто сохраняем её
          setLocation(newLocation);
          setError(null);
        }
      } catch (err: any) {
        setError(
          "Не удалось получить местоположение. Убедитесь, что на вашем устройстве включена геолокация."
        );
      } finally {
        setIsLoading(false); // Завершаем загрузку
      }
    };

    getLocation();

    interval = setInterval(getLocation, 60000);

    return () => clearInterval(interval);
  }, [location]);

  return { location, isLoading, error };
};
