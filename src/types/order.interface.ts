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
  GO_TO = "GO_TO",
  ARRIVED_AT = "ARRIVED_AT",
  PICKUP = "PICKUP",
  DELIVER = "DELIVER",
  COLLECT_PAYMENT = "COLLECT_PAYMENT",
  PAY_COMMISION = "PAY_COMMISION",
  COMPLETE_ORDER = "COMPLETE_ORDER",
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
  type?: "PICKUP" | "DELIVER";
  isCompleted?: boolean;
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
