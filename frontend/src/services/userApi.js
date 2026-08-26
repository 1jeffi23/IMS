import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:3000/api";

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),

  tagTypes: ["Users"],

  endpoints: (builder) => ({

    // ==========================================
    // GET ALL USERS
    // ==========================================

    getUsers: builder.query({
      query: () => "/users",

      providesTags: ["Users"],
    }),

    // ==========================================
    // UPDATE USER ROLE
    // ==========================================

    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: {
          role,
        },
      }),

      invalidatesTags: ["Users"],
    }),

  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} = userApi;