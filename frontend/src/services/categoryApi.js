import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://ims-backend-chi.vercel.app/api",
    credentials: "include",
  }),

  tagTypes: ["Category"],

  endpoints: (builder) => ({

    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: ["Category"],
    }),

    deactivateCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}/deactivate`,
        method: "PATCH",
      }),

      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeactivateCategoryMutation,
} = categoryApi;