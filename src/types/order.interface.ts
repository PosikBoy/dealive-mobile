export interface IAddressWithoutSensitiveInfo {
  id: number;
  orderId: number;
  address: string;
  info: string;
}

export interface IOrderWithoutSensitiveInfo {
  id: number;
  date: string;
  parcelType: string;
  weight: string;
  price: number;
  statusId: number;
  addresses: IAddressWithoutSensitiveInfo[];
}

export interface IAddress {
  id: number;
  orderId: number;
  address: string;
  floor: string;
  apartment: string;
  phoneNumber: string;
  phoneName: string;
  info: string;
  createdAt: string;
  updatedAt: string;
}
export interface IOrder {
  id: number;
  clientId: number;
  date: string;
  phoneNumber: string;
  phoneName: string;
  parcelType: string;
  weight: string;
  statusId: number;
  price: number;
  courierId: number;
  createdAt: string;
  updatedAt: string;
  addresses: IAddress[];
}
