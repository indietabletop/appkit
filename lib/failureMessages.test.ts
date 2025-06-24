import { describe, expect, test } from "vitest";
import {
  getFetchFailureMessages,
  getSubmitFailureMessage,
} from "./failureMessages.ts";

describe("getFetchFailureMessages", () => {
  test("Returns correct message for API_ERROR with code 404", () => {
    const result = getFetchFailureMessages({ type: "API_ERROR", code: 404 });

    expect(result).toMatchInlineSnapshot(`
      {
        "description": "The link you have followed might be broken.",
        "title": "Not found",
      }
    `);
  });

  test("Returns correct message for API_ERROR with code 500", () => {
    const result = getFetchFailureMessages({ type: "API_ERROR", code: 500 });

    expect(result).toMatchInlineSnapshot(`
      {
        "description": "This is probably an issue with our servers. You can try refreshing.",
        "title": "Ooops, something went wrong",
      }
    `);
  });

  test("Returns correct message for API_ERROR with partial override", () => {
    const result = getFetchFailureMessages(
      { type: "API_ERROR", code: 404 },
      { 404: { title: `Army not found` } },
    );

    expect(result).toMatchInlineSnapshot(`
      {
        "description": "The link you have followed might be broken.",
        "title": "Army not found",
      }
    `);
  });

  test("Returns correct message for API_ERROR with override", () => {
    const result = getFetchFailureMessages(
      { type: "API_ERROR", code: 404 },
      {
        404: {
          title: `Army not found`,
          description: `It might have been deleted.`,
        },
      },
    );

    expect(result).toMatchInlineSnapshot(`
      {
        "description": "It might have been deleted.",
        "title": "Army not found",
      }
    `);
  });

  test("Returns correct message for NETWORK_ERROR", () => {
    const result = getFetchFailureMessages({ type: "NETWORK_ERROR" });

    expect(result).toMatchInlineSnapshot(`
      {
        "description": "Check your interent connection and try again.",
        "title": "No connection",
      }
    `);
  });

  test("Returns correct message for UNKNOWN_ERROR", () => {
    const result = getFetchFailureMessages({ type: "UNKNOWN_ERROR" });

    expect(result).toMatchInlineSnapshot(`
      {
        "description": "This is probably an issue on our side. You can try refreshing.",
        "title": "Ooops, something went wrong",
      }
    `);
  });

  test("Returns correct message for an unrecognised error type", () => {
    const result = getFetchFailureMessages({ type: "FOO" as any });

    expect(result).toMatchInlineSnapshot(`
      {
        "description": "This is probably an issue on our side. You can try refreshing.",
        "title": "Ooops, something went wrong",
      }
    `);
  });
});

describe("getSubmitFailureMessage", () => {
  test("Returns correct message for API_ERROR with code 500", () => {
    const message = getSubmitFailureMessage({ type: "API_ERROR", code: 500 });
    expect(message).toMatchInlineSnapshot(
      `"Could not submit form due to an unexpected server error. Please refresh the page and try again."`,
    );
  });

  test("Returns correct message for API_ERROR with override", () => {
    const message = getSubmitFailureMessage(
      { type: "API_ERROR", code: 401 },
      { 401: `Username and password do not match. Please try again.` },
    );
    expect(message).toMatchInlineSnapshot(
      `"Username and password do not match. Please try again."`,
    );
  });

  test("Returns correct message for NETWORK_ERROR", () => {
    const result = getSubmitFailureMessage({ type: "NETWORK_ERROR" });

    expect(result).toMatchInlineSnapshot(
      `"Could not submit form due to network error. Make sure you are connected to the internet and try again."`,
    );
  });

  test("Returns correct message for UNKNOWN_ERROR", () => {
    const result = getSubmitFailureMessage({ type: "UNKNOWN_ERROR" });

    expect(result).toMatchInlineSnapshot(
      `"Could not submit form due to an unexpected error. Please refresh the page and try again."`,
    );
  });

  test("Returns correct message for an unrecognised error type", () => {
    const result = getSubmitFailureMessage({ type: "FOO" as any });

    expect(result).toMatchInlineSnapshot(
      `"Could not submit form due to an unexpected error. Please refresh the page and try again."`,
    );
  });
});
