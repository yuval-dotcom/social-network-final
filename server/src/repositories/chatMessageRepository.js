import { CHAT_MESSAGE_COLLECTION, buildChatMessageDocument } from "../models/chatMessageModel.js";
import { serializeDocument } from "../utils/mongoIds.js";

export const chatMessageRepository = {
  async create(db, input) {
    const document = buildChatMessageDocument(input);
    const result = await db.collection(CHAT_MESSAGE_COLLECTION).insertOne(document);
    return serializeDocument({ ...document, _id: result.insertedId });
  },

  async listByRoom(db, roomId) {
    const documents = await db
      .collection(CHAT_MESSAGE_COLLECTION)
      .find({ roomId })
      .sort({ createdAt: 1 })
      .toArray();

    return documents.map(serializeDocument);
  }
};

