import bcrypt from "bcrypt";
import type { Database } from "better-sqlite3";
import { createTestDb } from "db/create-test-db.js";
import { insertUserPermissions } from "domain/@shared/utils/sql.js";
import { getUserByCredentials } from "domain/users/users.services/get-user-by-credentials.js";

describe("get-user-by-credentials", () => {
  let db: Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it("should return null if user not found", async () => {
    const result = await getUserByCredentials(db, "fake@mail.com", "fakePassword");
    expect(result).toBeNull();
  });

  it("should return null if password is not correct", async () => {
    const email = "e@mail.com";
    const password = "123";
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

    db.transaction(() => {
      const { id } = db
        .prepare("INSERT INTO employee (name, email, password) VALUES (?, ?, ?) RETURNING id")
        .get("name", email, hashedPassword) as { id: number };

      const permissions = ["UR"];
      insertUserPermissions(db, id, permissions);
      return id;
    })();

    const result = await getUserByCredentials(db, email, "fakePassword");
    expect(result).toBeNull();
  });

  it("should return user permissions by user id", async () => {
    const email = "e@mail.com";
    const password = "123";
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

    const userId = db.transaction(() => {
      const { id } = db
        .prepare("INSERT INTO employee (name, email, password) VALUES (?, ?, ?) RETURNING id")
        .get("name", email, hashedPassword) as { id: number };

      const permissions = ["UR"];
      insertUserPermissions(db, id, permissions);
      return id;
    })();

    const result = await getUserByCredentials(db, email, password);

    expect(typeof result!.createdAt).toBe("string");
    expect(typeof result!.updatedAt).toBe("string");

    const expectedResult = {
      id: userId,
      name: "name",
      email: "e@mail.com",
      permissions: ["UR"],
    };

    expect(result).toMatchObject(expectedResult);
  });
});
