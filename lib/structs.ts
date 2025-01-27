import { boolean, enums, number, object, optional, string } from "superstruct";

export function currentUser() {
  return object({
    id: string(),
    email: string(),
    isVerified: boolean(),
    prefersScrollbarVisibility: optional(enums(["ALWAYS"])),
  });
}

export function sessionInfo() {
  return object({
    expiresTs: number(),
    createdTs: number(),
  });
}
