import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export const supplierApi = createApi({
  reducerPath: "supplierApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
  }),

  tagTypes: ["Supplier"],

  endpoints: (builder) => ({

    // GET ALL
    getSuppliers: builder.query({
      query: () => "/suppliers",

      providesTags: ["Supplier"],
    }),

    // GET SINGLE
    getSupplierById: builder.query({
      query: (id) =>
        `/suppliers/${id}`,

      providesTags: (result, error, id) => [
        {
          type: "Supplier",
          id,
        },
      ],
    }),

    // CREATE
    createSupplier: builder.mutation({
      query: (data) => ({
        url: "/suppliers",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Supplier"],
    }),

    // UPDATE
    updateSupplier: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/suppliers/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} = supplierApi;