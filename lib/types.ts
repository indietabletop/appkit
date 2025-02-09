import type { Infer } from "superstruct";
import { currentUser, sessionInfo } from "./structs.js";

export type CurrentUser = Infer<ReturnType<typeof currentUser>>;

export type SessionInfo = Infer<ReturnType<typeof sessionInfo>>;

export type FailurePayload =
  | {
      type: "API_ERROR";
      code: number;
    }
  | {
      type: "NETWORK_ERROR" | "UNKNOWN_ERROR" | "VALIDATION_ERROR";
    };
