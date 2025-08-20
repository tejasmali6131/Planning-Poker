import { io } from "socket.io-client";

// Connect to backend server
const socket = io("http://localhost:4000", {
  transports: ["websocket"], // Ensure direct WebSocket connection
  reconnection: true
});

export default socket;
