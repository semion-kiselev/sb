import type { Database } from "better-sqlite3";
import { createTestDb } from "../../../db/create-test-db.js";
import { insertUserPermissions } from "../../@shared/utils/sql";
import { getUser } from "./get-user.js";

describe("get-user", () => {
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
      getUser(db, 0, raiseNotFound);
    } catch (e) {
      expect(raiseNotFound).toThrow(error);
    }
  });

  it("should find user by id", () => {
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

    const result = getUser(db, userId, raiseNotFound);

    expect(typeof result.createdAt).toBe("string");
    expect(typeof result.updatedAt).toBe("string");

    const expectedResult = {
      id: userId,
      name: "name",
      email: "e@mail.com",
      permissions: ["UR"],
    };

    expect(result).toMatchObject(expectedResult);
  });
});
