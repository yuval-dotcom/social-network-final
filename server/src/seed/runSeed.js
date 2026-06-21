import bcrypt from "bcryptjs";
import { closeDatabase, connectDatabase } from "../config/database.js";
import { CHAT_MESSAGE_COLLECTION } from "../models/chatMessageModel.js";
import { GROUP_COLLECTION } from "../models/groupModel.js";
import { POST_COLLECTION } from "../models/postModel.js";
import { USER_COLLECTION } from "../models/userModel.js";
import { buildDemoData } from "./demoData.js";

async function upsertMany(db, collectionName, documents) {
  for (const document of documents) {
    await db.collection(collectionName).updateOne(
      { _id: document._id },
      { $set: document },
      { upsert: true }
    );
  }
}

const db = await connectDatabase();
const data = await buildDemoData({ hashPassword: (password) => bcrypt.hash(password, 10) });

await upsertMany(db, USER_COLLECTION, data.users);
await upsertMany(db, GROUP_COLLECTION, data.groups);
await upsertMany(db, POST_COLLECTION, data.posts);
await upsertMany(db, CHAT_MESSAGE_COLLECTION, data.chatMessages);
await closeDatabase();

console.log("StudyCircle demo data was seeded successfully.");

