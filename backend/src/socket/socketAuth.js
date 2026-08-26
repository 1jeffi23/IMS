import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../utils/auth.js";

export const socketAuth = async (socket, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(socket.handshake.headers),
    });

    if (!session?.user) {
      return next(new Error("Unauthorized"));
    }

    socket.user = session.user;

    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    next(new Error("Authentication failed"));
  }
};