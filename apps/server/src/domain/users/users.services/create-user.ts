import bcrypt from "bcrypt";
import { db } from "db/connection.js";
import type { CreateUserPayload, UserFromDb } from "domain/users/users.types";
import { normalizeUser } from "domain/users/users.utils";

const createUserSql = `
  INSERT INTO employee (name, email, password)
  VALUES (?, ?, ?)
  RETURNING *;
`;

const addPermissionsSql = `
  INSERT INTO employee_permission (employee_id, permission_id) 
  VALUES (?, ?);
`;

export const createUser = async ({ name, email, password, permissions }: CreateUserPayload) => {
  if (!process.env.SALT_ROUNDS) {
    throw new Error("SALT_ROUNDS should exist in env");
  }

  const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);

  return db.transaction(() => {
    const user = db
      .prepare<[string, string, string], UserFromDb>(createUserSql)
      .get(name, email, hashedPassword);

    if (!user) {
      throw new Error("User was not created");
    }

    const userPermissionsMap = permissions.map((p) => [user.id, p]);

    const insertPermissions = db.prepare(addPermissionsSql);
    userPermissionsMap.forEach((row) => {
      insertPermissions.run(...row);
    });

    return normalizeUser({ ...user, permissions });
  })();
};
