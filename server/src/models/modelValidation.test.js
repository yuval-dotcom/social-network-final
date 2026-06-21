import { describe, expect, it } from "vitest";
import { buildGroupDocument, buildGroupSearchFilter, isGroupManager, isGroupMember } from "./groupModel.js";
import { buildPostDocument, buildPostSearchFilter, canEditPost } from "./postModel.js";
import { buildUserDocument, buildUserSearchFilter, publicUser } from "./userModel.js";

describe("core StudyCircle models", () => {
  it("builds a safe user document", () => {
    const user = buildUserDocument({
      username: " Dana ",
      passwordHash: "hash",
      displayName: "Dana Levi",
      major: "Computer Science"
    });

    expect(user.username).toBe("dana");
    expect(user.role).toBe("student");
    expect(publicUser(user).passwordHash).toBeUndefined();
  });

  it("builds group membership and manager fields", () => {
    const group = buildGroupDocument({
      name: "Algorithms",
      category: "Computer Science",
      ownerId: "u1",
      memberIds: ["u2"]
    });

    expect(isGroupManager(group, "u1")).toBe(true);
    expect(isGroupMember(group, "u2")).toBe(true);
    expect(group.privacy).toBe("public");
  });

  it("builds post documents and edit permissions", () => {
    const post = buildPostDocument({
      authorId: "u1",
      groupId: "g1",
      content: "Exam tips",
      tags: ["exam", "algorithms"]
    });

    expect(post.tags).toEqual(["exam", "algorithms"]);
    expect(canEditPost(post, "u1")).toBe(true);
    expect(canEditPost(post, "u2")).toBe(false);
  });

  it("requires important fields", () => {
    expect(() => buildUserDocument({ username: "", passwordHash: "x", displayName: "x" })).toThrow("username");
    expect(() => buildGroupDocument({ name: "x", category: "", ownerId: "u1" })).toThrow("category");
    expect(() => buildPostDocument({ authorId: "u1", groupId: "g1", content: "" })).toThrow("content");
  });

  it("builds search filters for the three official models", () => {
    expect(buildUserSearchFilter({ q: "dan", major: "CS" }).major).toBe("CS");
    expect(buildGroupSearchFilter({ category: "Math", privacy: "private" }).privacy).toBe("private");
    expect(buildPostSearchFilter({ groupId: "g1", authorId: "u1", tag: "exam" })).toMatchObject({
      groupId: "g1",
      authorId: "u1",
      tags: "exam"
    });
  });
});
