import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
  }),

  tagTypes: ["Products"],

  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query({
      query: () => "/products/",
      providesTags: ["Products"],
    }),

    // Get single product
    getProductByid: builder.query({
      query: (id) => `/products/${id}`,
    }),

    // Create product
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    // Update product
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/edit/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    // Delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByidQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;