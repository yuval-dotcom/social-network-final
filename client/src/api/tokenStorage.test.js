import { afterEach, describe, expect, it } from "vitest";
import { clearToken, getStoredUser, getToken, saveSession } from "./tokenStorage.js";

describe("auth session storage", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("stores the auth token and current user together", () => {
    saveSession("token", { username: "dana", displayName: "Dana Levi" });

    expect(getToken()).toBe("token");
    expect(getStoredUser()).toEqual({ username: "dana", displayName: "Dana Levi" });
  });

  it("clears invalid stored user JSON", () => {
    localStorage.setItem("studycircle_user", "{broken");

    expect(getStoredUser()).toBeNull();
    expect(localStorage.getItem("studycircle_user")).toBeNull();
  });

  it("clears the full session", () => {
    saveSession("token", { username: "dana" });

    clearToken();

    expect(getToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });
});
