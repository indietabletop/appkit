import { getFailureMessages } from "./getErrorMessages.ts";

import { describe, expect, test } from "vitest";

describe("getFailureMessage", () => {
  test("Returns correct message for API_ERROR with code 404", () => {
    const result = getFailureMessages({ type: "API_ERROR", code: 404 });

    expect(result).toMatchObject({
      title: "Not found",
      description: "The link you have followed might be broken.",
    });
  });

  test("Returns correct message for API_ERROR with code 500", () => {
    const result = getFailureMessages({ type: "API_ERROR", code: 500 });

    expect(result).toMatchObject({
      title: "Ooops, something went wrong",
      description: `This is probably an issue with our servers. You can try refreshing.`,
    });
  });

  test("Returns correct message for API_ERROR with partial override", () => {
    const result = getFailureMessages(
      { type: "API_ERROR", code: 404 },
      { 404: { title: `Army not found` } },
    );

    expect(result).toMatchObject({
      title: `Army not found`,
      description: "The link you have followed might be broken.",
    });
  });

  test("Returns correct message for API_ERROR with override", () => {
    const result = getFailureMessages(
      { type: "API_ERROR", code: 404 },
      {
        404: {
          title: `Army not found`,
          description: `It might have been deleted.`,
        },
      },
    );

    expect(result).toMatchObject({
      title: `Army not found`,
      description: "It might have been deleted.",
    });
  });

  test("Returns correct message for NETWORK_ERROR", () => {
    const result = getFailureMessages({ type: "NETWORK_ERROR" });

    expect(result).toMatchObject({
      title: "No connection",
      description: "Check your interent connection and try again.",
    });
  });

  test("Returns correct message for UNKNOWN_ERROR", () => {
    const result = getFailureMessages({ type: "UNKNOWN_ERROR" });

    expect(result).toMatchObject({
      title: "Ooops, something went wrong",
      description: `This is probably an issue on our side. You can try refreshing.`,
    });
  });

  test("Returns correct message for an unrecognised error type", () => {
    // Make sure this always returns something sensible...
    const result = getFailureMessages({ type: "FOO" as any });

    expect(result).toMatchObject({
      title: "Ooops, something went wrong",
      description: `This is probably an issue on our side. You can try refreshing.`,
    });
  });
});
