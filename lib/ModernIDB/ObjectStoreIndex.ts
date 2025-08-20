/* eslint-disable @typescript-eslint/no-unsafe-return */

import { IndexCursor, IndexCursorWithValue } from "./Cursor.ts";
import { requestToAsyncGenerator, requestToPromise } from "./utils.ts";

export class ObjectStoreIndex<Item> {
  readonly idbIndex = IDBIndex["prototype"];

  constructor(idbIndex: IDBIndex) {
    this.idbIndex = idbIndex;
  }

  /**
   * Retrieves the number of records matching the given key or key range in query.
   *
   * If successful, request's result will be the count.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/count)
   */
  count(query?: IDBValidKey | IDBKeyRange): Promise<number> {
    return requestToPromise(this.idbIndex.count(query));
  }

  /**
   * Retrieves the value of the first record matching the given key or key range in query.
   *
   * If successful, request's result will be the value, or undefined if there was no matching record.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/get)
   */
  get(query: IDBValidKey | IDBKeyRange): Promise<Item | undefined> {
    return requestToPromise(this.idbIndex.get(query));
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
    return requestToPromise(this.idbIndex.getAll(query, count));
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
    return requestToPromise(this.idbIndex.getAllKeys(query, count));
  }
  /**
   * Retrieves the key of the first record matching the given key or key range in query.
   *
   * If successful, request's result will be the key, or undefined if there was no matching record.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBObjectStore/getKey)
   */
  getKey(query: IDBValidKey | IDBKeyRange): Promise<IDBValidKey | undefined> {
    return requestToPromise(this.idbIndex.getKey(query));
  }

  /**
   * Opens a cursor over the records matching query, ordered by direction. If query is null, all records in store are matched.
   */
  async *openCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): AsyncGenerator<IndexCursorWithValue<Item>, void, undefined> {
    const idbCursorGenerator = requestToAsyncGenerator(
      this.idbIndex.openCursor(query, direction),
    );

    for await (const idbCursor of idbCursorGenerator) {
      yield new IndexCursorWithValue<Item>(idbCursor);
    }
  }

  /**
   * Opens a cursor with key only flag set over the records matching query, ordered by direction. If query is null, all records in store are matched.
   */
  async *openKeyCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection,
  ): AsyncGenerator<IndexCursor, void, undefined> {
    const idbCursorGenerator = requestToAsyncGenerator(
      this.idbIndex.openCursor(query, direction),
    );

    for await (const idbCursor of idbCursorGenerator) {
      yield new IndexCursor(idbCursor);
    }
  }
}
