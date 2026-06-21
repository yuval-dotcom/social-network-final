export function createChatHandlers({ db, messages }) {
  return {
    async sendMessage(payload, emitMessage) {
      const message = await messages.create(db, payload);
      emitMessage(message.roomId, message);
      return message;
    },

    async loadHistory(roomId) {
      return messages.listByRoom(db, roomId);
    }
  };
}

export function registerChatSocket(io, { db, messages }) {
  const handlers = createChatHandlers({ db, messages });

  io.on("connection", (socket) => {
    socket.on("chat:join", (roomId) => {
      socket.join(roomId);
    });

    socket.on("chat:history", async (roomId, callback) => {
      callback(await handlers.loadHistory(roomId));
    });

    socket.on("chat:send", async (payload, callback) => {
      try {
        const message = await handlers.sendMessage(payload, (roomId, savedMessage) => {
          io.to(roomId).emit("chat:message", savedMessage);
        });
        callback?.({ success: true, message });
      } catch (error) {
        callback?.({ success: false, message: error.message });
      }
    });
  });
}

