import { db } from "db/connection";

const deleteUserSql = "DELETE FROM employee WHERE id = $1";

export const deleteUser = (id: number, raiseNotFound: () => never) => {
  const { changes } = db.prepare<number>(deleteUserSql).run(id);

  if (changes === 0) {
    raiseNotFound();
  }

  return { ok: true };
};
