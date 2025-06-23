import type { FailurePayload } from "./types.ts";

export function toKnownFailureMessage(failure: FailurePayload) {
  if (failure.type === "NETWORK_ERROR") {
    return "Could not submit form due to network error. Make sure you are connected to the internet and try again.";
  }

  return "Could not submit form due to an unexpected error. Please refresh the page and try again.";
}
