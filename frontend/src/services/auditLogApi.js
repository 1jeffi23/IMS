import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "https://ims-backend-chi.vercel.app/api";

export const auditLogApi = createApi({
  reducerPath: "auditLogApi",

  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),

  tagTypes: ["AuditLogs"],

  endpoints: (builder) => ({

    // ==========================================
    // GET ALL AUDIT LOGS
    // ==========================================

    getAuditLogs: builder.query({
      query: () => "/audit-logs",

      providesTags: ["AuditLogs"],
    }),


    // ==========================================
    // GET SPECIFIC USER HISTORY
    // ==========================================

    getUserAuditLogs: builder.query({
      query: (userId) => `/audit-logs/user/${userId}`,

      providesTags: (result, error, userId) => [
        {
          type: "AuditLogs",
          id: userId,
        },
      ],
    }),

  }),
});

export const {
  useGetAuditLogsQuery,
  useGetUserAuditLogsQuery,
} = auditLogApi;