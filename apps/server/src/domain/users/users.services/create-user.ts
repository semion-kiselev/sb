import bcrypt from "bcrypt";
import type { Database } from "better-sqlite3";
import { insertUserPermissions } from "domain/@shared/utils/sql.js";
import type { CreateUserPayload, UserFromDb } from "domain/users/users.types.js";
import { normalizeUser } from "domain/users/users.utils.js";

const createUserSql = `
  INSERT INTO employee (name, email, password)
  VALUES (?, ?, ?)
  RETURNING *;
`;

export const createUser = async (
  db: Database,
  { name, email, password, permissions }: CreateUserPayload
) => {
  if (!process.env.SALT_ROUNDS) {
    throw new Error("SALT_ROUNDS should exist in env");
  }

  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

  return db.transaction(() => {
    const user = db
      .prepare<[string, string, string], UserFromDb>(createUserSql)
      .get(name, email, hashedPassword);

    if (!user) {
      throw new Error("User was not created");
    }

    insertUserPermissions(db, user.id, permissions);

    return normalizeUser({ ...user, permissions: JSON.stringify(permissions) });
  })();
};
