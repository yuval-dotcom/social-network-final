import $ from "jquery";
import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "./http.js";

describe("jQuery Ajax API layer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("sends requests through $.ajax", async () => {
    const ajaxSpy = vi.spyOn($, "ajax").mockResolvedValue({ success: true });

    await apiRequest("/health");

    expect(ajaxSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "http://localhost:4000/api/health",
        method: "GET"
      })
    );
  });

  it("adds bearer token headers and JSON bodies", async () => {
    localStorage.setItem("studycircle_token", "abc123");
    const ajaxSpy = vi.spyOn($, "ajax").mockResolvedValue({ success: true });

    await apiRequest("/groups", { method: "POST", data: { name: "Math" } });

    expect(ajaxSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "http://localhost:4000/api/groups",
        method: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ name: "Math" }),
        headers: { Authorization: "Bearer abc123" }
      })
    );
  });

  it("does not send an auth header when token is disabled", async () => {
    localStorage.setItem("studycircle_token", "abc123");
    const ajaxSpy = vi.spyOn($, "ajax").mockResolvedValue({ success: true });

    await apiRequest("/auth/login", { method: "POST", data: { username: "dana" }, token: "" });

    expect(ajaxSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {},
        url: "http://localhost:4000/api/auth/login"
      })
    );
  });
});
