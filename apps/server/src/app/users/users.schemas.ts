import { UserIdSchema } from "@repo/dto/main.js";
import { z } from "zod";

export const UserIdParamSchema = z.object({
  id: UserIdSchema,
});
