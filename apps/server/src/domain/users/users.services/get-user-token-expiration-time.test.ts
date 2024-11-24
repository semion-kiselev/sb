import type { Database } from "better-sqlite3";
import { createTestDb } from "db/create-test-db.js";
import { insertUserPermissions } from "domain/@shared/utils/sql.js";
import { getUserTokenExpirationTime } from "domain/users/users.services/get-user-token-expiration-time.js";

describe("get-user-token-expiration-time", () => {
  let db: Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it("should return user token expiration time", () => {
    const tokenExpiredAt = "2020-08-09 14:00:00";

    const userId = db.transaction(() => {
      const { id } = db
        .prepare(
          "INSERT INTO employee (name, email, password, token_expired_at) VALUES (?, ?, ?, ?) RETURNING id"
        )
        .get("name", "e@mail.com", "123", tokenExpiredAt) as { id: number };

      const permissions = ["UR"];
      insertUserPermissions(db, id, permissions);
      return id;
    })();

    const result = getUserTokenExpirationTime(db, userId);
    const expectedResult = Math.ceil(new Date(tokenExpiredAt).getTime() / 1000);

    expect(result).toBe(expectedResult);
  });
});
