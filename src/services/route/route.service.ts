import { IAddress, IOrder } from "@/types/order.interface";
import geodataService from "../geodata/geodata.service";

interface IUserLocation {
  lat: number;
  lon: number;
}

class RouteService {
  initialAddresses: IAddress[];

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

  getRouteWithNewOrder = (
    route: IAddress[],
    newOrder: IOrder,
    currentUserLocation?: IUserLocation
  ) => {
    //Если нет маршрута, то считаем просто расстояние между точками, так как не надо встраивать в маршрут
    if (route.length === 0)
      return {
        distance: this.calculateRouteDistance(newOrder.addresses),
        route: newOrder.addresses,
      };

    if (currentUserLocation) {
      route.unshift({
        id: 0,
        orderId: 0,
        address: "Ваше местоположение",
        floor: "",
        apartment: "",
        info: "",
        geoData: {
          geoLat: currentUserLocation.lat.toString(),
          geoLon: currentUserLocation.lon.toString(),
          qcGeo: 0,
          address: "Ваше местоположение",
        },
      });
    }

    //Генерируется все варианты вставки новых адресов

    const insertions = this.generateInsertions(route, newOrder.addresses);

    let filteredInsertions = insertions;

    //Фильтруется только те, где местоположение самое первое
    if (currentUserLocation) {
      filteredInsertions = insertions.filter(
        (route) => route[0].address === "Ваше местоположение"
      );
    }

    let bestRoute = filteredInsertions[0];
    let minDistance = Infinity;

    for (const option of filteredInsertions) {
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
        +route[i].geoData?.geoLat || 0,
        +route[i].geoData?.geoLon || 0,
        +route[i + 1].geoData?.geoLat || 0,
        +route[i + 1].geoData?.geoLon || 0
      );
    }

    return distance;
  };

  restoreRoute = (orders: IOrder[], currentUserLocation?: IUserLocation) => {
    if (orders.length === 0)
      return {
        distance: 0,
        route: [],
      };

    const route = {
      distance: this.calculateRouteDistance(orders[0].addresses),
      route: orders[0].addresses,
    };

    const restoredRoute = orders.slice(1).reduce((acc, order) => {
      const newRoute = this.getRouteWithNewOrder(acc.route, order);
      return { distance: newRoute.distance, route: newRoute.route };
    }, route);

    const routeWithOnlyActiveOrders = restoredRoute.route.filter(
      (address) => address?.isCompleted === false
    );

    const newDistance = this.calculateRouteDistance(routeWithOnlyActiveOrders);

    return {
      distance: newDistance,
      route: routeWithOnlyActiveOrders,
    };
  };
}

const routeService = new RouteService();

export default routeService;
