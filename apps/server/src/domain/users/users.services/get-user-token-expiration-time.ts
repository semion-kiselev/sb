import { db } from "db/connection.js";

const getUserTokenExpirationTimeSql = `SELECT token_expired_at FROM employee WHERE id = ?`;

export const getUserTokenExpirationTime = (userId: number) => {
  const result = db
    .prepare<number, { token_expired_at: string }>(getUserTokenExpirationTimeSql)
    .get(userId);
  if (!result) {
    return null;
  }
  return Math.ceil(new Date(result.token_expired_at).getTime() / 1000);
};
