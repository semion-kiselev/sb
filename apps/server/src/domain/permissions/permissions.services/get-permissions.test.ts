import type { Database } from "better-sqlite3";
import { createTestDb } from "../../../db/create-test-db.js";
import { getPermissions } from "./get-permissions.js";

describe("get-permissions", () => {
  let db: Database;

  beforeAll(() => {
    db = createTestDb();
  });

  afterAll(() => {
    db.close();
  });

  it("should return permissions", () => {
    const result = getPermissions(db);
    const expectedResult = [
      { id: "UR", name: "Read users" },
      { id: "UM", name: "Manage users" },
    ];
    expect(result).toEqual(expectedResult);
  });
});
