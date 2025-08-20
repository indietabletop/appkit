import "fake-indexeddb/auto";

import { afterEach, expect, test } from "vitest";
import { ModernIDB, deleteDatabase } from "../ModernIDB.ts";

const database = new ModernIDB<{ store: { foo: "bar" } }, { store: never }>({
  name: "test",
  version: 1,
  onInit({ manager }) {
    manager.createObjectStore("store");
  },
});

afterEach(async () => {
  database.close();
  await deleteDatabase("test");
});

test("opens database", async () => {
  const event = await database.open();
  expect(event.type).toBe("success");
});

test("re-opens database after close", async () => {
  await database.open();
  database.close();

  const event = await database.open();
  expect(event.type).toBe("success");
});

test("throws when already opening", async () => {
  const openTwice = async () => {
    await database.open();
    await database.open();
  };

  await expect(openTwice).rejects.toThrowError(/^Cannot open connection/);
});
