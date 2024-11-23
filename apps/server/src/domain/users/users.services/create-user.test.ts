import type { Database } from "better-sqlite3";
import { createTestDb } from "../../../db/create-test-db.js";
import { createUser } from "./create-user.js";

describe("create-user", () => {
  let db: Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it("create user", async () => {
    const userData = {
      name: "user1",
      email: "user1@mail.com",
      password: "123",
      permissions: ["UR", "UM"],
    };
    const result = await createUser(db, userData);

    expect(typeof result.id).toBe("number");
    expect(typeof result.createdAt).toBe("string");
    expect(typeof result.updatedAt).toBe("string");

    const expectedResult = {
      name: "user1",
      email: "user1@mail.com",
      permissions: ["UR", "UM"],
    };

    expect(result).toMatchObject(expectedResult);
  });
});
