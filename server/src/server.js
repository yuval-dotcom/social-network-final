import { createServer } from "node:http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { createCorsOriginDelegate } from "./config/clientOrigins.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { createDemoMemoryDatabase } from "./config/memoryDatabase.js";
import { chatMessageRepository } from "./repositories/chatMessageRepository.js";
import { registerChatSocket } from "./sockets/chatSocket.js";

const db =
  env.databaseMode === "memory" ? await createDemoMemoryDatabase() : await connectDatabase();
const app = createApp({ db });
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: createCorsOriginDelegate() }
});

registerChatSocket(io, { db, messages: chatMessageRepository });

httpServer.listen(env.port, () => {
  console.log(`StudyCircle server is running on port ${env.port} (${env.databaseMode} db)`);
});
