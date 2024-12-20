import { createApi } from "@reduxjs/toolkit/query/react";
import { SERVER_URL } from "@/constants/urls";
import instance from "@/axios/interceptor";
import { IOrder, IOrderWithoutSensitiveInfo } from "@/types/order.interface";
import { errorCatch } from "@/helpers/errorCatch";

// Обертка для axios, чтобы использовать его с RTK Query
const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async (args: any) => {
    try {
      const result = await instance({
        url: baseUrl + args.url, // создаем полный URL с baseUrl
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

    getAvailableOrders: builder.query<IOrderWithoutSensitiveInfo[], void>({
      query: () => ({
        url: "/orders/available",
        method: "GET",
      }),
      providesTags: ["takeOrder"],
    }),

    getActiveOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: "/orders/active",
        method: "GET",
      }),
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

ordersApi.useGetActiveOrdersQuery;
export const {
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useGetAvailableOrdersQuery,
  useGetActiveOrdersQuery,
  useTakeOrderMutation,
  useCompleteActionMutation,
} = ordersApi;
