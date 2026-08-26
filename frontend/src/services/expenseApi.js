import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const expenseApi = createApi({
  reducerPath: "expenseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://ims-backend-chi.vercel.app/api",
    credentials: "include",
  }),

  tagTypes: ["Expense"],

  endpoints: (builder) => ({
    
    // Get all expenses
    getExpenses: builder.query({
      query: () => "/expenses",
      providesTags: ["Expense"],
    }),

    // Get single expense
    getExpenseById: builder.query({
      query: (id) => `/expenses/${id}`,
      providesTags: (result, error, id) => [
        { type: "Expense", id },
      ],
    }),

    // Create expense
    createExpense: builder.mutation({
      query: (expenseData) => ({
        url: "/expenses",
        method: "POST",
        body: expenseData,
      }),
      invalidatesTags: ["Expense"],
    }),

    // Delete expense
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense"],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseByIdQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;