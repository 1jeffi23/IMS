import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { invalidateInventoryCache } from "./InventoryCache";

export const productBatchApi = createApi({
  reducerPath: "productBatchApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://ims-backend-chi.vercel.app/api",
    credentials: "include",
  }),

  tagTypes: ["ProductBatch"],

  endpoints: (builder) => ({

    // GET ALL BATCHES
    getProductBatches: builder.query({
      query: () => "/product-batches",
      providesTags: ["ProductBatch"],
    }),

    // GET SINGLE BATCH
    getProductBatchById: builder.query({
      query: (id) => `/product-batches/${id}`,
      providesTags: (result, error, id) => [
        { type: "ProductBatch", id },
      ],
    }),

    // CREATE BATCH
    createProductBatch: builder.mutation({
      query: (data) => ({
        url: "/product-batches",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ProductBatch", "Product"],
       async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    try {
      await queryFulfilled;

      invalidateInventoryCache(dispatch);
    } catch (error) {
      // Batch creation failed
    }
  },
    }),

    // UPDATE BATCH
    updateProductBatch: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/product-batches/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ProductBatch", "Product"],
       async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    try {
      await queryFulfilled;

      invalidateInventoryCache(dispatch);
    } catch (error) {
      // Batch update failed
    }
  },
    }),

    // DELETE BATCH
    deleteProductBatch: builder.mutation({
      query: (id) => ({
        url: `/product-batches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductBatch", "Product"],
    }),
  }),
});

export const {
  useGetProductBatchesQuery,
  useGetProductBatchByIdQuery,
  useCreateProductBatchMutation,
  useUpdateProductBatchMutation,
  useDeleteProductBatchMutation,
} = productBatchApi;