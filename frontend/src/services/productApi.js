import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
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