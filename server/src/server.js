import { createServer } from "node:http";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

const db = await connectDatabase();
const app = createApp({ db });
const httpServer = createServer(app);

httpServer.listen(env.port, () => {
  console.log(`StudyCircle server is running on port ${env.port}`);
});
