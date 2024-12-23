import instance from "@/axios/interceptor";
import { SERVER_URL } from "@/constants/urls";
import {
  IAddress,
  IAddressWithoutSensitiveInfo,
  IOrder,
  IOrderWithoutSensitiveInfo,
} from "@/types/order.interface";
import * as Location from "expo-location";

interface ILocation {
  lon: number;
  lat: number;
}

class GeodataService {
  enrichOrders(orders: IOrderWithoutSensitiveInfo[], location: ILocation) {
    const enrichedOrders = orders?.map((order) => {
      const enrichedAddresses = order?.addresses.map((address) => {
        const distance = this.calculateDistanceToAddress(location, address);
        return { ...address, distance };
      });

      return { ...order, addresses: enrichedAddresses };
    });
    return enrichedOrders;
  }

  enrichOrder(order: IOrder | IOrderWithoutSensitiveInfo, location: ILocation) {
    const enrichedAddresses = order?.addresses.map((address) => {
      const distance = this.calculateDistanceToAddress(location, address);
      return { ...address, distance };
    });
    return { ...order, addresses: enrichedAddresses };
  }
  calculateDistanceToAddress(
    location: ILocation,
    address: IAddress | IAddressWithoutSensitiveInfo
  ) {
    const { lon: lon1, lat: lat1 } = location;
    const lat2 = parseFloat(address.geoData?.geoLat || "0");
    const lon2 = parseFloat(address.geoData?.geoLon || "0");
    const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
    return distance;
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Радиус Земли в километрах
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // В километрах
    return distance;
  }
}

const geodataService = new GeodataService();
export default geodataService;
