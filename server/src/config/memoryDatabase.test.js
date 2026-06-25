import { describe, expect, it } from "vitest";
import { USER_COLLECTION } from "../models/userModel.js";
import { createDemoMemoryDatabase } from "./memoryDatabase.js";

describe("demo memory database", () => {
  it("loads demo users for local UI verification", async () => {
    const db = await createDemoMemoryDatabase({
      hashPassword: async (password) => `hash:${password}`
    });

    const user = await db.collection(USER_COLLECTION).findOne({ _id: "user_dana" });

    expect(user).toMatchObject({
      _id: "user_dana",
      username: "dana",
      displayName: "Dana Levi",
      passwordHash: "hash:demo123"
    });
  });
});
