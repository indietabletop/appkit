import { ObjectStore, VersionChangeObjectStore } from "./ObjectStore.ts";
import type { ModernIDBSchema } from "./types.ts";

export class Transaction<
  Schema extends ModernIDBSchema,
  IndexNames extends {
    [K in keyof Schema]?: string;
  },
> {
  idbTransaction: IDBTransaction;

  constructor(props: { transaction: IDBTransaction }) {
    this.idbTransaction = props.transaction;
  }

  objectStore<StoreName extends string & keyof Schema>(
    name: StoreName,
  ): ObjectStore<
    Schema[StoreName],
    IndexNames[StoreName] extends string ? IndexNames[StoreName] : never
  > {
    return new ObjectStore(this.idbTransaction.objectStore(name));
  }
}

export class VersionChangeTransaction<
  Schema extends ModernIDBSchema,
  IndexNames extends {
    [K in keyof Schema]?: string;
  },
> extends Transaction<Schema, IndexNames> {
  override objectStore<StoreName extends string & keyof Schema>(
    name: StoreName,
  ): VersionChangeObjectStore<
    Schema[StoreName],
    IndexNames[StoreName] extends string ? IndexNames[StoreName] : never
  > {
    return new VersionChangeObjectStore(this.idbTransaction.objectStore(name));
  }
}
