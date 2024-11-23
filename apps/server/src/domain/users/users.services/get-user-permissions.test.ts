import type { Database } from "better-sqlite3";
import { createTestDb } from "db/create-test-db.js";
import { insertUserPermissions } from "domain/@shared/utils/sql.js";
import { getUserPermissions } from "domain/users/users.services/get-user-permissions";

describe("get-user-permissions", () => {
  let db: Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it("should return user permissions by user id", () => {
    const userId = db.transaction(() => {
      const { id } = db
        .prepare("INSERT INTO employee (name, email, password) VALUES (?, ?, ?) RETURNING id")
        .get("name", "e@mail.com", "123") as { id: number };

      const permissions = ["UR", "UM"];
      insertUserPermissions(db, id, permissions);
      return id;
    })();

    const result = getUserPermissions(db, userId);

    const expectedResult = ["UR", "UM"];

    expect(result.length).toBe(2);
    expect(result).toEqual(expect.arrayContaining(expectedResult));
  });
});
