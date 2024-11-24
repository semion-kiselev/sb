import type { EnvVariables } from "app/@shared/types/env.js";
import { auth } from "app/auth/auth.routes.js";
import { dbConnectionMiddleware } from "app/db/db-connection.middleware.js";
import { permissions } from "app/permissions/permissions.routes.js";
import { users } from "app/users/users.routes.js";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { getReasonPhrase } from "http-status-codes";

// todo: think of bd migration on `build` or `serve` scripts

export const app = new Hono<{ Variables: EnvVariables }>();

app.use(dbConnectionMiddleware);

app.route("/auth", auth);
app.route("/users", users);
app.route("/permissions", permissions);

app.onError((err, c) => {
  console.error("error ", JSON.parse(JSON.stringify(err)));
  console.error(`error message "${err.message}"`);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  if ("code" in err && err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    return c.json({ message: getReasonPhrase(409) }, 409);
  }

  if ("code" in err && err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
    return c.json({ message: getReasonPhrase(400) }, 400);
  }

  return c.json({ message: getReasonPhrase(500) }, 500);
});
