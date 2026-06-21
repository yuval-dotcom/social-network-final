import { describe, expect, it } from "vitest";
import {
  createCorsOriginDelegate,
  getAllowedClientOrigins,
  isClientOriginAllowed
} from "./clientOrigins.js";

describe("client origin configuration", () => {
  it("allows both common Vite development origins", () => {
    expect(getAllowedClientOrigins()).toContain("http://localhost:5173");
    expect(getAllowedClientOrigins()).toContain("http://127.0.0.1:5173");
  });

  it("allows empty origins for same-origin and server-side requests", () => {
    expect(isClientOriginAllowed(undefined)).toBe(true);
  });

  it("rejects unknown browser origins", () => {
    expect(isClientOriginAllowed("http://example.com")).toBe(false);
  });

  it("uses the same delegate shape that Express and Socket.io expect", () => {
    const delegate = createCorsOriginDelegate();

    delegate("http://127.0.0.1:5173", (error, allowed) => {
      expect(error).toBeNull();
      expect(allowed).toBe(true);
    });

    delegate("http://example.com", (error, allowed) => {
      expect(error).toBeInstanceOf(Error);
      expect(allowed).toBeUndefined();
    });
  });
});
