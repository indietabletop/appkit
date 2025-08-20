import { VersionChangeObjectStore } from "./ObjectStore.ts";
import { VersionChangeTransaction } from "./Transaction.ts";
import type { KeyPath, ModernIDBSchema } from "./types.ts";

export class VersionChangeManager<
  Schema extends ModernIDBSchema,
  IndexNames extends {
    [K in keyof Schema]?: string;
  } = never,
> {
  readonly idbDatabase: IDBDatabase;
  readonly event: IDBVersionChangeEvent;
  readonly transaction: VersionChangeTransaction<Schema, IndexNames>;

  constructor(props: {
    idbDatabase: IDBDatabase;
    event: IDBVersionChangeEvent;
    idbTransaction: IDBTransaction;
  }) {
    this.idbDatabase = props.idbDatabase;
    this.event = props.event;
    this.transaction = new VersionChangeTransaction({
      transaction: props.idbTransaction,
    });
  }

  /**
   * Creates a new object store with the given name and options and returns a new IDBObjectStore.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBDatabase/createObjectStore)
   */
  createObjectStore<StoreName extends string & keyof Schema>(
    name: StoreName,
    options?: {
      autoIncrement?: boolean;
      keyPath?:
        | KeyPath<Schema[StoreName]>
        | KeyPath<Schema[StoreName]>[]
        | null;
    },
  ) {
    const objectStore = this.idbDatabase.createObjectStore(name, options);
    return new VersionChangeObjectStore<
      Schema[StoreName],
      IndexNames[StoreName] extends string ? IndexNames[StoreName] : never
    >(objectStore);
  }

  /**
   * Deletes the object store with the given name.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/IDBDatabase/deleteObjectStore)
   */
  deleteObjectStore(name: string): void {
    this.idbDatabase.deleteObjectStore(name);
  }
}
