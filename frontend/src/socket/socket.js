import { io } from "socket.io-client";

export const socket = io("https://ims-backend-psi.vercel.app", {
  autoConnect: false,
  withCredentials: true,
});