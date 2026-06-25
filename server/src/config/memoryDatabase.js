import bcrypt from "bcryptjs";
import { CHAT_MESSAGE_COLLECTION } from "../models/chatMessageModel.js";
import { GROUP_COLLECTION } from "../models/groupModel.js";
import { POST_COLLECTION } from "../models/postModel.js";
import { USER_COLLECTION } from "../models/userModel.js";
import { buildDemoData } from "../seed/demoData.js";

function matches(document, filter = {}) {
  return Object.entries(filter).every(([key, expected]) => {
    if (key === "$or") {
      return expected.some((option) => matches(document, option));
    }

    const actual = document[key];

    if (expected instanceof RegExp) {
      if (Array.isArray(actual)) {
        return actual.some((item) => expected.test(String(item)));
      }
      return expected.test(String(actual || ""));
    }

    if (expected && typeof expected === "object" && !(expected instanceof Date)) {
      if (expected.$gte && new Date(actual) < new Date(expected.$gte)) return false;
      if (expected.$lte && new Date(actual) > new Date(expected.$lte)) return false;
      return true;
    }

    if (Array.isArray(actual)) {
      return actual.includes(expected);
    }

    return actual === expected;
  });
}

function sortDocuments(documents, sortSpec = {}) {
  const [[field, direction] = []] = Object.entries(sortSpec);
  if (!field) return documents;

  return [...documents].sort((left, right) => {
    const leftValue = left[field] instanceof Date ? left[field].getTime() : left[field];
    const rightValue = right[field] instanceof Date ? right[field].getTime() : right[field];
    if (leftValue === rightValue) return 0;
    return leftValue > rightValue ? direction : -direction;
  });
}

function createMemoryCollection(initialDocuments = []) {
  let nextId = initialDocuments.length + 1;
  const documents = initialDocuments.map((document, index) => ({
    _id: document._id || `memory_${index + 1}`,
    ...document
  }));

  return {
    async insertOne(document) {
      const insertedId = `memory_${nextId++}`;
      documents.push({ _id: insertedId, ...document });
      return { insertedId };
    },

    async findOne(filter) {
      return documents.find((document) => matches(document, filter)) || null;
    },

    find(filter) {
      return {
        sort(sortSpec) {
          return {
            async toArray() {
              return sortDocuments(documents.filter((document) => matches(document, filter)), sortSpec);
            }
          };
        },
        async toArray() {
          return documents.filter((document) => matches(document, filter));
        }
      };
    },

    async findOneAndUpdate(filter, update) {
      const document = documents.find((item) => matches(item, filter));
      if (!document) return null;

      Object.assign(document, update.$set || {});
      return document;
    },

    async updateOne(filter, update, options = {}) {
      const document = documents.find((item) => matches(item, filter));
      if (document) {
        Object.assign(document, update.$set || {});
        return { matchedCount: 1, modifiedCount: 1, upsertedCount: 0 };
      }
      if (!options.upsert) {
        return { matchedCount: 0, modifiedCount: 0, upsertedCount: 0 };
      }

      documents.push({ ...filter, ...(update.$set || {}) });
      return { matchedCount: 0, modifiedCount: 0, upsertedCount: 1 };
    },

    async deleteOne(filter) {
      const index = documents.findIndex((document) => matches(document, filter));
      if (index === -1) return { deletedCount: 0 };

      documents.splice(index, 1);
      return { deletedCount: 1 };
    }
  };
}

export function createMemoryDb(seed = {}) {
  const collections = new Map();

  return {
    collection(name) {
      if (!collections.has(name)) {
        collections.set(name, createMemoryCollection(seed[name] || []));
      }

      return collections.get(name);
    }
  };
}

export async function createDemoMemoryDatabase({
  hashPassword = (password) => bcrypt.hash(password, 10)
} = {}) {
  const data = await buildDemoData({ hashPassword });

  return createMemoryDb({
    [USER_COLLECTION]: data.users,
    [GROUP_COLLECTION]: data.groups,
    [POST_COLLECTION]: data.posts,
    [CHAT_MESSAGE_COLLECTION]: data.chatMessages
  });
}
