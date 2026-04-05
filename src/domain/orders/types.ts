export interface IGeoData {
  address: string;
  geoLat: string;
  geoLon: string;
  qcGeo: number;
  metro?: IMetro[];
  beltwayHit?: BeltwayHit;
  beltwayDistance?: number;
}

interface IMetro {
  line: string;
  name: string;
  distance: number;
}

enum BeltwayHit {
  IN_MKAD,
  OUT_MKAD,
  IN_KAD,
  OUT_KAD,
}

export enum IOrderActionType {
  GO_TO = 'GO_TO',
  ARRIVED_AT = 'ARRIVED_AT',
  PICKUP = 'PICKUP',
  DELIVER = 'DELIVER',
  COLLECT_PAYMENT = 'COLLECT_PAYMENT',
  PAY_COMMISION = 'PAY_COMMISION',
  COMPLETE_ORDER = 'COMPLETE_ORDER',
}

export interface IOrderAction {
  actionType: IOrderActionType;
  completedAt: Date | null;
  createdAt: Date;
  description: string;
  id: number;
  isCompleted: boolean;
  orderId: number;
  addressId: number;
  sequence: number;
  updatedAt: Date;
}

export interface IAddress {
  id: number;
  orderId: number;
  address: string;
  floor: string;
  apartment: string;
  phoneNumber?: string;
  phoneName?: string;
  info: string;
  //На самом деле может прийти null, пока не знаю как это учесть и пофиксить
  geoData: IGeoData;
  createdAt?: string;
  updatedAt?: string;
  distance?: number;
  type?: 'PICKUP' | 'DELIVER';
  isCompleted?: boolean;
}

// ─── WebSocket / Courier Offer Types ────────────────────────────────────────

export const COURIER_EVENTS = {
  ORDER_OFFER: 'order:offer',
  ORDER_OFFER_CANCELLED: 'order:offer:cancelled',
} as const;

export const COURIER_MESSAGES = {
  IDENTIFY: 'identify',
} as const;

export interface IOrderOfferAddress {
  address: string;
  geoData: {
    lat: string;
    lon: string;
  };
}

export interface IOrderOfferData {
  id: number;
  parcelType: string;
  weight: string;
  price: number;
  addresses: IOrderOfferAddress[];
}

export interface IOrderOfferPayload {
  timeoutSeconds: number;
  order: IOrderOfferData;
}

// ─── Courier Routes ──────────────────────────────────────────────────────────

export interface IRoutePoint {
  id: number;
  orderId: number;
  address: string;
  isCompleted: boolean;
  geoData: {
    lat: string;
    lon: string;
  };
}

export interface IUpdateRouteBody {
  currentLocation: { lat: number; lon: number };
  route: IRoutePoint[];
  totalDistance: number;
  isOnline: boolean;
}

export interface IOrder {
  id: number;
  clientId?: number;
  date: string;
  phoneNumber?: string;
  phoneName?: string;
  parcelType: string;
  weight: string;
  statusId: number;
  price: number;
  courierId?: number;
  createdAt?: string;
  updatedAt?: string;
  addresses: IAddress[];
  actions: IOrderAction[];
}
