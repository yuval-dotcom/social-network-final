import { describe, expect, it } from "vitest";
import { getHealth } from "./controllers/healthController.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { createApp } from "./app.js";
import { createFakeDb } from "./test/fakeDb.js";

describe("express app foundation", () => {
  it("returns health status", () => {
    let body;
    const res = {
      json(payload) {
        body = payload;
      }
    };

    getHealth({}, res);

    expect(body).toEqual({
      success: true,
      app: "StudyCircle",
      status: "ok"
    });
  });

  it("passes unknown routes to the error handler", () => {
    let capturedError;

    notFound(
      { method: "GET", originalUrl: "/api/missing-route" },
      {},
      (error) => {
        capturedError = error;
      }
    );

    expect(capturedError.status).toBe(404);
    expect(capturedError.message).toContain("Route not found");
  });

  it("returns JSON errors", () => {
    let statusCode;
    let body;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(payload) {
        body = payload;
      }
    };

    errorHandler({ status: 400, message: "Bad request" }, {}, res);

    expect(statusCode).toBe(400);
    expect(body).toEqual({
      success: false,
      message: "Bad request"
    });
  });

  it("creates the app with local development CORS enabled", () => {
    expect(() => createApp()).not.toThrow();
  });

  it("creates the full API app when a database is provided", () => {
    expect(() => createApp({ db: createFakeDb() })).not.toThrow();
  });
});
