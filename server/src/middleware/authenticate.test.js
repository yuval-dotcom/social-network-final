import { describe, expect, it } from "vitest";
import { createAuthenticate } from "./authenticate.js";

describe("authenticate middleware", () => {
  it("requires bearer tokens", () => {
    const authenticate = createAuthenticate({});
    let error;

    authenticate({ headers: {} }, {}, (nextError) => {
      error = nextError;
    });

    expect(error.status).toBe(401);
  });

  it("stores verified token payload on req.user", () => {
    const authenticate = createAuthenticate({
      verifyToken() {
        return { sub: "u1", username: "dana" };
      }
    });
    const req = { headers: { authorization: "Bearer token" } };
    let called = false;

    authenticate(req, {}, () => {
      called = true;
    });

    expect(called).toBe(true);
    expect(req.user).toEqual({ sub: "u1", username: "dana" });
  });
});
