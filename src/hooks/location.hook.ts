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

    const getLocation = async () => {
      try {
        setIsLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Необходим доступ к местоположению");
          return;
        }

        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation({ lon: coords.longitude, lat: coords.latitude });
        setIsLoading(false);
      } catch (error) {
        setError("Ошибка в запросе доступа к местоположению");
      } finally {
        setIsLoading(false);
      }
    };

    getLocation();

    interval = setInterval(getLocation, 15000);

    return () => clearInterval(interval);
  }, []);

  return { location, isLoading, error };
};
