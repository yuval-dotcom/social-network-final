import { describe, expect, it } from "vitest";
import { createPostController } from "./postController.js";

function createRes() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
    }
  };
}

describe("post controller", () => {
  it("creates posts only for groups the user can access", async () => {
    const controller = createPostController({
      groups: {
        async findById() {
          return { id: "g1", privacy: "private", memberIds: ["u1"] };
        }
      },
      posts: {
        async create(db, input) {
          return input;
        }
      },
      users: {}
    });
    const res = createRes();

    await controller.create(
      { db: {}, body: { groupId: "g1", content: "hello" }, user: { sub: "u1" } },
      res,
      () => {}
    );

    expect(res.statusCode).toBe(201);
    expect(res.body.post.authorId).toBe("u1");
  });

  it("blocks post edits by other users", async () => {
    const controller = createPostController({
      posts: {
        async findById() {
          return { id: "p1", authorId: "u1" };
        }
      },
      groups: {},
      users: {}
    });

    const updatePromise = controller.update(
      { db: {}, params: { id: "p1" }, body: {}, user: { sub: "u2", role: "student" } },
      createRes()
    );

    await expect(updatePromise).rejects.toHaveProperty("status", 403);
  });

  it("builds a feed from friends and joined groups", async () => {
    const controller = createPostController({
      users: {
        async findById() {
          return { id: "u1", friendIds: ["u2"], groupIds: ["g1"] };
        }
      },
      posts: {
        async list() {
          return [
            { id: "p1", authorId: "u2", groupId: "g1" },
            { id: "p2", authorId: "u3", groupId: "g2" }
          ];
        }
      },
      groups: {
        async findById(db, id) {
          return id === "g1"
            ? { id: "g1", privacy: "public", memberIds: ["u1"] }
            : { id: "g2", privacy: "private", memberIds: ["u3"] };
        }
      }
    });
    const res = createRes();

    await controller.feed({ db: {}, user: { sub: "u1" } }, res, () => {});

    expect(res.body.posts).toEqual([{ id: "p1", authorId: "u2", groupId: "g1" }]);
  });
});
