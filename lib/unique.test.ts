import { describe, expect, test } from "vitest";
import { uniqueBy } from "./unique.ts";

describe("unique", () => {
  test("Returns unique items based on getKey", () => {
    const result = uniqueBy(
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
