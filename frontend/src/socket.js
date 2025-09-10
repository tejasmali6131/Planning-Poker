import { io } from "socket.io-client";

// Connect to backend server through nginx proxy
const socket = io("/", {
  transports: ["websocket", "polling"], // Allow both transports for better compatibility
  reconnection: true
});

export default socket;
