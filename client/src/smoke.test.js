import { describe, expect, it } from "vitest";
import { clientSmoke } from "./smoke.js";

describe("client smoke test", () => {
  it("confirms the client test runner is configured", () => {
    expect(clientSmoke()).toBe("client-ready");
  });
});
