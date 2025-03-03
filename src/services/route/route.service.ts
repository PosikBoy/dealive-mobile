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

    if (state.length == 2) {
      return { route: this.restoreRoute(state), distance: currentDistance };
    }

    let T = initialTemperature;

    for (let i = 0; i < Math.pow(addresses.length, 3) * 50; i++) {
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

  generateStateCandidate(route: Route) {
    let newState = [...route];

    let i, j;
    while (true) {
      i = Math.floor(Math.random() * route.length);
      j = Math.floor(Math.random() * route.length);
      if (i === j) continue;
      [newState[i], newState[j]] = [newState[j], newState[i]];

      const firstPoint = newState.find(
        (address) => address.orderId == newState[i].orderId
      );

      const secondPoint = newState.find(
        (address) => address.orderId == newState[j].orderId
      );

      if (firstPoint.type == "DELIVER" || secondPoint.type == "DELIVER") {
        [newState[i], newState[j]] = [newState[j], newState[i]];

        continue;
      } else {
        return newState;
      }
    }
  }

  getTransitionProbability(deltaE: number, T: number) {
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
