import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
  reducerPath: "customerApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://ims-backend-psi.vercel.app/api",
    credentials: "include",
  }),

  tagTypes: ["Customer"],

  
  endpoints: (builder) => ({

      // ==========================================
      // GET CUSTOMERS
      // ==========================================

      getCustomers: builder.query({

        query: () => "/customers",

        providesTags: ["Customer"],

      }),


      // ==========================================
      // CREATE CUSTOMER
      // ==========================================

      createCustomer:
        builder.mutation({

          query: (data) => ({

            url: "/customers",

            method: "POST",

            body: data,

          }),

          invalidatesTags: [
            "Customer",
          ],

        }),

    }),

});
 


export const {
  useGetCustomersQuery,
  useCreateCustomerMutation,
} = customerApi;