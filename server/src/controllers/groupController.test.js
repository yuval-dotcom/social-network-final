import { describe, expect, it } from "vitest";
import { createGroupController } from "./groupController.js";

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

describe("group controller", () => {
  it("creates groups with the current user as owner", async () => {
    const controller = createGroupController({
      groups: {
        async create(db, input) {
          return input;
        }
      }
    });
    const res = createRes();

    await controller.create({ db: {}, body: { name: "Math" }, user: { sub: "u1" } }, res, () => {});

    expect(res.statusCode).toBe(201);
    expect(res.body.group.ownerId).toBe("u1");
  });

  it("blocks non-managers from updating groups", async () => {
    const controller = createGroupController({
      groups: {
        async findById() {
          return { id: "g1", managerIds: ["u1"], memberIds: ["u1"], pendingMemberIds: [] };
        }
      }
    });
    let error;

    await controller.update({ db: {}, params: { id: "g1" }, body: {}, user: { sub: "u2", role: "student" } }, createRes(), (nextError) => {
      error = nextError;
    });

    expect(error.status).toBe(403);
  });

  it("adds private group joins to pending requests", async () => {
    const controller = createGroupController({
      groups: {
        async findById() {
          return { id: "g1", privacy: "private", managerIds: ["u1"], memberIds: ["u1"], pendingMemberIds: [] };
        },
        async update(db, id, update) {
          return update;
        }
      }
    });
    const res = createRes();

    await controller.join({ db: {}, params: { id: "g1" }, user: { sub: "u2" } }, res, () => {});

    expect(res.body.status).toBe("pending");
    expect(res.body.group.pendingMemberIds).toEqual(["u2"]);
  });
});
