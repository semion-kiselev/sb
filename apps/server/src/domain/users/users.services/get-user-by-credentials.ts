import type { User, UserWithPermissionsFromDb } from "@repo/dto/main.js";
import bcrypt from "bcrypt";
import type { Database } from "better-sqlite3";
import { normalizeUser } from "domain/users/users.utils.js";

const getUserByCredentialsSql = `
  SELECT id, name, password, email, created_at, updated_at, json_group_array(ep.permission_id) as permissions
  FROM employee
    JOIN employee_permission ep on employee.id = ep.employee_id
    WHERE email = ?
    GROUP BY id, name, email, created_at, updated_at;
`;

export const getUserByCredentials = async (db: Database, login: string, password: string) => {
  if (!process.env.SALT_ROUNDS) {
    throw new Error("SALT_ROUNDS should exist in env");
  }

  const user = db.prepare<[string], UserWithPermissionsFromDb>(getUserByCredentialsSql).get(login);

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return normalizeUser(user) as User;
};
