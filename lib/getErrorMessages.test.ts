import { getFailureMessages } from "./getErrorMessages.ts";

import { expect, test } from "vitest";

test("API Error: 404", () => {
  const result = getFailureMessages({ type: "API_ERROR", code: 404 });

  expect(result).toMatchObject({
    title: "Not found",
    description: "The link you have followed might be broken.",
  });
});

test("API Error: 500", () => {
  const result = getFailureMessages({ type: "API_ERROR", code: 500 });

  expect(result).toMatchObject({
    title: "Ooops, something went wrong",
    description: `This is probably an issue with our servers. You can try refreshing.`,
  });
});

test("API Error with partial override", () => {
  const result = getFailureMessages(
    { type: "API_ERROR", code: 404 },
    { 404: { title: `Army not found` } },
  );

  expect(result).toMatchObject({
    title: `Army not found`,
    description: "The link you have followed might be broken.",
  });
});

test("API Error with override", () => {
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

test("Network Error", () => {
  const result = getFailureMessages({ type: "NETWORK_ERROR" });

  expect(result).toMatchObject({
    title: "No connection",
    description: "Check your interent connection and try again.",
  });
});

test("Unknown Error", () => {
  const result = getFailureMessages({ type: "UNKNOWN_ERROR" });

  expect(result).toMatchObject({
    title: "Ooops, something went wrong",
    description: `This is probably an issue on our side. You can try refreshing.`,
  });
});

test("Any Error", () => {
  // Make sure this always returns something sensible...
  const result = getFailureMessages({ type: "FOO" as any });

  expect(result).toMatchObject({
    title: "Ooops, something went wrong",
    description: `This is probably an issue on our side. You can try refreshing.`,
  });
});
