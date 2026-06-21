import { describe, expect, it } from "vitest";
import { buildDemoData } from "./demoData.js";

describe("demo seed data", () => {
  it("creates enough demo records for the defense", async () => {
    const data = await buildDemoData();

    expect(data.users).toHaveLength(3);
    expect(data.groups).toHaveLength(2);
    expect(data.posts).toHaveLength(3);
    expect(data.chatMessages).toHaveLength(1);
    expect(data.users[0].passwordHash).not.toBe("demo123");
  });
});
