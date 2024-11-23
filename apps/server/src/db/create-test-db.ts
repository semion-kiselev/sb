import Database from "better-sqlite3";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export const createTestDb = () => {
  const db = new Database(":memory:");

  // use __dirname instead of import.meta.dirname just for jest
  const migrationsPath = resolve(__dirname, "./migrations");
  const fileNames = readdirSync(migrationsPath);

  const sortedFileNames = fileNames
    .map((fileName) => {
      const fileId = +fileName.split(".")[0];
      return [fileId, fileName] as [number, string];
    })
    .sort((a, b) => a[0] - b[0]);

  for (const [, fileName] of sortedFileNames) {
    const content = readFileSync(resolve(migrationsPath, fileName), "utf8");
    db.exec(content);
  }

  return db;
};
