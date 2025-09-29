import { io } from "socket.io-client";

const socket = io("/", {
  transports: ["websocket", "polling"], // Allow both transports for better compatibility
  reconnection: true
});

export default socket;
