import { describe, expect, it } from "vitest";
import { GROUP_COLLECTION } from "../models/groupModel.js";
import { POST_COLLECTION } from "../models/postModel.js";
import { USER_COLLECTION } from "../models/userModel.js";
import { createFakeDb } from "../test/fakeDb.js";
import { groupRepository } from "./groupRepository.js";
import { postRepository } from "./postRepository.js";
import { userRepository } from "./userRepository.js";

describe("official model repositories", () => {
  it("creates, lists, searches, updates, and deletes users", async () => {
    const db = createFakeDb();
    const created = await userRepository.create(db, {
      username: "Dana",
      passwordHash: "hash",
      displayName: "Dana Levi",
      major: "Computer Science"
    });

    expect(created.passwordHash).toBeUndefined();
    expect(await userRepository.list(db)).toHaveLength(1);
    expect(await userRepository.search(db, { q: "dana", major: "Computer Science" })).toHaveLength(
      1
    );

    const updated = await userRepository.update(db, created.id, { bio: "Second year student" });
    expect(updated.bio).toBe("Second year student");
    expect(await userRepository.remove(db, created.id)).toBe(true);
    expect(await userRepository.list(db)).toHaveLength(0);
  });

  it("creates and searches groups", async () => {
    const db = createFakeDb();
    const created = await groupRepository.create(db, {
      name: "Algorithms Lab",
      category: "Computer Science",
      ownerId: "u1",
      privacy: "private"
    });

    expect(created.privacy).toBe("private");
    expect(
      await groupRepository.search(db, {
        category: "Computer Science",
        privacy: "private",
        memberId: "u1"
      })
    ).toHaveLength(1);
  });

  it("creates and searches posts", async () => {
    const db = createFakeDb({
      [GROUP_COLLECTION]: [],
      [USER_COLLECTION]: []
    });
    const created = await postRepository.create(db, {
      authorId: "u1",
      groupId: "g1",
      content: "Exam tips for algorithms",
      tags: ["exam", "algorithms"],
      createdAt: new Date("2026-06-01")
    });

    expect(created.content).toContain("Exam tips");
    expect(
      await postRepository.search(db, {
        q: "tips",
        groupId: "g1",
        authorId: "u1",
        tag: "exam",
        from: "2026-05-01",
        to: "2026-07-01"
      })
    ).toHaveLength(1);
  });

  it("keeps every official model in its own MongoDB collection", () => {
    expect(USER_COLLECTION).toBe("users");
    expect(GROUP_COLLECTION).toBe("groups");
    expect(POST_COLLECTION).toBe("posts");
  });
});
