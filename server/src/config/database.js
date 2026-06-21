import { MongoClient } from "mongodb";
import { env } from "./env.js";

let activeClient;
let activeDb;

export async function connectDatabase({
  uri = env.mongoUri,
  dbName = env.mongoDbName,
  MongoClientImpl = MongoClient
} = {}) {
  if (!uri) {
    throw new Error("MONGO_URI is required to connect to MongoDB");
  }

  const client = new MongoClientImpl(uri);
  await client.connect();

  activeClient = client;
  activeDb = client.db(dbName);

  return activeDb;
}

export function getDb() {
  if (!activeDb) {
    throw new Error("Database was not connected yet");
  }

  return activeDb;
}

export async function closeDatabase() {
  if (activeClient) {
    await activeClient.close();
  }

  activeClient = undefined;
  activeDb = undefined;
}

