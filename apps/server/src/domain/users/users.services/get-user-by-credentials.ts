import bcrypt from "bcrypt";
import { db } from "db/connection.js";
import { toCamelCase } from "domain/@shared/utils/lib.js";
import type { User, UserWithPermissionsFromDb } from "domain/users/users.types.js";

const getUserByCredentialsSql = `
  SELECT id, name, email, created_at, updated_at, json_group_array(ep.permission_id) as permissions
  FROM employee
    JOIN employee_permission ep on employee.id = ep.employee_id
    WHERE email = ? AND password = ?
    GROUP BY id, name, email, created_at, updated_at;
`;

export const getUserByCredentials = async (login: string, password: string) => {
  if (!process.env.SALT_ROUNDS) {
    throw new Error("SALT_ROUNDS should exist in env");
  }
  const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);
  const user = db
    .prepare<[string, string], UserWithPermissionsFromDb>(getUserByCredentialsSql)
    .get(login, hashedPassword);
  if (!user) {
    return null;
  }
  return toCamelCase(user) as User;
};
