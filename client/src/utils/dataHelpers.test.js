import { describe, expect, it } from "vitest";
import { indexById, splitCommaList } from "./dataHelpers.js";

describe("data helpers", () => {
  it("indexes records by id", () => {
    expect(indexById([{ id: "user_dana", name: "Dana" }])).toEqual({
      user_dana: { id: "user_dana", name: "Dana" }
    });
  });

  it("splits comma text into a clean list", () => {
    expect(splitCommaList("exam, graphs,  , dp")).toEqual(["exam", "graphs", "dp"]);
  });
});
