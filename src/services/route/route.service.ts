import { IAddress, IGeoData, IOrder } from "@/types/order.interface";
import geodataService from "../geodata/geodata.service";

type Route = IPoint[];
class RouteService {
  initialAddresses: IAddress[];

  // Генерирует все возможные способы вставить массив `newAddresses` в `route`, сохраняя их порядок
  generateInsertions = (
    route: IAddress[],
    newAddresses: IAddress[]
  ): IAddress[][] => {
    const results: IAddress[][] = [];

    // Рекурсивная функция для генерации всех вариантов вставки
    const insertRecursively = (
      currentRoute: IAddress[],
      remaining: IAddress[],
      index: number
    ) => {
      if (remaining.length === 0) {
        results.push(currentRoute);
        return;
      }

      for (let i = index; i <= currentRoute.length; i++) {
        const newRoute = [
          ...currentRoute.slice(0, i),
          remaining[0],
          ...currentRoute.slice(i),
        ];
        insertRecursively(newRoute, remaining.slice(1), i + 1);
      }
    };

    insertRecursively(route, newAddresses, 0);
    return results;
  };

  getRouteWithNewOrder = (route: IAddress[], newOrder: IOrder) => {
    if (!route)
      return {
        distance: this.calculateRouteDistance(newOrder.addresses),
        route: newOrder.addresses,
      };

    const insertions = this.generateInsertions(route, newOrder.addresses);
    let bestRoute = insertions[0];
    let minDistance = Infinity;

    for (const option of insertions) {
      const totalDistance = this.calculateRouteDistance(option);

      if (totalDistance < minDistance) {
        minDistance = totalDistance;
        bestRoute = option;
      }
    }

    return { route: bestRoute, distance: minDistance };
  };

  calculateRouteDistance = (route: IAddress[]) => {
    let distance = 0;

    for (let i = 0; i < route.length - 1; i++) {
      distance += geodataService.calculateDistance(
        +route[i].geoData.geoLat,
        +route[i].geoData.geoLon,
        +route[i + 1].geoData.geoLat,
        +route[i + 1].geoData.geoLon
      );
    }

    return distance;
  };
}

class IPoint {
  id: number;
  orderId: number;
  geoLat: number;
  geoLon: number;
  type: "PICKUP" | "DELIVER";

  constructor(address: IAddress) {
    this.id = address.id;
    this.orderId = address.orderId;
    this.geoLat = +address.geoData.geoLat;
    this.geoLon = +address.geoData.geoLon;
    this.type = address.type;
  }
}
const routeService = new RouteService();

export default routeService;
