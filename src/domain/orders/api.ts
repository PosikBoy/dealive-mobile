import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { AxiosRequestConfig } from 'axios';
import { useEffect, useMemo, useRef } from 'react';

import { ApiError } from '@/axios/api-error';
import { instance } from '@/axios/interceptor';
import { SERVER_URL } from '@/constants/urls';
import { useTypedDispatch, useTypedSelector } from '@/hooks/redux.hooks';
import { updateRoute } from '@/store/route/route.slice';

import {
  getActiveOrdersSelector,
  getAllOrdersSelector,
  getAvailableOrdersSelector,
  makeSelectOrderById,
} from './selectors';
import { IOrder } from './types';

type AxiosArgs = AxiosRequestConfig;

const axiosBaseQuery =
  ({ baseUrl }): BaseQueryFn<AxiosArgs, unknown, ApiError> =>
  async (args: any) => {
    try {
      const result = await instance({
        ...args,
      });

      return { data: result.data };
    } catch (err) {
      const error = err as any;
      console.log('axiosBaseQuery error:', error);
      console.log('Error response:', error.response?.data);
      // создаем чистый объект для Redux
      const serializedError: ApiError = {
        status: error.response?.status ?? 500,
        message: error.response?.data?.message || error.message || 'Неизвестная ошибка',
        error: error.response?.data?.error || 'Unknown',
      };

      return { error: serializedError };
    }
  };

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: axiosBaseQuery({ baseUrl: SERVER_URL }),
  tagTypes: ['completeAction', 'takeOrder'],
  endpoints: builder => ({
    getOrderById: builder.query<IOrder, { id: number }>({
      query: ({ id }) => ({
        url: `/order/${id}`,
        method: 'GET',
      }),
      providesTags: ['completeAction', 'takeOrder'],
    }),

    getAllOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: '/orders',
        method: 'GET',
      }),
      providesTags: ['takeOrder'],
    }),

    getAvailableOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: '/orders/available',
        method: 'GET',
      }),
      providesTags: ['takeOrder'],
    }),

    getActiveOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: '/orders/active',
        method: 'GET',
      }),
      providesTags: ['takeOrder', 'completeAction'],
    }),

    takeOrder: builder.mutation<IOrder, { orderId: number }>({
      query: (takeOrderDto: { orderId: number }) => {
        return {
          url: '/order/take',
          method: 'PUT',
          data: takeOrderDto,
        };
      },
      invalidatesTags: ['takeOrder'],
    }),

    completeAction: builder.mutation<void, number>({
      query: (actionId: number) => ({
        url: `/order/action/${actionId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['completeAction'],
    }),
  }),
});

export const useAvailableOrders = () => {
  const {
    data: _data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = ordersApi.useGetAvailableOrdersQuery(undefined, {
    pollingInterval: 60_000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const enrichedOrders = useTypedSelector(getAvailableOrdersSelector);

  return useMemo(
    () => ({
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
      data: enrichedOrders,
    }),
    [isLoading, isFetching, isError, error, refetch, enrichedOrders],
  );
};

export const useActiveOrders = () => {
  const dispatch = useTypedDispatch();
  const prevOrdersRef = useRef<string>('');

  const {
    data: _data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = ordersApi.useGetActiveOrdersQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const enrichedOrders = useTypedSelector(getActiveOrdersSelector);

  useEffect(() => {
    // Сравниваем по ID заказов, чтобы избежать бесконечного цикла
    const currentOrdersKey = enrichedOrders
      .map(o => o.id)
      .sort()
      .join(',');

    if (enrichedOrders && enrichedOrders.length > 0 && !isLoading) {
      if (prevOrdersRef.current !== currentOrdersKey) {
        prevOrdersRef.current = currentOrdersKey;
        dispatch(updateRoute(enrichedOrders));
      }
    } else if (enrichedOrders.length === 0 && prevOrdersRef.current !== '') {
      prevOrdersRef.current = '';
      dispatch(updateRoute([]));
    }
  }, [enrichedOrders, isLoading, dispatch]);

  return useMemo(
    () => ({
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
      data: enrichedOrders,
    }),
    [isLoading, isFetching, isError, error, refetch, enrichedOrders],
  );
};

export const useOrderById = (id: number) => {
  const {
    data: _data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = ordersApi.useGetOrderByIdQuery(
    { id },
    {
      pollingInterval: 120 * 1000,
    },
  );

  const getOrderByIdSelector = useMemo(() => makeSelectOrderById(id), [id]);

  const cachedOrder = useTypedSelector(getOrderByIdSelector);

  return useMemo(
    () => ({
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
      data: cachedOrder,
    }),
    [isLoading, isFetching, isError, error, refetch, cachedOrder],
  );
};

export const useAllOrders = () => {
  const {
    data: _data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = ordersApi.useGetAllOrdersQuery(undefined, {
    pollingInterval: 60_000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const enrichedOrders = useTypedSelector(getAllOrdersSelector);

  return useMemo(
    () => ({
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
      data: enrichedOrders ?? [],
    }),
    [isLoading, isFetching, isError, error, refetch, enrichedOrders],
  );
};

export const { useGetAllOrdersQuery, useTakeOrderMutation, useCompleteActionMutation } = ordersApi;
