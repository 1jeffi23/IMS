import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import useDebounce from "../../components/customHooks/useDebounce";

const MessageInput = ({
  conversationId,
  socket,
  disabled = false,
  onSend,
}) => {
  const [message, setMessage] = useState("");

  const isTyping = useRef(false);

  const debouncedMessage = useDebounce(
    message,
    500
  );

  // =========================
  // START TYPING
  // =========================

  useEffect(() => {
    if (
      !conversationId ||
      !socket ||
      disabled
    ) {
      return;
    }

    if (
      message.trim() &&
      !isTyping.current
    ) {
      isTyping.current = true;

      socket.emit("typing:start", {
        conversationId,
      });
    }
  }, [
    message,
    conversationId,
    socket,
    disabled,
  ]);

  // =========================
  // STOP TYPING
  // =========================

  useEffect(() => {
    if (
      !conversationId ||
      !socket
    ) {
      return;
    }

    /*
     * User stopped typing for 500ms
     */

    if (
      isTyping.current &&
      !debouncedMessage.trim()
    ) {
      isTyping.current = false;

      socket.emit("typing:stop", {
        conversationId,
      });
    }
  }, [
    debouncedMessage,
    conversationId,
    socket,
  ]);

  // =========================
  // STOP TYPING HELPER
  // =========================

  const stopTyping = () => {
    if (
      !socket ||
      !conversationId
    ) {
      return;
    }

    if (isTyping.current) {
      isTyping.current = false;

      socket.emit("typing:stop", {
        conversationId,
      });
    }
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage =
      message.trim();

    if (
      !trimmedMessage ||
      disabled
    ) {
      return;
    }

    // Stop typing before sending
    stopTyping();

    onSend?.({
      conversationId,
      message: trimmedMessage,
    });

    setMessage("");
  };

  // =========================
  // KEYBOARD
  // =========================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      handleSubmit(e);
    }
  };

  // =========================
  // CLEANUP
  // =========================

  useEffect(() => {
    return () => {
      if (
        isTyping.current &&
        socket &&
        conversationId
      ) {
        socket.emit("typing:stop", {
          conversationId,
        });
      }

      isTyping.current = false;
    };
  }, [
    conversationId,
    socket,
  ]);

  // =========================
  // UI
  // =========================

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-3"
      >
        <textarea
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder={
            disabled
              ? "Connecting..."
              : "Write a message..."
          }
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={
            disabled ||
            !message.trim()
          }
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <Send size={18} />
        </button>
      </form>

      <p className="mt-2 px-1 text-[11px] text-gray-400">
        Enter to send · Shift + Enter for new line
      </p>
    </div>
  );
};

export default MessageInput;