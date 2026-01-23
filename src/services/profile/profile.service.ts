import { ApiError } from "@/axios/api-error";
import { instance } from "@/axios/interceptor";
import { SERVER_URL } from "@/constants/urls";
import { ICourier } from "@/types/courier.interface";
import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosRequestConfig } from "axios";

type AxiosArgs = AxiosRequestConfig;

const axiosBaseQuery =
  ({ baseUrl }): BaseQueryFn<AxiosArgs, unknown, ApiError> =>
  async (args: any) => {
    try {
      const result = await instance({
        ...args,
        url: baseUrl + args.url, // создаем полный URL с baseUrl
      });

      return { data: result.data };
    } catch (error) {
      return { error: error as ApiError };
    }
  };

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: axiosBaseQuery({ baseUrl: SERVER_URL }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getProfile: builder.query<ICourier, void>({
      query: () => ({
        url: "/courier",
        method: "GET",
      }),
    }),
    getProfileById: builder.query({
      query: (id) => ({
        url: `/courier/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetProfileQuery } = profileApi;
