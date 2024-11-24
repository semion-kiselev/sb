import type { Database } from "better-sqlite3";
import { createTestDb } from "db/create-test-db.js";
import { insertUserPermissions } from "domain/@shared/utils/sql.js";
import { getUsers } from "domain/users/users.services/get-users.js";

describe("get-users", () => {
  let db: Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it("should return users", () => {
    db.transaction(() => {
      const usersData = [
        { name: "user1", email: "user1@mail.com", password: "123", permissions: ["UR", "UM"] },
        { name: "user2", email: "user2@mail.com", password: "456", permissions: ["UR"] },
      ];

      const insert = db.prepare(
        "INSERT INTO employee (name, email, password) VALUES (?, ?, ?) RETURNING id"
      );

      usersData.forEach(({ name, email, password, permissions }) => {
        const { id } = insert.get(name, email, password) as { id: number };
        insertUserPermissions(db, id, permissions);
      });
    });

    const users = getUsers(db);

    users.forEach((user) => {
      expect(typeof user.createdAt).toBe("string");
      expect(typeof user.updatedAt).toBe("string");

      const expectedResult = {
        id: 1,
        name: "name",
        email: "e@mail.com",
        permissions: ["UR"],
      };

      expect(user).toMatchObject(expectedResult);
    });
  });
});
