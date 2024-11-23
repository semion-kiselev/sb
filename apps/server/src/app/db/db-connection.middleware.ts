import { db } from "db/connection";
import { createMiddleware } from "hono/factory";
import type { EnvVariables } from "../@shared/types/env";

export const dbConnectionMiddleware = createMiddleware<{ Variables: EnvVariables }>(
  async (c, next) => {
    c.set("db", db);
    await next();
  }
);
