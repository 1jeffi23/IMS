import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.BACKEND_URL}/api`,
    credentials: "include",
  }),

  tagTypes: [
    "Conversations",
    "Conversation",
    "Messages",
  ],

  endpoints: (builder) => ({

    // Get logged-in user's conversations
    getConversations: builder.query({
      query: () => "/chat/conversations",

      providesTags: ["Conversations"],
    }),

    // Get single conversation
    getConversation: builder.query({
      query: (conversationId) =>
        `/chat/conversations/${conversationId}`,

      providesTags: (result, error, conversationId) => [
        {
          type: "Conversation",
          id: conversationId,
        },
      ],
    }),

    // Get conversation messages
    getMessages: builder.query({
      query: (conversationId) =>
        `/chat/conversations/${conversationId}/messages`,

      providesTags: (result, error, conversationId) => [
        {
          type: "Messages",
          id: conversationId,
        },
      ],
    }),

    // Create direct or group conversation
    createConversation: builder.mutation({
      query: (data) => ({
        url: "/chat/conversations",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Conversations"],
    }),

    // Add participant
    addParticipant: builder.mutation({
      query: ({
        conversationId,
        userId,
      }) => ({
        url: `/chat/conversations/${conversationId}/participants`,
        method: "POST",
        body: {
          userId,
        },
      }),

      invalidatesTags: (result, error, { conversationId }) => [
        "Conversations",
        {
          type: "Conversation",
          id: conversationId,
        },
      ],
    }),

    // Remove participant
    removeParticipant: builder.mutation({
      query: ({
        conversationId,
        userId,
      }) => ({
        url: `/chat/conversations/${conversationId}/participants/${userId}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, { conversationId }) => [
        "Conversations",
        {
          type: "Conversation",
          id: conversationId,
        },
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useGetMessagesQuery,
  useCreateConversationMutation,
  useAddParticipantMutation,
  useRemoveParticipantMutation,
} = chatApi;