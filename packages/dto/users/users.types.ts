import {
  CreateUserPayloadSchema,
  UpdateUserPayloadSchema,
} from "./users.schemas.js";
import { z } from "zod";

export type User = {
  id: number;
  name: string;
  email: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
};

export type UserFromDb = {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  token_expired_at: string;
};

export type UserWithPermissionsFromDb = {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  token_expired_at: string;
  permissions: string; // json array
};

export type CreateUserPayload = z.infer<typeof CreateUserPayloadSchema>;
export type UpdateUserPayload = z.infer<typeof UpdateUserPayloadSchema>;
