import { useContext, useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  Users,
} from "lucide-react";
import { useDispatch } from "react-redux";

import { AuthContext } from "../../contexts/authContext";

import {
  chatApi,
  useGetMessagesQuery,
} from "../../services/chatApi";

import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import GroupMembersPanel from "./GroupMembersPanel";

const ChatWindow = ({
  conversation,
  socket,
  isConnected,
  onLeaveConversation,
}) => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();

  const [typingUsers, setTypingUsers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  // READ RECEIPT
  const [readStatus, setReadStatus] = useState(null);

  const messagesEndRef = useRef(null);

  const {
    data,
    isLoading,
    isError,
  } = useGetMessagesQuery(
    conversation?.id,
    {
      skip: !conversation?.id,
    }
  );

  const messages = data?.data || [];

  /*
  |=========================================
  | DIRECT CHAT PARTICIPANT
  |=========================================
  */

  const otherParticipant =
    conversation?.type === "direct"
      ? (
          conversation?.participants ||
          conversation?.users ||
          []
        ).find((participant) => {
          const participantId =
            participant?.id ||
            participant?.userId ||
            participant?.user?.id;

          return participantId !== user?.id;
        })
      : null;

  /*
  |=========================================
  | GROUP MEMBERS
  |=========================================
  */

  const groupMembers =
    conversation?.type === "group"
      ? conversation?.participants ||
        conversation?.users ||
        []
      : [];

  /*
  |=========================================
  | JOIN CONVERSATION
  |=========================================
  */

  useEffect(() => {
    if (
      !conversation?.id ||
      !socket ||
      !isConnected
    ) {
      return;
    }

    const conversationId = conversation.id;

    socket.emit("conversation:join", {
      conversationId,
    });

    return () => {
      socket.emit("conversation:leave", {
        conversationId,
      });
    };
  }, [
    conversation?.id,
    socket,
    isConnected,
  ]);

  /*
  |=========================================
  | RECEIVE NEW MESSAGE
  |=========================================
  */

  useEffect(() => {
    if (!conversation?.id || !socket) {
      return;
    }

    const handleNewMessage = (message) => {
      if (
        message.conversationId !==
        conversation.id
      ) {
        return;
      }

      dispatch(
        chatApi.util.updateQueryData(
          "getMessages",
          conversation.id,
          (draft) => {
            if (!draft?.data) {
              return;
            }

            const exists =
              draft.data.some(
                (item) =>
                  item.id === message.id
              );

            if (!exists) {
              draft.data.push(message);
            }
          }
        )
      );
    };

    socket.on(
      "message:receive",
      handleNewMessage
    );

    return () => {
      socket.off(
        "message:receive",
        handleNewMessage
      );
    };
  }, [
    conversation?.id,
    socket,
    dispatch,
  ]);

  /*
  |=========================================
  | RECEIVE READ RECEIPT
  |=========================================
  */

  useEffect(() => {
    if (!conversation?.id || !socket) {
      return;
    }

    const handleConversationRead = ({
      conversationId,
      userId,
      lastReadAt,
    }) => {

      if (
        conversationId !==
        conversation.id
      ) {
        return;
      }

      // Ignore our own read event
      if (userId === user?.id) {
        return;
      }

      if (!lastReadAt) {
        return;
      }

      setReadStatus(lastReadAt);
    };

    socket.on(
      "conversation:read",
      handleConversationRead
    );

    return () => {
      socket.off(
        "conversation:read",
        handleConversationRead
      );
    };
  }, [
    conversation?.id,
    socket,
    user?.id,
  ]);

  /*
  |=========================================
  | MARK CONVERSATION AS READ
  |=========================================
  */

  useEffect(() => {
    if (
      !conversation?.id ||
      !socket ||
      !isConnected
    ) {
      return;
    }

    socket.emit("conversation:read", {
      conversationId:
        conversation.id,
    });
  }, [
    conversation?.id,
    socket,
    isConnected,
    messages.length,
  ]);

  /*
  |=========================================
  | TYPING START
  |=========================================
  */

  useEffect(() => {
    if (!conversation?.id || !socket) {
      return;
    }

    const handleTypingStart = ({
      conversationId,
      userId,
      userName,
      userRole,
    }) => {
      if (
        conversationId !==
          conversation.id ||
        userId === user?.id
      ) {
        return;
      }

      setTypingUsers((current) => {
        const exists =
          current.some(
            (item) =>
              item.userId === userId
          );

        if (exists) {
          return current;
        }

        return [
          ...current,
          {
            userId,
            userName,
            userRole,
          },
        ];
      });
    };

    socket.on(
      "typing:start",
      handleTypingStart
    );

    return () => {
      socket.off(
        "typing:start",
        handleTypingStart
      );
    };
  }, [
    conversation?.id,
    socket,
    user?.id,
  ]);

  /*
  |=========================================
  | TYPING STOP
  |=========================================
  */

  useEffect(() => {
    if (!conversation?.id || !socket) {
      return;
    }

    const handleTypingStop = ({
      conversationId,
      userId,
    }) => {
      if (
        conversationId !==
          conversation.id ||
        userId === user?.id
      ) {
        return;
      }

      setTypingUsers((current) =>
        current.filter(
          (item) =>
            item.userId !== userId
        )
      );
    };

    socket.on(
      "typing:stop",
      handleTypingStop
    );

    return () => {
      socket.off(
        "typing:stop",
        handleTypingStop
      );
    };
  }, [
    conversation?.id,
    socket,
    user?.id,
  ]);

  /*
  |=========================================
  | SCROLL TO LATEST MESSAGE
  |=========================================
  */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /*
  |=========================================
  | RESET WHEN CONVERSATION CHANGES
  |=========================================
  */

  useEffect(() => {
    setTypingUsers([]);
    setShowMembers(false);
    setReadStatus(null);
  }, [conversation?.id]);

  /*
  |=========================================
  | EMPTY STATE
  |=========================================
  */

  if (!conversation) {
    return (
      <main className="hidden flex-1 items-center justify-center bg-gray-50 md:flex">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
            <MessageCircle size={30} />
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            Your Messages
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Select a conversation from the
            left to start chatting with your
            team.
          </p>
        </div>
      </main>
    );
  }

  /*
  |=========================================
  | CONVERSATION TITLE
  |=========================================
  */

  const conversationTitle =
    conversation.type === "group"
      ? conversation.name ||
        "Group Conversation"
      : otherParticipant?.name ||
        otherParticipant?.user?.name ||
        conversation.lastMessage?.sender
          ?.name ||
        "Direct Conversation";

  /*
  |=========================================
  | CONVERSATION ROLE
  |=========================================
  */

  const conversationRole =
    conversation.type === "group"
      ? `${groupMembers.length} members`
      : otherParticipant?.role ||
        otherParticipant?.user?.role ||
        "";

  /*
  |=========================================
  | RENDER
  |=========================================
  */

  return (
    <main className="flex min-w-0 flex-1 flex-col">

      {/* HEADER */}

      <header className="relative flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700">
            {conversation.type ===
            "group"
              ? "👥"
              : conversationTitle
                  ?.charAt(0)
                  .toUpperCase()}
          </div>

          <div>

            <h2 className="font-semibold text-gray-900">
              {conversationTitle}
            </h2>

            {conversationRole && (
              <p className="text-xs capitalize text-gray-500">
                {conversationRole}
              </p>
            )}

          </div>

        </div>

        {/* GROUP MEMBERS */}

        {conversation.type === "group" && (
          <button
            type="button"
            onClick={() =>
              setShowMembers(
                (current) => !current
              )
            }
            className={`rounded-lg p-2 transition ${
              showMembers
                ? "bg-purple-100 text-purple-700"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
            title="Group members"
          >
            <Users size={20} />
          </button>
        )}

        {conversation.type === "group" &&
          showMembers && (
            <GroupMembersPanel
              conversation={conversation}
              user={user}
              members={groupMembers}
              onClose={() =>
                setShowMembers(false)
              }
              onLeaveConversation={
                onLeaveConversation
              }
            />
          )}

      </header>

      {/* CONNECTION STATUS */}

      {!isConnected && (
        <div className="border-b border-red-100 bg-red-50 px-4 py-2 text-center text-xs text-red-600">
          Reconnecting to chat...
        </div>
      )}

      {/* MESSAGES */}

      <div className="flex-1 overflow-y-auto bg-gray-50 p-5">

        {isLoading && (
          <div className="text-center text-sm text-gray-500">
            Loading messages...
          </div>
        )}

        {isError && (
          <div className="text-center text-sm text-red-500">
            Failed to load messages.
          </div>
        )}

        {!isLoading &&
          !isError &&
          messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">

                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <MessageCircle
                    size={22}
                    className="text-gray-400"
                  />
                </div>

                <p className="text-sm font-medium text-gray-700">
                  No messages yet
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Send the first message.
                </p>

              </div>
            </div>
          )}

        <div className="space-y-3">

          {messages.map((message) => {

            const isOwn =
              message.senderId ===
              user?.id;

            /*
             * A message is read when:
             * - it belongs to current user
             * - another user has read the conversation
             * - message was created before/equal to lastReadAt
             */

            const isRead =
              isOwn &&
              Boolean(readStatus) &&
              Boolean(message.createdAt) &&
              new Date(
                message.createdAt
              ) <=
                new Date(readStatus);

            return (
              <MessageBubble
                key={message.id}
                message={message}
                currentUserId={user?.id}
                isGroup={
                  conversation.type ===
                  "group"
                }
                isRead={isRead}
              />
            );
          })}

          <div ref={messagesEndRef} />

        </div>
      </div>

      {/* TYPING INDICATOR */}

      {typingUsers.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-2">

          <p className="text-xs italic text-gray-500">

            {typingUsers.length === 1
              ? `${typingUsers[0].userName} is typing...`
              : `${typingUsers
                  .map(
                    (item) =>
                      item.userName
                  )
                  .join(", ")} are typing...`}

          </p>

        </div>
      )}

      {/* MESSAGE INPUT */}

      <MessageInput
        conversationId={conversation.id}
        socket={socket}
        disabled={!isConnected}
        onSend={(data) => {
          socket.emit(
            "message:send",
            data
          );
        }}
      />

    </main>
  );
};

export default ChatWindow;