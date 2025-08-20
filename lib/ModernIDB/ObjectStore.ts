/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Cursor, CursorWithValue } from "./Cursor.ts";
import { ObjectStoreIndex } from "./ObjectStoreIndex.ts";
import type { KeyPath } from "./types.ts";
import { requestToAsyncGenerator, requestToPromise } from "./utils.ts";

export class ObjectStore<Item, IndexName extends string> {
  readonly idbObjectStore = IDBObjectStore["prototype"];

  constructor(objectStore: IDBObjectStore) {
    this.idbObjectStore = objectStore;
  }

  /**
   * Adds or updates a record in store with the given value and key.
   *
   * If the store uses in-line keys and key is specified a "DataError" DOMException will be thrown.
   *
   * If put() is used, any existing record with the key will be replaced. If add() is used, and if a record with the key already exists the request will fail, with request's error set to a "ConstraintError" DOMException.
   *
   * If successful, request's result will be the record's key.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/add)
   */
  add(value: Item, key?: IDBValidKey): Promise<IDBValidKey> {
    return requestToPromise(this.idbObjectStore.add(value, key));
  }
  /**
   * Deletes all records in store.
   *
   * If successful, request's result will be undefined.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/clear)
   */
  clear(): Promise<undefined> {
    return requestToPromise(this.idbObjectStore.clear());
  }
  /**
   * Retrieves the number of records matching the given key or key range in query.
   *
   * If successful, request's result will be the count.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/count)
   */
  count(query?: IDBValidKey | IDBKeyRange): Promise<number> {
    return requestToPromise(this.idbObjectStore.count(query));
  }
  /**
   * Deletes records in store with the given key or in the given key range in query.
   *
   * If successful, request's result will be undefined.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/delete)
   */
  delete(query: IDBValidKey | IDBKeyRange): Promise<undefined> {
    return requestToPromise(this.idbObjectStore.delete(query));
  }
  /**
   * Retrieves the value of the first record matching the given key or key range in query.
   *
   * If successful, request's result will be the value, or undefined if there was no matching record.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/get)
   */
  get(query: IDBValidKey | IDBKeyRange): Promise<Item | undefined> {
    return requestToPromise(this.idbObjectStore.get(query));
  }
  /**
   * Retrieves the values of the records matching the given key or key range in query (up to count if given).
   *
   * If successful, request's result will be an Array of the values.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/getAll)
   */
  getAll(
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number,
  ): Promise<Item[]> {
    return requestToPromise(this.idbObjectStore.getAll(query, count));
  }
  /**
   * Retrieves the keys of records matching the given key or key range in query (up to count if given).
   *
   * If successful, request's result will be an Array of the keys.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/getAllKeys)
   */
  getAllKeys(
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number,
  ): Promise<IDBValidKey[]> {
    return requestToPromise(this.idbObjectStore.getAllKeys(query, count));
  }
  /**
   * Retrieves the key of the first record matching the given key or key range in query.
   *
   * If successful, request's result will be the key, or undefined if there was no matching record.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/getKey)
   */
  getKey(query: IDBValidKey | IDBKeyRange): Promise<IDBValidKey | undefined> {
    return requestToPromise(this.idbObjectStore.getKey(query));
  }

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/index) */
  index(name: IndexName): ObjectStoreIndex<Item> {
    const idbIndex = this.idbObjectStore.index(name);
    return new ObjectStoreIndex(idbIndex);
  }

  /**
   * Opens a cursor over the records matching query, ordered by direction. If query is null, all records in store are matched.
   */
  async *openCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): AsyncGenerator<CursorWithValue<Item>, void, undefined> {
    const idbCursorGenerator = requestToAsyncGenerator(
      this.idbObjectStore.openCursor(query, direction),
    );

    for await (const idbCursor of idbCursorGenerator) {
      yield new CursorWithValue<Item>(idbCursor);
    }
  }

  /**
   * Opens a cursor with key only flag set over the records matching query, ordered by direction. If query is null, all records in store are matched.
   */
  async *openKeyCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): AsyncGenerator<Cursor, void, undefined> {
    const idbCursorGenerator = requestToAsyncGenerator(
      this.idbObjectStore.openCursor(query, direction),
    );

    for await (const idbCursor of idbCursorGenerator) {
      yield new Cursor(idbCursor);
    }
  }

  /**
   * Adds or updates a record in store with the given value and key.
   *
   * If the store uses in-line keys and key is specified a "DataError" DOMException will be thrown.
   *
   * If put() is used, any existing record with the key will be replaced. If add() is used, and if a record with the key already exists the request will fail, with request's error set to a "ConstraintError" DOMException.
   *
   * If successful, request's result will be the record's key.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/put)
   */
  put(value: Item, key?: IDBValidKey): Promise<IDBValidKey> {
    return requestToPromise(this.idbObjectStore.put(value, key));
  }
}

export class VersionChangeObjectStore<
  Item,
  IndexName extends string,
> extends ObjectStore<Item, IndexName> {
  /**
   * Creates a new index in store with the given name, keyPath and options and returns a new IDBIndex. If the keyPath and options define constraints that cannot be satisfied with the data already in store the upgrade transaction will abort with a "ConstraintError" DOMException.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/createIndex)
   */
  createIndex(
    name: IndexName,
    keyPath: KeyPath<Item> | KeyPath<Item>[],
    options?: IDBIndexParameters,
  ): ObjectStoreIndex<Item> {
    const idbIndex = this.idbObjectStore.createIndex(name, keyPath, options);
    return new ObjectStoreIndex(idbIndex);
  }

  /**
   * Deletes the index in store with the given name.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/deleteIndex)
   */
  deleteIndex(name: IndexName): void {
    this.idbObjectStore.deleteIndex(name);
  }

  renameIndex(currentName: string, newName: IndexName) {
    const index = this.idbObjectStore.index(currentName);
    this.idbObjectStore.createIndex(newName, index.keyPath, {
      multiEntry: index.multiEntry,
      unique: index.unique,
    });
    this.idbObjectStore.deleteIndex(currentName);
  }
}
