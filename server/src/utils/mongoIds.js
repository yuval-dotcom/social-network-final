import { ObjectId } from "mongodb";

export function toDbId(id) {
  if (id instanceof ObjectId) {
    return id;
  }

  if (typeof id === "string" && ObjectId.isValid(id)) {
    return new ObjectId(id);
  }

  return id;
}

export function serializeDocument(document) {
  if (!document) {
    return null;
  }

  const { _id, ...rest } = document;

  return {
    id: _id ? String(_id) : undefined,
    ...rest
  };
}

