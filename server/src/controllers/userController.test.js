import { describe, expect, it } from "vitest";
import { createUserController } from "./userController.js";

function createRes() {
  return {
    body: undefined,
    json(payload) {
      this.body = payload;
    }
  };
}

describe("user controller", () => {
  it("lists and searches users", async () => {
    const controller = createUserController({
      users: {
        async list() {
          return [{ id: "u1" }];
        },
        async search(db, query) {
          return [{ id: "u2", major: query.major }];
        }
      }
    });
    const listRes = createRes();
    const searchRes = createRes();

    await controller.list({ db: {} }, listRes, () => {});
    await controller.search({ db: {}, query: { major: "CS" } }, searchRes, () => {});

    expect(listRes.body.users).toEqual([{ id: "u1" }]);
    expect(searchRes.body.users).toEqual([{ id: "u2", major: "CS" }]);
  });

  it("allows users to update only their own profile", async () => {
    const controller = createUserController({
      users: {
        async update() {
          return { id: "u1", displayName: "Dana" };
        }
      }
    });
    const res = createRes();

    await controller.update({ db: {}, params: { id: "u1" }, body: {}, user: { sub: "u1" } }, res);
    const updatePromise = controller.update({ db: {}, params: { id: "u2" }, body: {}, user: { sub: "u1" } }, createRes());

    expect(res.body.user).toEqual({ id: "u1", displayName: "Dana" });
    await expect(updatePromise).rejects.toHaveProperty("status", 403);
  });
});
