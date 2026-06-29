import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "./http.js";

describe("Native Fetch API layer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("sends requests through fetch", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });

    await apiRequest("/health");

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:4000/api/health",
      expect.objectContaining({
        method: "GET"
      })
    );
  });

  it("adds bearer token headers and JSON bodies", async () => {
    localStorage.setItem("studycircle_token", "abc123");
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });

    await apiRequest("/groups", { method: "POST", data: { name: "Math" } });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:4000/api/groups",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Math" }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer abc123"
        }
      })
    );
  });
});
