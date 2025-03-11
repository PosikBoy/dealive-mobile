import { IAddress, IGeoData, IOrder } from "@/types/order.interface";
import geodataService from "../geodata/geodata.service";
import { current } from "@reduxjs/toolkit";

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
    if (!route)
      return {
        distance: this.calculateRouteDistance(newOrder.addresses),
        route: newOrder.addresses,
      };

    //если статсу заказа - в доставке, то возвращаем просто расстояние внутри маршрута, так как заказ там уже есть
    if (newOrder?.statusId == 4) {
      return {
        distance: this.calculateRouteDistance(route),
        route: route,
      };
    }

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

    const insertions = this.generateInsertions(route, newOrder.addresses);

    let filteredInsertions = insertions;

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
        +route[i].geoData.geoLat,
        +route[i].geoData.geoLon,
        +route[i + 1].geoData.geoLat,
        +route[i + 1].geoData.geoLon
      );
    }

    return distance;
  };
}

const routeService = new RouteService();

export default routeService;
