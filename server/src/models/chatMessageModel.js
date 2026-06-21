import { optionalText, requireText } from "../utils/modelValidation.js";

export const CHAT_MESSAGE_COLLECTION = "chatMessages";

export function buildChatMessageDocument(input) {
  return {
    roomId: requireText(input.roomId, "roomId"),
    senderId: requireText(input.senderId, "senderId"),
    recipientId: optionalText(input.recipientId),
    text: requireText(input.text, "text"),
    createdAt: input.createdAt || new Date()
  };
}

