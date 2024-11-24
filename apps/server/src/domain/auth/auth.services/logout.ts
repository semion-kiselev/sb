import type { Database } from "better-sqlite3";
import type { LogoutPayload } from "domain/auth/auth.types.js";

export const logout = (db: Database, { id }: LogoutPayload) => {
  db.prepare<number>(
    "UPDATE employee SET token_expired_at=datetime() WHERE id = ? RETURNING *"
  ).run(id);
  return { ok: true };
};
