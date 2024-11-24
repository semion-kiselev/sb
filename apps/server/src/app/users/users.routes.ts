import { raiseNotFound } from "app/@shared/errors/main.js";
import type { EnvVariables } from "app/@shared/types/env.js";
import { applyValidation } from "app/@shared/utils/apply-validation.js";
import { authGuard } from "app/auth/auth-guard.middleware.js";
import { UserIdParamSchema } from "app/users/users.schemas.js";
import { Permission } from "domain/auth/auth.constants.js";
import { CreateUserPayloadSchema, UpdateUserPayloadSchema } from "domain/users/users.schemas.js";
import { createUser } from "domain/users/users.services/create-user.js";
import { deleteUser } from "domain/users/users.services/delete-user.js";
import { getUser } from "domain/users/users.services/get-user.js";
import { getUsers } from "domain/users/users.services/get-users.js";
import { updateUser } from "domain/users/users.services/update-user.js";
import { Hono } from "hono";
import { validator } from "hono/validator";

export const users = new Hono<{ Variables: EnvVariables }>();

users.on("GET", "*", authGuard([Permission.UR]));
users.on(["POST", "PUT", "PATCH", "DELETE"], "*", authGuard([Permission.UR, Permission.UM]));

users.get("/", (c) => {
  const users = getUsers(c.var.db);
  return c.json(users);
});

users.get(
  "/:id",
  validator("param", (value) =>
    applyValidation({ ...value, id: Number(value.id) }, UserIdParamSchema)
  ),
  (c) => {
    const { id } = c.req.valid("param");
    const user = getUser(c.var.db, id, raiseNotFound);
    return c.json(user);
  }
);

users.post(
  "/",
  validator("json", (value) => applyValidation(value, CreateUserPayloadSchema)),
  async (c) => {
    const payload = c.req.valid("json");
    const user = await createUser(c.var.db, payload);
    return c.json(user);
  }
);

users.put(
  "/:id",
  validator("param", (value) =>
    applyValidation({ ...value, id: Number(value.id) }, UserIdParamSchema)
  ),
  validator("json", (value) => applyValidation(value, UpdateUserPayloadSchema)),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");
    const user = await updateUser(c.var.db, id, payload, raiseNotFound);
    return c.json(user);
  }
);

users.delete(
  "/:id",
  validator("param", (value) =>
    applyValidation({ ...value, id: Number(value.id) }, UserIdParamSchema)
  ),
  (c) => {
    const { id } = c.req.valid("param");
    const result = deleteUser(c.var.db, id, raiseNotFound);
    return c.json(result);
  }
);
