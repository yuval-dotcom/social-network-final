import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();
const httpServer = createServer(app);

httpServer.listen(env.port, () => {
  console.log(`StudyCircle server is running on port ${env.port}`);
});

