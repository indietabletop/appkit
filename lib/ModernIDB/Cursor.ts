/* eslint-disable @typescript-eslint/no-unsafe-return */

import { requestToPromise } from "./utils.ts";

export class Cursor<C extends IDBCursor = IDBCursor> {
  idbCursor: C;

  constructor(idbCursor: C) {
    this.idbCursor = idbCursor;
  }

  get key() {
    return this.idbCursor.key;
  }

  get primaryKey() {
    return this.idbCursor.primaryKey;
  }

  get direction() {
    return this.idbCursor.direction;
  }

  /**
   * Advances the cursor through the next count records in range.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBCursor/advance
   */
  advance(count: number): void {
    this.idbCursor.advance(count);
  }
  /**
   * Advances the cursor to the next record in range.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBCursor/continue)
   */
  continue(key?: IDBValidKey): void {
    this.idbCursor.continue(key);
  }
}

export class CursorWithValue<Item> extends Cursor<IDBCursorWithValue> {
  get value(): Item {
    return this.idbCursor.value;
  }

  /**
   * Delete the record pointed at by the cursor.
   *
   * If successful, request's result will be undefined.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBCursor/delete)
   */
  delete(): Promise<undefined> {
    return requestToPromise(this.idbCursor.delete());
  }
  /**
   * Updated the record pointed at by the cursor with a new value.
   *
   * Throws a "DataError" DOMException if the effective object store uses in-line keys and the key would have changed.
   *
   * If successful, request's result will be the record's key.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBCursor/update)
   */
  update(value: Item): Promise<IDBValidKey> {
    return requestToPromise(this.idbCursor.update(value));
  }
}

export class IndexCursor extends Cursor {
  /**
   * Advances the cursor to the next record in range matching or after key and primaryKey. Throws an "InvalidAccessError" DOMException if the source is not an index.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBCursor/continuePrimaryKey)
   */
  continuePrimaryKey(key: IDBValidKey, primaryKey: IDBValidKey): void {
    this.idbCursor.continuePrimaryKey(key, primaryKey);
  }
}

export class IndexCursorWithValue<Item> extends CursorWithValue<Item> {
  /**
   * Advances the cursor to the next record in range matching or after key and primaryKey. Throws an "InvalidAccessError" DOMException if the source is not an index.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBCursor/continuePrimaryKey)
   */
  continuePrimaryKey(key: IDBValidKey, primaryKey: IDBValidKey): void {
    this.idbCursor.continuePrimaryKey(key, primaryKey);
  }
}
