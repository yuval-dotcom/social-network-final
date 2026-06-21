import { afterEach, describe, expect, it } from "vitest";
import { closeDatabase, connectDatabase, getDb } from "./database.js";

class FakeMongoClient {
  constructor(uri) {
    this.uri = uri;
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
      MongoClientImpl: FakeMongoClient
    });

    expect(db).toEqual({
      name: "studycircle_test",
      clientUri: "mongodb://example",
      connected: true
    });
    expect(getDb()).toBe(db);
  });
});
