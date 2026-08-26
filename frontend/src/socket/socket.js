import { io } from "socket.io-client";

export const socket = io("https://ims-backend-chi.vercel.app", {
  autoConnect: false,
  withCredentials: true,
});