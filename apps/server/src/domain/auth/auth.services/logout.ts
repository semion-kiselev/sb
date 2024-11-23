import type { Database } from "better-sqlite3";
import type { LogoutPayload } from "domain/auth/auth.types";

export const logout = (db: Database, { id }: LogoutPayload) => {
  db.prepare<number>("UPDATE employee SET token_expired_at=datetime() WHERE id = ?").run(id);
  return {};
};
