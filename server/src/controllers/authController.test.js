import { describe, expect, it } from "vitest";
import { createAuthController } from "./authController.js";

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

describe("auth controller", () => {
  it("returns register responses", async () => {
    const controller = createAuthController({
      async register() {
        return { user: { id: "u1", username: "dana" } };
      }
    });
    const res = createRes();

    await controller.register({ body: { username: "dana" } }, res, () => {});

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ success: true, user: { id: "u1", username: "dana" } });
  });

  it("returns login responses", async () => {
    const controller = createAuthController({
      async login() {
        return { user: { id: "u1" }, token: "token" };
      }
    });
    const res = createRes();

    await controller.login({ body: {} }, res, () => {});

    expect(res.body).toEqual({ success: true, user: { id: "u1" }, token: "token" });
  });

  it("returns current user from middleware", () => {
    const controller = createAuthController({});
    const res = createRes();

    controller.me({ user: { sub: "u1", username: "dana" } }, res);

    expect(res.body).toEqual({ success: true, user: { sub: "u1", username: "dana" } });
  });
});
