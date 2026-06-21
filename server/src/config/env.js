import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../../../.env", import.meta.url)) });
dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

export const env = {
  port: Number(process.env.PORT || 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  mongoUri: process.env.MONGO_URI || "",
  mongoDbName: process.env.MONGO_DB_NAME || "studycircle",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me"
};
