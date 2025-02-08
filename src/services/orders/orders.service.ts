import { createApi } from "@reduxjs/toolkit/query/react";
import { SERVER_URL } from "@/constants/urls";
import instance from "@/axios/interceptor";
import { IOrder, IOrderWithoutSensitiveInfo } from "@/types/order.interface";
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
    getOrderById: builder.query<IOrder | IOrderWithoutSensitiveInfo, number>({
      query: (id: number) => ({
        url: `/order/${id}`,
        method: "GET",
      }),
      providesTags: ["completeAction", "takeOrder"],
    }),
    getAllOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
      providesTags: ["takeOrder"],
    }),

    getAvailableOrders: builder.query<
      IOrderWithoutSensitiveInfo[],
      ILocationInitialState
    >({
      query: () => ({
        url: "/orders/available",
        method: "GET",
      }),
      transformResponse: (
        orders: IOrderWithoutSensitiveInfo[],
        meta,
        location: ILocationInitialState
      ) => {
        if (!location || location.isLocationLoading) return orders;
        return geodataService.enrichOrders(orders, location);
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
        return geodataService.enrichOrders(orders, location);
      },
      providesTags: ["takeOrder"],
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

export const useGetAvailableOrdersQueryWithSorting = (
  sortingRules: "priceASC" | "priceDESC" | "distance" | "lastDate"
) => {
  const location = useTypedSelector((state: TypeRootState) => state.location);

  return ordersApi.useGetAvailableOrdersQuery(location, {
    selectFromResult: ({ data, ...rest }) => {
      const sortedData = data
        ? [...data].sort((a, b) => {
            switch (sortingRules) {
              case "priceASC":
                return a.price - b.price;
              case "priceDESC":
                return b.price - a.price;
              case "distance":
                return a.addresses[0].distance - b.addresses[0].distance;
              case "lastDate":
                return new Date(b.date).getTime() - new Date(a.date).getTime();
              default:
                return 0;
            }
          })
        : [];
      return {
        ...rest,
        data: sortedData,
      };
    },
    pollingInterval: 60 * 1000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
};

export const useGetActiveOrders = () => {
  const location = useTypedSelector((state: TypeRootState) => state.location);

  return ordersApi.useGetActiveOrdersQuery(location, {
    pollingInterval: 60 * 1000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
};

export const {
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useGetActiveOrdersQuery,
  useTakeOrderMutation,
  useCompleteActionMutation,
  useGetAvailableOrdersQuery,
} = ordersApi;
