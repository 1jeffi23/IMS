import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:3000/api";

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