import { describe, expect, test } from "vitest";
import {
  appendCopyToText,
  maybeAppendCopyToText,
} from "../lib/append-copy-to-text";

describe("appendCopyToText", () => {
  test("Appends ' (Copy)' to provided string", () => {
    const returnValue = appendCopyToText("Zangrad Raiders");
    expect(returnValue).toBe("Zangrad Raiders (Copy)");
  });

  test("Adds a copy count number if string already ends in ' (Copy)'", () => {
    const returnValue = appendCopyToText("Zangrad Raiders (Copy)");
    expect(returnValue).toBe("Zangrad Raiders (Copy 2)");
  });

  test("Increments a copy count number if one already exists", () => {
    const returnValue = appendCopyToText("Zangrad Raiders (Copy 2)");
    expect(returnValue).toBe("Zangrad Raiders (Copy 3)");
  });
});

describe("maybeAppendCopyToText", () => {
  test("Ignores empty strings", () => {
    const returnValue = maybeAppendCopyToText("");
    expect(returnValue).toBe("");
  });
});
