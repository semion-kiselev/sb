import type { Database } from "better-sqlite3";
import { createTestDb } from "db/create-test-db.js";
import { insertUserPermissions } from "domain/@shared/utils/sql.js";
import { deleteUser } from "domain/users/users.services/delete-user.js";

describe("delete-user", () => {
  let db: Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it("should raise not found", () => {
    const error = new Error("404");
    const raiseNotFound = jest.fn(() => {
      throw error;
    });

    try {
      deleteUser(db, 0, raiseNotFound);
    } catch (e) {
      expect(raiseNotFound).toThrow(error);
    }
  });

  it("should delete user by id", () => {
    const userId = db.transaction(() => {
      const { id } = db
        .prepare("INSERT INTO employee (name, email, password) VALUES (?, ?, ?) RETURNING id")
        .get("name", "e@mail.com", "123") as { id: number };

      const permissions = ["UR"];
      insertUserPermissions(db, id, permissions);
      return id;
    })();

    const error = new Error("404");
    const raiseNotFound = jest.fn(() => {
      throw error;
    });

    const result = deleteUser(db, userId, raiseNotFound);
    const expectedResult = { ok: true };
    expect(result).toEqual(expectedResult);
  });
});
