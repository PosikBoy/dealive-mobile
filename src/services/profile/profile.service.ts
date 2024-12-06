import instance from "@/axios/interceptor";
import { SERVER_URL } from "@/constants/urls";
import { errorCatch } from "@/helpers/errorCatch";
import { createApi } from "@reduxjs/toolkit/query/react";

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
      return { data: result.data }; // возвращаем только data
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
