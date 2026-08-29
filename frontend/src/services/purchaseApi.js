import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.BACKEND_URL}/api`,
    credentials: "include",
  }),

  tagTypes: ["Product",
  "ProductBatch",
  "Supplier",
  "Purchase",],

  endpoints: (builder) => ({
    getPurchases: builder.query({
      query: () => "/purchases",
      providesTags: ["Purchase"],
    }),

    getPurchaseById: builder.query({
      query: (id) => `/purchases/${id}`,
      providesTags: (result, error, id) => [
        { type: "Purchase", id },
      ],
    }),

    createPurchase: builder.mutation({
      query: (data) => ({
        url: "/purchases",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Purchase", "Product", "ProductBatch"], 
       async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    try {
      await queryFulfilled;

      invalidateInventoryCache(dispatch);
    } catch (error) {
      // Purchase failed — don't refresh inventory
    }
  },
      
    }),
  }),
});

export const {
  useGetPurchasesQuery,
  useGetPurchaseByIdQuery,
  useCreatePurchaseMutation,
} = purchaseApi;