import { useEffect, useState } from "react";
import * as Location from "expo-location";

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

        if (data?.mocked) {
          setError("Приложение не поддерживает фиктивное местоположение.");
          return;
        }

        setLocation({
          lon: data.coords.longitude,
          lat: data.coords.latitude,
        });
        setError(null);
      } catch (err: any) {
        setError(
          "Не удалось получить местоположение. Убедитесь, что на вашем устройстве включена геолокация."
        );
      } finally {
        setIsLoading(false); // Завершаем загрузку
      }
    };

    getLocation(); // Получаем местоположение один раз

    interval = setInterval(getLocation, 5000); // Каждые 15 секунд обновляем местоположение

    return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
  }, []); // Эффект срабатывает только один раз при монтировании

  return { location, isLoading, error };
};
