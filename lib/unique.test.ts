import { describe, expect, test } from "vitest";
import { unique } from "./unique.ts";

describe("unique", () => {
  test("Returns unique items based on getKey", () => {
    const result = unique(
      [{ id: "zxcvbn" }, { id: "qwerty" }, { id: "zxcvbn" }],
      (item) => item.id,
    );

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "id": "zxcvbn",
        },
        {
          "id": "qwerty",
        },
      ]
    `);
  });
});
