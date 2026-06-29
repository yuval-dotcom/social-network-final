import { describe, expect, it } from "vitest";
import { USER_COLLECTION } from "../models/userModel.js";
import { createFakeDb } from "../test/fakeDb.js";
import { createAuthService } from "./authService.js";

describe("auth service", () => {
  it("registers a user with a hashed password", async () => {
    const db = createFakeDb();
    const auth = createAuthService({ db, jwtSecret: "test-secret" });

    const result = await auth.register({
      username: "Dana",
      password: "secret123",
      displayName: "Dana Levi"
    });

    expect(result.user.username).toBe("dana");
    expect(result.user.passwordHash).toBeUndefined();
    expect(db.collection(USER_COLLECTION).all()[0].passwordHash).not.toBe("secret123");
  });

  it("rejects duplicate usernames", async () => {
    const db = createFakeDb();
    const auth = createAuthService({ db, jwtSecret: "test-secret" });

    await auth.register({ username: "dana", password: "secret123", displayName: "Dana" });

    await expect(
      auth.register({ username: "Dana", password: "secret123", displayName: "Dana" })
    ).rejects.toMatchObject({
      status: 409
    });
  });

  it("logs in with valid credentials and rejects invalid credentials", async () => {
    const db = createFakeDb();
    const auth = createAuthService({ db, jwtSecret: "test-secret" });

    await auth.register({ username: "dana", password: "secret123", displayName: "Dana" });

    const login = await auth.login({ username: "dana", password: "secret123" });
    expect(login.token).toBeTruthy();
    expect(login.user.passwordHash).toBeUndefined();

    await expect(
      auth.login({ username: "dana", password: "wrong-password" })
    ).rejects.toMatchObject({
      status: 401
    });
  });

  it("verifies a valid token", async () => {
    const db = createFakeDb();
    const auth = createAuthService({ db, jwtSecret: "test-secret" });

    await auth.register({ username: "dana", password: "secret123", displayName: "Dana" });
    const login = await auth.login({ username: "dana", password: "secret123" });

    expect(auth.verifyToken(login.token)).toMatchObject({
      username: "dana",
      role: "student"
    });
  });
});
