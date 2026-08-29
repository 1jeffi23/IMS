import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { invalidateInventoryCache } from "./InventoryCache";

export const productApi = createApi({
  reducerPath: "productApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.BACKEND_URL}/api`,
    credentials: "include",
  }),

  tagTypes: ["Product"],

  endpoints: (builder) => ({

    // GET ALL
    getProducts: builder.query({
      query: () => "/products",

      providesTags: ["Product"],
    }),

    // GET SINGLE
    getProductById: builder.query({
      query: (id) => `/products/${id}`,

      providesTags: (result, error, id) => [
        { type: "Product", id },
      ],
    }),

    // CREATE
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Product"],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    try {
      await queryFulfilled;

      invalidateInventoryCache(dispatch);
    } catch (error) {
      // Purchase failed — don't refresh inventory
    }
  },
    }),

    // UPDATE
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: ["Product"],
    }),

  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeactivateProductMutation,
} = productApi;