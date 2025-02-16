import { IAddress, IGeoData } from "@/types/order.interface";
import geodataService from "../geodata/geodata.service";

type Route = IPoint[];
class RouteService {
  initialAddresses: IAddress[];
  getRoute(addresses: IAddress[]) {
    let initialTemperature = 1000;
    let endTemperature = 0.1;
    this.initialAddresses = addresses;
    let state = this.initialRoute(addresses);
    let currentDistance = this.calculateEnergy(state);
    let T = initialTemperature;

    for (let i = 0; i < 10000; i++) {
      let stateCandidate = this.generateStateCandidate(state);
      let candidateEnergy = this.calculateEnergy(stateCandidate);

      if (
        candidateEnergy < currentDistance ||
        this.makeTransit(
          this.getTransitionProbability(candidateEnergy - currentDistance, T)
        )
      ) {
        currentDistance = candidateEnergy;
        state = stateCandidate;
      }

      if (i % 10 === 0) {
        console.log(i, currentDistance, T);
      }

      T = this.decreaseTemperature(initialTemperature, i);
      if (T <= endTemperature) break;
    }
    return { route: this.restoreRoute(state), distance: currentDistance };
  }

  initialRoute(addresses: IAddress[]) {
    let pickups = addresses.filter((p) => p.type === "PICKUP");
    let deliveries = addresses.filter((p) => p.type === "DELIVER");
    const route = [...pickups, ...deliveries].map(
      (address) => new IPoint(address)
    );
    return route;
  }

  calculateEnergy(route: Route) {
    let energy = 0;
    for (let i = 0; i < route.length - 1; i++) {
      energy += geodataService.calculateDistance(
        +route[i].geoLat,
        +route[i].geoLon,
        +route[i + 1].geoLat,
        +route[i + 1].geoLon
      );
    }
    return energy;
  }

  generateStateCandidate(route) {
    let newState = [...route];

    // Группируем точки по заказам
    let orders = new Map();
    newState.forEach((point) => {
      if (!orders.has(point.orderId)) {
        orders.set(point.orderId, []);
      }
      orders.get(point.orderId).push(point);
    });

    // Преобразуем карту в массив заказов
    let orderEntries = [...orders.values()];

    // Перемешиваем заказы случайным образом
    for (let i = orderEntries.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [orderEntries[i], orderEntries[j]] = [orderEntries[j], orderEntries[i]];
    }

    // Восстанавливаем новый маршрут, следя за порядком
    newState = orderEntries.flatMap((addresses) =>
      addresses.sort((a, b) => (a.type === "PICKUP" ? -1 : 1))
    );

    return newState;
  }

  getTransitionProbability(deltaE, T) {
    return Math.exp(-deltaE / T);
  }

  makeTransit(probability: number) {
    return Math.random() < probability;
  }

  decreaseTemperature(initialTemperature: number, iteration: number) {
    return initialTemperature / (1 + iteration);
  }

  restoreRoute(route: Route) {
    const addresses = route.map((routeAddress) => {
      return this.initialAddresses.find(
        (address) => address.id === routeAddress.id
      );
    });
    return addresses;
  }
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
