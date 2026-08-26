import { useState } from "react";

import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { useEffect } from "react";
import { socket } from "@/socket/socket";

const Chat = () => {
  const [selectedConversation, setSelectedConversation] =
    useState(null);

  const [isConnected, setIsConnected] = useState(
    socket.connected
  );

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      // console.log("Chat socket connected:", socket.id);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      // console.log("Chat socket disconnected");
    };
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 p-4">
      <div className="flex h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <ConversationList
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          socket={socket}
        />

        <ChatWindow
          conversation={selectedConversation}
          socket={socket}
          isConnected={isConnected}
          onLeaveConversation={() => {
            setSelectedConversation(null);
          }}
        />

      </div>
    </div>
  );
};

export default Chat;