import { describe, expect, it } from "vitest";
import { serverSmoke } from "./smoke.js";

describe("server smoke test", () => {
  it("confirms the server test runner is configured", () => {
    expect(serverSmoke()).toBe("server-ready");
  });
});
