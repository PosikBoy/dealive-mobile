import { Linking } from "react-native";
import { IAddress } from "@/types/order.interface";

interface IPoint {
  lat: string;
  lon: string;
}

class YandexMaps {
  private async openURL(primaryUrl: string, fallbackUrl: string) {
    try {
      const supported = await Linking.canOpenURL(primaryUrl);
      console.log(supported);
      await Linking.openURL(supported ? primaryUrl : fallbackUrl);
    } catch (err) {
      console.error("Ошибка открытия URL:", err);
    }
  }

  getRouteToPoint(lat: string, lon: string) {
    const url = `yandexmaps://maps.yandex.ru/?rtext=~${lat},${lon}&rtt=mt`;
    const fallback = `https://maps.yandex.ru/?rtext=~${lat},${lon}&rtt=mt`;
    this.openURL(url, fallback);
  }

  getRoute(points: IPoint[]) {
    const pointsStr = points.map((p) => `${p.lat},${p.lon}`).join("~");
    const url = `yandexmaps://maps.yandex.ru/?rtext=${pointsStr}&rtt=mt`;
    const fallback = `https://maps.yandex.ru/?rtext=${pointsStr}&rtt=mt`;
    this.openURL(url, fallback);
  }

  getPoint(address: IAddress) {
    return {
      lat: address.geoData.geoLat,
      lon: address.geoData.geoLon,
    };
  }
}

const yandexMaps = new YandexMaps();
export default yandexMaps;
