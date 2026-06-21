import { describe, expect, it } from "vitest";
import { CHAT_MESSAGE_COLLECTION } from "../models/chatMessageModel.js";
import { createFakeDb } from "../test/fakeDb.js";
import { chatMessageRepository } from "../repositories/chatMessageRepository.js";
import { createChatHandlers } from "./chatSocket.js";

describe("chat socket handlers", () => {
  it("stores and emits chat messages", async () => {
    const db = createFakeDb({ [CHAT_MESSAGE_COLLECTION]: [] });
    const handlers = createChatHandlers({ db, messages: chatMessageRepository });
    const emitted = [];

    const message = await handlers.sendMessage(
      { roomId: "room1", senderId: "u1", recipientId: "u2", text: "hello" },
      (roomId, savedMessage) => emitted.push({ roomId, savedMessage })
    );

    expect(message.text).toBe("hello");
    expect(emitted[0].roomId).toBe("room1");
    expect(await handlers.loadHistory("room1")).toHaveLength(1);
  });
});
