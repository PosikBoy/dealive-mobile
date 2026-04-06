// domain/orders/selectors.ts
import { createSelector } from '@reduxjs/toolkit';

import { TypeRootState } from '@/store/store';

import { ordersApi } from './api';
import { enrichOrdersWithGeodata, enrichOrderWithGeodata } from './utils/enrichOrdersWithGeo';

// Input selectors
const selectAvailableOrdersData = (state: TypeRootState) =>
  ordersApi.endpoints.getAvailableOrders.select()(state).data;

const selectActiveOrdersData = (state: TypeRootState) =>
  ordersApi.endpoints.getActiveOrders.select()(state).data;

const selectAllOrdersData = (state: TypeRootState) =>
  ordersApi.endpoints.getAllOrders.select()(state).data;

const selectLocation = (state: TypeRootState) => state.location;

const makeSelectOrderByIdData = (id: number) => (state: TypeRootState) =>
  ordersApi.endpoints.getOrderById.select({ id })(state).data;

export const makeSelectOrderById = (id: number) => {
  const selectOrderByIdData = makeSelectOrderByIdData(id);

  return createSelector(
    [
      selectAvailableOrdersData,
      selectActiveOrdersData,
      selectAllOrdersData,
      selectOrderByIdData,
      selectLocation,
    ],
    (availableOrders, activeOrders, allOrders, orderById, location) => {
      if (orderById) {
        if (location && !location.isLocationLoading) {
          return enrichOrderWithGeodata(orderById, location);
        }

        return orderById;
      }

      const orders = [...(availableOrders || []), ...(activeOrders || []), ...(allOrders || [])];

      let order = orders.find(o => o.id === id);

      if (!order) return undefined;

      if (location && !location.isLocationLoading) {
        order = enrichOrderWithGeodata(order, location);
      }

      return order;
    },
  );
};

export const getAvailableOrdersSelector = createSelector(
  [selectAvailableOrdersData, selectLocation],
  (availableOrders, location) => {
    try {
      if (!location || location.isLocationLoading || !availableOrders) {
        return availableOrders || [];
      }

      const ordersWithGeo = enrichOrdersWithGeodata(availableOrders, location);

      ordersWithGeo.forEach(order => {
        const addressMap = new Map(order.addresses.map(addr => [addr.id, addr]));

        order.actions.forEach(({ actionType, addressId }) => {
          const address = addressMap.get(addressId);
          if (address) {
            if (actionType === 'PICKUP') {
              address.type = 'PICKUP';
            }
            if (actionType === 'DELIVER') {
              address.type = 'DELIVER';
            }
          }
        });
      });

      return ordersWithGeo;
    } catch (error) {
      return availableOrders || [];
    }
  },
);

export const getActiveOrdersSelector = createSelector(
  [selectActiveOrdersData, selectLocation],
  (activeOrders, location) => {
    try {
      if (!location || location.isLocationLoading || !activeOrders) {
        return activeOrders || [];
      }

      const ordersWithGeo = enrichOrdersWithGeodata(activeOrders, location);

      ordersWithGeo.forEach(order => {
        const addressMap = new Map(order.addresses.map(addr => [addr.id, addr]));

        order.actions.forEach(({ actionType, addressId, isCompleted }) => {
          const address = addressMap.get(addressId);
          if (address) {
            if (actionType === 'PICKUP') {
              address.type = 'PICKUP';
              address.isCompleted = isCompleted;
            }
            if (actionType === 'DELIVER') {
              address.type = 'DELIVER';
              address.isCompleted = isCompleted;
            }
          }
        });
      });

      return ordersWithGeo;
    } catch (error) {
      return activeOrders || [];
    }
  },
);

export const getAllOrdersSelector = createSelector(
  [selectAllOrdersData, selectLocation],
  (allOrders, location) => {
    try {
      if (!location || location.isLocationLoading || !allOrders) {
        return allOrders || [];
      }

      const ordersWithGeo = enrichOrdersWithGeodata(allOrders, location);

      ordersWithGeo?.forEach(order => {
        const addressMap = new Map(order.addresses.map(addr => [addr.id, addr]));

        order.actions?.forEach(({ actionType, addressId, isCompleted }) => {
          const address = addressMap.get(addressId);

          if (address) {
            if (actionType === 'PICKUP') {
              address.type = 'PICKUP';
              address.isCompleted = isCompleted;
            }
            if (actionType === 'DELIVER') {
              address.type = 'DELIVER';
              address.isCompleted = isCompleted;
            }
          }
        });
      });

      return ordersWithGeo;
    } catch (error) {
      return allOrders || [];
    }
  },
);
