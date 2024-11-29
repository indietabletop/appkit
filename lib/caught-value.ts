/**
 * Safely returns a string from an unknown value.
 *
 * This function is intended to be used when handling values caught
 * in try/catch blocks.
 *
 * In JS/TS, unless errors are returned, they cannot be properly typed
 * because any code within the try block can throw. Additionally, thrown
 * values do not have to be Errors.
 *
 * This function makes sure to first assert if an Error was caught, and
 * if so, returns its message. If a string was caught, it returns that.
 * Otherwise, it returns "Unknown error".
 */
export function caughtValueToString(value: unknown): string {
  if (value instanceof Error) {
    return value.message;
  }

  if (typeof value === "string") {
    return value;
  }

  return "Unknown error.";
}
