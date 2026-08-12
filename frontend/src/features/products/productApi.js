// Need to use the React-specific entry point to import createApi
import { resolveMultipleLabels } from '@base-ui/react/internals/resolveValueLabel';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
   tagTypes: ["Products"],
  endpoints: (builder) => ({
    
    getProducts: builder.query({
      query: () => "/products/",
      providesTags: ["Products"],
    }),
    
    getProductByid:  builder.query({
      query: (id) => `/products/${id}`,
      providesTags:(result,error,id)=> [
        {type:"Products",id}
      ],
    }),
  
    createProduct: builder.mutation({
        query: (data)=>({
            url: "/products/add",
            method: "POST",
            body:data,
        }),
        invalidTags: ["Products"],
    }),

    updateProduct: builder.mutation({
        query: (id,data)=>({
            url: `/products/edit/${id}`,
            method: "PUT",
            body: data,
        }),
        invalidTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
        query: (id)=>({
            url: `/products/${id}`,
            method: "DELETE",
        }),
        invalidTags: ["Products"],
    }),

  }),

});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetProductsQuery,useGetProductByidQury,useCreateProductMutation,useUpdateProductMutation,useDeleteProductMutation} = productApi