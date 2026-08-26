import { useContext } from "react";
import {
  Check,
  CheckCheck,
} from "lucide-react";

import { AuthContext } from "../../contexts/authContext";

const MessageBubble = ({
  message,
  currentUserId,
  isGroup,
  isRead,
}) => {
  const { user } = useContext(AuthContext);

  const isOwn =
    message.senderId ===
    (currentUserId || user?.id);

  const senderName =
    message.sender?.name || "User";

  const senderRole =
    message.sender?.role || "";

  return (
    <div
      className={`flex ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[75%] flex-col ${
          isOwn ? "items-end" : "items-start"
        }`}
      >
        {/* SENDER INFO FOR OTHER USERS */}
        {!isOwn && (
          <div className="mb-1 px-2">
            <p className="text-xs font-semibold text-gray-600">
              {senderName}
            </p>

            {senderRole && (
              <p className="text-[10px] capitalize text-gray-400">
                {senderRole}
              </p>
            )}
          </div>
        )}

        {/* MESSAGE */}
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isOwn
              ? "rounded-br-md bg-purple-600 text-white"
              : "rounded-bl-md bg-white text-gray-800 shadow-sm"
          }`}
        >
          <p className="whitespace-pre-wrap break-words text-sm leading-6">
            {message.content}
          </p>
        </div>

        {/* TIME + READ STATUS */}
        <div className="mt-1 flex items-center gap-1 px-2 text-[11px] text-gray-400">
          {message.createdAt && (
            <span>
              {new Date(
                message.createdAt
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}

          {isOwn && (
            <>
              {isRead ? (
                <CheckCheck
                  size={15}
                  strokeWidth={2.5}
                  className="text-blue-500"
                />
              ) : (
                <Check
                  size={15}
                  strokeWidth={2.5}
                  className="text-gray-400"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;