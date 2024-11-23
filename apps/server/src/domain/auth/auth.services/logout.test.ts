import type { Database } from "better-sqlite3";
import { createTestDb } from "../../../db/create-test-db.js";
import { logout } from "./logout.js";

describe("logout", () => {
  let db: Database;

  beforeAll(() => {
    db = createTestDb();
  });

  afterAll(() => {
    db.close();
  });

  it("should update user token_expired_at field", () => {
    const { id } = db
      .prepare("INSERT INTO employee (name, email, password) VALUES (?, ?, ?) RETURNING id")
      .get("name", "e@mail.com", "123") as { id: number };

    logout(db, { id });

    const user = db.prepare("SELECT token_expired_at FROM employee WHERE id = ?").get(id) as {
      token_expired_at: string | null;
    };

    expect(typeof user.token_expired_at).toBe("string");
  });
});
