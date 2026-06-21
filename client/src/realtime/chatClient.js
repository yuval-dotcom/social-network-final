import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export function createChatClient({ url = SOCKET_URL, ioFactory = io } = {}) {
  const socket = ioFactory(url);

  return {
    join(roomId) {
      socket.emit("chat:join", roomId);
    },
    loadHistory(roomId, callback) {
      socket.emit("chat:history", roomId, callback);
    },
    send(message, callback) {
      socket.emit("chat:send", message, callback);
    },
    onMessage(callback) {
      socket.on("chat:message", callback);
    },
    disconnect() {
      socket.disconnect();
    }
  };
}

