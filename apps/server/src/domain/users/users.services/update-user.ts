import bcrypt from "bcrypt";
import type { Database } from "better-sqlite3";
import { getUpdateSqlWithValues } from "domain/@shared/utils/sql.js";
import { getUserPermissions } from "domain/users/users.services/get-user-permissions.js";
import type { UpdateUserPayload, UserFromDb } from "domain/users/users.types.js";
import { normalizeUser } from "domain/users/users.utils.js";

const updateUserSql = "UPDATE employee SET %s WHERE id = ? RETURNING *";

const removeUserPermissionsSql = "DELETE FROM employee_permission WHERE employee_id = ?";

const addUserPermissionsSql =
  "INSERT INTO employee_permission (employee_id, permission_id) VALUES (?, ?)";

export const updateUser = async (
  db: Database,
  id: number,
  { name, email, password, permissions }: UpdateUserPayload,
  raiseNotFound: () => never
) => {
  if (!process.env.SALT_ROUNDS) {
    throw new Error("SALT_ROUNDS should exist in env");
  }

  const hashedPassword = password
    ? await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))
    : undefined;

  return db.transaction(() => {
    const [sql, values] = getUpdateSqlWithValues(updateUserSql, {
      name,
      email,
      password: hashedPassword,
      token_expired_at: permissions ? "datetime()" : undefined,
    });
    const updatedUser = db.prepare<unknown[], UserFromDb>(sql).get(...values, id);

    if (!updatedUser) {
      raiseNotFound();
    }

    if (permissions) {
      db.prepare<number>(removeUserPermissionsSql).run(id);

      const userPermissionsMap = permissions.map((p) => [id, p]);
      const insertPermissions = db.prepare(addUserPermissionsSql);
      userPermissionsMap.forEach((row) => {
        insertPermissions.run(...row);
      });
    }

    let currentPermissions: string[] = [];
    if (!permissions) {
      currentPermissions = getUserPermissions(db, id);
    }

    return normalizeUser({
      ...updatedUser,
      permissions: permissions || currentPermissions,
    });
  })();
};
