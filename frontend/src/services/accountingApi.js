import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const accountingApi = createApi({
  reducerPath: "accountingApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "`${import.meta.env.VITE_BACKEND_URL}/api`",
    credentials: "include",
  }),

  tagTypes: ["Accounting"],

  endpoints: (builder) => ({
    getAccountingSummary: builder.query({
      query: ({ startDate, endDate } = {}) => {
        const params = new URLSearchParams();

        if (startDate) {
          params.append("startDate", startDate);
        }

        if (endDate) {
          params.append("endDate", endDate);
        }

        const queryString = params.toString();

        return {
          url: `/accounting/summary${
            queryString ? `?${queryString}` : ""
          }`,
          method: "GET",
        };
      },

      providesTags: ["Accounting"],
    }),
  }),
});

export const {
  useGetAccountingSummaryQuery,
} = accountingApi;