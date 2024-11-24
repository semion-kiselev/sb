import type { EnvVariables } from "app/@shared/types/env.js";
import { db } from "db/connection.js";
import { createMiddleware } from "hono/factory";

export const dbConnectionMiddleware = createMiddleware<{ Variables: EnvVariables }>(
  async (c, next) => {
    c.set("db", db);
    await next();
  }
);
