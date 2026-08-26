import {
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";

import {
  Search,
  MessageSquarePlus,
} from "lucide-react";

import {
  useGetConversationsQuery,
  useCreateConversationMutation,
} from "../../services/chatApi";

import {
  useGetUsersQuery,
} from "../../services/userApi";

import {
  AuthContext,
} from "../../contexts/authContext";

import CreateConversationModal from "./CreateConversationModal";
import { toast } from "sonner";

const ConversationList = ({
  selectedConversation,
  onSelectConversation,
  socket,
}) => {
  const { user } = useContext(AuthContext);

  const [search, setSearch] = useState("");

  const [
    showCreateModal,
    setShowCreateModal,
  ] = useState(false);

  const [
    unreadConversations,
    setUnreadConversations,
  ] = useState(() => new Set());

  const {
    data,
    isLoading,
    isError,
  } = useGetConversationsQuery();

  const {
    data: usersData,
    isLoading: isUsersLoading,
  } = useGetUsersQuery();

  const [
    createConversation,
    {
      isLoading: isCreating,
    },
  ] = useCreateConversationMutation();

  const conversations =
    data?.data || [];

  const users =
    usersData?.users || [];

  // Listen for new messages
  useEffect(() => {
    if (!socket || !user?.id) {
      return;
    }

    const handleNewMessage = (
      message
    ) => {
      if (
        !message?.conversationId ||
        message.senderId === user.id
      ) {
        return;
      }

      if (
        String(
          selectedConversation?.id
        ) ===
        String(message.conversationId)
      ) {
        return;
      }

      setUnreadConversations(
        (current) => {
          const updated =
            new Set(current);

          updated.add(
            String(
              message.conversationId
            )
          );

          return updated;
        }
      );
    };

    socket.on(
      "conversation:message",
      handleNewMessage
    );

    return () => {
      socket.off(
        "conversation:message",
        handleNewMessage
      );
    };
  }, [
    socket,
    user?.id,
    selectedConversation?.id,
  ]);

  // Clear unread indicator
  useEffect(() => {
    if (!selectedConversation?.id) {
      return;
    }

    setUnreadConversations(
      (current) => {
        const updated =
          new Set(current);

        updated.delete(
          String(
            selectedConversation.id
          )
        );

        return updated;
      }
    );
  }, [
    selectedConversation?.id,
  ]);

  // Get other participant
  const getOtherParticipant = (
    conversation
  ) => {
    if (
      conversation.type !==
      "direct"
    ) {
      return null;
    }

    const participants =
      conversation.participants ||
      conversation.users ||
      [];

    return participants.find(
      (participant) => {
        const participantId =
          participant.id ||
          participant.userId ||
          participant.user?.id;

        return (
          participantId !==
          user?.id
        );
      }
    );
  };

  // Get conversation title
  const getConversationTitle = (
    conversation
  ) => {
    if (
      conversation.type ===
      "group"
    ) {
      return (
        conversation.name ||
        "Group Conversation"
      );
    }

    const otherParticipant =
      getOtherParticipant(
        conversation
      );

    return (
      otherParticipant?.name ||
      otherParticipant?.user?.name ||
      conversation.lastMessage
        ?.sender?.name ||
      "Direct Conversation"
    );
  };

  // Get conversation role
  const getConversationRole = (
    conversation
  ) => {
    if (
      conversation.type ===
      "group"
    ) {
      return "Group conversation";
    }

    const otherParticipant =
      getOtherParticipant(
        conversation
      );

    return (
      otherParticipant?.role ||
      otherParticipant?.user?.role ||
      ""
    );
  };

  // Search conversations
  const filteredConversations =
    useMemo(() => {
      const searchValue =
        String(search || "")
          .toLowerCase()
          .trim();

      return conversations.filter(
        (conversation) => {
          const title =
            getConversationTitle(
              conversation
            );

          const role =
            getConversationRole(
              conversation
            );

          return (
            title
              .toLowerCase()
              .includes(searchValue) ||
            role
              .toLowerCase()
              .includes(searchValue)
          );
        }
      );
    }, [
      conversations,
      search,
      user?.id,
    ]);

  // Create direct conversation
  const handleCreateConversation =
    async (selectedUser) => {
      try {
        const result =
          await createConversation({
            type: "direct",
            participantIds: [
              selectedUser.id,
            ],
          }).unwrap();

        setShowCreateModal(false);

        const newConversation =
          result?.data || result;

        if (newConversation?.id) {
          onSelectConversation(
            newConversation
          );
        }
      } catch (error) {
        toast.error(
          "Failed to create conversation:" ||
          error?.data?.message ||
          error?.message
        );
      }
    };

  // Create group
  const handleCreateGroup =
    async ({
      name,
      participantIds,
    }) => {
      try {
        const result =
          await createConversation({
            type: "group",
            name,
            participantIds,
          }).unwrap();

        setShowCreateModal(false);

        const newConversation =
          result?.data || result;

        if (newConversation?.id) {
          onSelectConversation(
            newConversation
          );
        }
      } catch (error) {
        toast.error(
          "Failed to create group:" ||
          error?.data?.message ||
          error?.message
        );
      }
    };

  return (
    <>
      <aside className="flex w-full max-w-sm flex-col border-r border-gray-200">
        <div className="border-b border-gray-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Messages
              </h2>

              <p className="text-sm text-gray-500">
                Your conversations
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowCreateModal(true)
              }
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              title="New conversation"
            >
              <MessageSquarePlus
                size={20}
              />
            </button>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="p-5 text-sm text-gray-500">
              Loading conversations...
            </div>
          )}

          {isError && (
            <div className="p-5 text-sm text-red-500">
              Failed to load conversations.
            </div>
          )}

          {!isLoading &&
            !isError &&
            filteredConversations.length ===
            0 && (
              <div className="p-5 text-center text-sm text-gray-500">
                No conversations found.
              </div>
            )}

          {filteredConversations.map(
            (conversation) => {
              const isSelected =
                selectedConversation?.id ===
                conversation.id;

              const isUnread =
                unreadConversations.has(
                  String(
                    conversation.id
                  )
                );

              const title =
                getConversationTitle(
                  conversation
                );

              const role =
                getConversationRole(
                  conversation
                );

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() =>
                    onSelectConversation(
                      conversation
                    )
                  }
                  className={`flex w-full items-center gap-3 border-b border-gray-100 p-4 text-left transition ${isSelected
                      ? "bg-purple-50"
                      : "hover:bg-gray-50"
                    }`}
                >
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700">
                    {conversation.type ===
                      "group"
                      ? "👥"
                      : title
                        .charAt(0)
                        .toUpperCase()}

                    {isUnread && (
                      <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`truncate text-sm ${isUnread
                            ? "font-bold text-gray-900"
                            : "font-semibold text-gray-900"
                          }`}
                      >
                        {title}
                      </h3>

                      {conversation.updatedAt && (
                        <span className="shrink-0 text-xs text-gray-400">
                          {new Date(
                            conversation.updatedAt
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {role && (
                      <p className="mt-0.5 text-xs capitalize text-gray-400">
                        {role}
                      </p>
                    )}

                    <p
                      className={`mt-1 truncate text-xs ${isUnread
                          ? "font-medium text-gray-700"
                          : "text-gray-500"
                        }`}
                    >
                      {conversation
                        .lastMessage
                        ?.content ||
                        (conversation.type ===
                          "group"
                          ? "Group conversation"
                          : "No messages yet")}
                    </p>
                  </div>
                </button>
              );
            }
          )}
        </div>
      </aside>

      {showCreateModal && (
        <CreateConversationModal
          users={users}
          currentUserId={user?.id}
          onClose={() =>
            setShowCreateModal(false)
          }
          onCreate={
            handleCreateConversation
          }
          onCreateGroup={
            handleCreateGroup
          }
          isCreating={
            isCreating ||
            isUsersLoading
          }
        />
      )}
    </>
  );
};

export default ConversationList;