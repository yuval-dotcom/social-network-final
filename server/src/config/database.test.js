import { afterEach, describe, expect, it } from "vitest";
import { closeDatabase, connectDatabase, getDb } from "./database.js";

class FakeMongoClient {
  constructor(uri, options = {}) {
    this.uri = uri;
    this.options = options;
    this.connected = false;
    this.closed = false;
  }

  async connect() {
    this.connected = true;
  }

  db(dbName) {
    return {
      name: dbName,
      clientUri: this.uri,
      options: this.options,
      connected: this.connected
    };
  }

  async close() {
    this.closed = true;
  }
}

describe("database connection", () => {
  afterEach(async () => {
    await closeDatabase();
  });

  it("requires MONGO_URI", async () => {
    await expect(connectDatabase({ uri: "" })).rejects.toThrow("MONGO_URI");
  });

  it("connects and stores the active db", async () => {
    const db = await connectDatabase({
      uri: "mongodb://example",
      dbName: "studycircle_test",
      serverSelectionTimeoutMS: 1234,
      MongoClientImpl: FakeMongoClient
    });

    expect(db).toEqual({
      name: "studycircle_test",
      clientUri: "mongodb://example",
      options: { serverSelectionTimeoutMS: 1234 },
      connected: true
    });
    expect(getDb()).toBe(db);
  });
});
