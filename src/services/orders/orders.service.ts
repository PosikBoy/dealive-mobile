import { createApi } from "@reduxjs/toolkit/query/react";
import { SERVER_URL } from "@/constants/urls";
import instance from "@/axios/interceptor";
import { IOrder } from "@/types/order.interface";
import { errorCatch } from "@/helpers/errorCatch";
import { useTypedSelector } from "@/hooks/redux.hooks";
import { TypeRootState } from "@/store/store";
import { ILocationInitialState } from "@/store/location/location.slice";
import geodataService from "../geodata/geodata.service";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async (args: any) => {
    try {
      const result = await instance({
        url: baseUrl + args.url,
        method: args.method || "GET",
        data: args.body,
        headers: args.headers,
      });
      return { data: result.data };
    } catch (axiosError: any) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: errorCatch(axiosError),
        },
      };
    }
  };

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: axiosBaseQuery({ baseUrl: SERVER_URL }),
  tagTypes: ["completeAction", "takeOrder"],
  endpoints: (builder) => ({
    getOrderById: builder.query<
      IOrder,
      { id: number; location: ILocationInitialState }
    >({
      query: ({ id }) => ({
        url: `/order/${id}`,
        method: "GET",
      }),
      transformResponse: (
        order: IOrder,
        meta,
        { location }: { location: ILocationInitialState }
      ) => {
        if (!location || location.isLocationLoading) return order;
        return geodataService.enrichOrder(order, location);
      },
      providesTags: ["completeAction", "takeOrder"],
    }),
    getAllOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
      providesTags: ["takeOrder"],
    }),

    getAvailableOrders: builder.query<IOrder[], ILocationInitialState>({
      query: () => ({
        url: "/orders/available",
        method: "GET",
      }),
      transformResponse: (
        orders: IOrder[],
        meta,
        location: ILocationInitialState
      ) => {
        try {
          if (!location || location.isLocationLoading) return orders;

          const ordersWithGeo = geodataService.enrichOrders(orders, location);

          ordersWithGeo.forEach((order) => {
            const addressMap = new Map(
              order.addresses.map((addr) => [addr.id, addr])
            );

            order.actions.forEach(({ actionType, addressId }) => {
              if (actionType == "PICKUP") {
                addressMap.get(addressId).type = "PICKUP";
              }
              if (actionType == "DELIVER") {
                addressMap.get(addressId).type = "DELIVER";
              }
            });
          });

          return ordersWithGeo;
        } catch (error) {
          console.error(JSON.stringify(error.message));
        }
      },
      providesTags: ["takeOrder"],
    }),

    getActiveOrders: builder.query<IOrder[], ILocationInitialState>({
      query: () => ({
        url: "/orders/active",
        method: "GET",
      }),
      transformResponse: (
        orders: IOrder[],
        meta,
        location: ILocationInitialState
      ) => {
        if (!location || location.isLocationLoading) return orders;

        const ordersWithGeo = geodataService.enrichOrders(orders, location);

        ordersWithGeo.forEach((order) => {
          const addressMap = new Map(
            order.addresses.map((addr) => [addr.id, addr])
          );

          order.actions.forEach(({ actionType, addressId, isCompleted }) => {
            if (actionType == "PICKUP") {
              addressMap.get(addressId).type = "PICKUP";
              addressMap.get(addressId).isCompleted = isCompleted;
            }
            if (actionType == "DELIVER") {
              addressMap.get(addressId).type = "DELIVER";
              addressMap.get(addressId).isCompleted = isCompleted;
            }
          });
        });

        return ordersWithGeo;
      },
      providesTags: ["takeOrder", "completeAction"],
    }),

    takeOrder: builder.mutation<IOrder, { orderId: number }>({
      query: (takeOrderDto: { orderId: number }) => ({
        url: "/order/take",
        method: "PUT",
        body: takeOrderDto,
      }),
      invalidatesTags: ["takeOrder"],
    }),
    completeAction: builder.mutation<void, number>({
      query: (actionId: number) => ({
        url: `/order/action/${actionId}`,
        method: "PUT",
      }),
      invalidatesTags: ["completeAction"],
    }),
  }),
});

export const useGetAvailableOrdersQuery = () => {
  const location = useTypedSelector((state: TypeRootState) => state.location);

  return ordersApi.useGetAvailableOrdersQuery(location, {
    pollingInterval: 60 * 1000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
};

export const useGetActiveOrdersQuery = () => {
  const location = useTypedSelector((state: TypeRootState) => state.location);

  return ordersApi.useGetActiveOrdersQuery(location, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
};

export const useGetOrderByIdQuery = (id: number) => {
  const location = useTypedSelector((state: TypeRootState) => state.location);

  const { data: cachedAvailableOrders } = useGetAvailableOrdersQuery();
  const { data: cachedActiveOrders } = useGetActiveOrdersQuery();

  const cachedOrder = [
    ...(cachedAvailableOrders || []),
    ...(cachedActiveOrders || []),
  ].find((order) => order.id === id);

  const { data, isError, isLoading } = ordersApi.useGetOrderByIdQuery(
    { id, location },
    {
      pollingInterval: 120 * 1000,
    }
  );
  let orderData = data || cachedOrder;

  if (orderData && !location.isLocationLoading) {
    orderData = geodataService.enrichOrder(orderData, location);
  }

  return { data: orderData, isError, isLoading };
};

export const {
  useGetAllOrdersQuery,
  useTakeOrderMutation,
  useCompleteActionMutation,
} = ordersApi;
