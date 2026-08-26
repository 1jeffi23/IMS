import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { invalidateInventoryCache } from "./InventoryCache";


export const saleApi = createApi({

  reducerPath: "saleApi",

  baseQuery: fetchBaseQuery({

    baseUrl: "http://localhost:3000/api",

    credentials: "include",

  }),

  tagTypes: [
    "Sale",
    "Product",
  ],


  endpoints: (builder) => ({

   
    // GET SALES
   

    getSales: builder.query({

      query: () =>
        "/sales",

      providesTags: [
        "Sale",
      ],

    }),


    
    // GET SALE BY ID
 

    getSaleById: builder.query({

      query: (id) =>
        `/sales/${id}`,

      providesTags: (result,error,id) => [

          {
            type: "Sale",
            id,
          },

        ],

    }),

   
    // CREATE SALE
   

    createSale: builder.mutation({

      query: (data) => ({

        url: "/sales",

        method: "POST",

        body: data,

      }),

      invalidatesTags: [
        "Sale",
        "Product",
      ],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          invalidateInventoryCache(dispatch);
        } catch (error) {
          // Sale failed — don't refresh inventory
        }
      },

    }),

  }),

});


// ==========================================
// EXPORT HOOKS
// ==========================================

export const {

  useGetSalesQuery,

  useGetSaleByIdQuery,

  useLazyGetSaleByIdQuery,

  useCreateSaleMutation,


} = saleApi;