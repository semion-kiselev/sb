import type { Database } from "better-sqlite3";

const deleteUserSql = "DELETE FROM employee WHERE id = ?";

export const deleteUser = (db: Database, id: number, raiseNotFound: () => never) => {
  const { changes } = db.prepare<number>(deleteUserSql).run(id);

  if (changes === 0) {
    raiseNotFound();
  }

  return { ok: true };
};
