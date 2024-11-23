import type { Database } from "better-sqlite3";

const getUserTokenExpirationTimeSql = `SELECT token_expired_at FROM employee WHERE id = ?`;

export const getUserTokenExpirationTime = (db: Database, userId: number) => {
  const result = db
    .prepare<number, { token_expired_at: string }>(getUserTokenExpirationTimeSql)
    .get(userId);
  if (!result) {
    return null;
  }
  return Math.ceil(new Date(result.token_expired_at).getTime() / 1000);
};
