import type { InaccessibleDatabaseError } from "./types.ts";

export function toKnownError(error: unknown): InaccessibleDatabaseError {
  if (error instanceof Error) {
    switch (error.name) {
      case "OpenRequestBlockedError": {
        return {
          type: "UPGRADE_BLOCKED",
        };
      }

      case "VersionError": {
        return {
          type: "DB_VERSION_HIGHER_THAN_REQUESTED",
          message: error.message,
        };
      }

      default: {
        return {
          type: "UNKNOWN_ERROR",
          message: error.message,
        };
      }
    }
  }

  return {
    type: "UNKNOWN_ERROR",
    message: "A non-error object was thrown.",
  };
}
