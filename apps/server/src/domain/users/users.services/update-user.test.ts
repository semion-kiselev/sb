import bcrypt from "bcrypt";
import type { Database } from "better-sqlite3";
import { createTestDb } from "db/create-test-db.js";
import { omit } from "domain/@shared/utils/lib.js";
import { insertUserPermissions } from "domain/@shared/utils/sql";
import type { UserFromDb } from "../users.types.js";
import { updateUser } from "./update-user.js";

describe("update-user", () => {
  let db: Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it("should raise not found", async () => {
    const error = new Error("404");
    const raiseNotFound = jest.fn(() => {
      throw error;
    });

    try {
      await updateUser(db, 0, {}, raiseNotFound);
    } catch (e) {
      expect(raiseNotFound).toThrow(error);
    }
  });

  it("should update user by id", async () => {
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

    const updateValues = {
      name: "xxx",
      email: "new@mail.com",
      password: "456",
      permissions: ["UR", "UM"],
    };

    const result = await updateUser(db, userId, updateValues, raiseNotFound);

    const expectedResult = {
      id: userId,
      ...omit(updateValues, ["password"]),
    };

    expect(result).toMatchObject(expectedResult);

    const updatedUser = db
      .prepare<number, UserFromDb>("SELECT * FROM employee WHERE id = ?")
      .get(userId);

    const isUpdatedPasswordCorrect = await bcrypt.compare(
      updateValues.password,
      updatedUser!.password
    );

    expect(isUpdatedPasswordCorrect).toBe(true);

    expect(typeof updatedUser!.token_expired_at).toBe("string");
  });
});
