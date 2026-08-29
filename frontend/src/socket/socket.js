import { io } from "socket.io-client";

export const socket = io(`${import.meta.env.BACKEND_URL}`, {
  autoConnect: false,
  withCredentials: true,
});