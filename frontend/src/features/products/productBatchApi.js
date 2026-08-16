import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productBatchApi = createApi({
  reducerPath: "productBatchApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/prod_batches",
  }),

  tagTypes: ["ProductBatches"],

  endpoints: (builder) => ({
    // Create / Stock In
    createProductBatch: builder.mutation({
        query: (data)=>({
            url: "/add-batch",
            method: "POST",
            body: data,

        }),
        invalidatesTags: ["ProductBatches"],
    }),

    //get all batches
    getProductBatches: builder.query({
        query: ()=>"/",
        providesTags: ["ProductBatches"],
    }),

    // getProductBatchById: builder.query({
    //   query: (id)=> `/${id}`,
    // }),
     getProductBatchById: builder.query({
      query: (id) => `/${id}`,
    }),

    updateProductBatch: builder.mutation({
      query: ({id,data})=>({
        
        url: `/update-batch/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ProductBatches"],
    }),
     
    deleteProductBatch: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductBatches"],
    })

  }),


})
  

export const {
  useCreateProductBatchMutation,
  useGetProductBatchesQuery,
  useGetProductBatchByIdQuery,
  useUpdateProductBatchMutation,
  useDeleteProductBatchMutation,
} = productBatchApi;