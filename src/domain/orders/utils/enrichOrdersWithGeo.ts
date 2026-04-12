import { calculateDistance } from '@/utils/calculateDistance';

import { IAddress, IOrder } from '../types';

interface ILocation {
  lon: number;
  lat: number;
}

export const enrichOrdersWithGeodata = (orders: IOrder[], location: ILocation) => {
  const enrichedOrders = orders?.map(order => {
    const enrichedAddresses = order?.addresses.map(address => {
      const distance = calculateDistanceToAddress(location, address);
      return { ...address, distance };
    });

    return { ...order, addresses: enrichedAddresses };
  });
  return enrichedOrders;
};

export const enrichOrderWithGeodata = (order: IOrder, location: ILocation) => {
  const enrichedAddresses = order?.addresses.map(address => {
    const distance = calculateDistanceToAddress(location, address);
    return { ...address, distance };
  });
  return { ...order, addresses: enrichedAddresses };
};

export const calculateDistanceToAddress = (location: ILocation, address: IAddress) => {
  const { lon: lon1, lat: lat1 } = location;
  const lat2 = parseFloat(address.geoData?.geoLat || '0');
  const lon2 = parseFloat(address.geoData?.geoLon || '0');
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance;
};
