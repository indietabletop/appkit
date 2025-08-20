import { ModernIDB } from "./ModernIDB.ts";
import { VersionChangeManager } from "./VersionChangeManager.ts";

/**
 * IDB supports "readonly", "readwrite", and "versionchange" transaction modes,
 * but "versionchange" can only be initiated automatically during DB upgrade.
 */
export type TransactionMode = "readonly" | "readwrite";

export type ModernIDBState = "open" | "opening" | "closed";

export type ModernIDBSchema = {
  [key: string]: unknown;
};

export type VersionChangeHandler<
  Schema extends ModernIDBSchema,
  IndexNames extends {
    [K in keyof Schema]?: string;
  },
> = (props: {
  event: IDBVersionChangeEvent;
  manager: VersionChangeManager<Schema, IndexNames>;
  db: ModernIDB<Schema, IndexNames>;
}) => void;

export type BlockingHandler<
  Schema extends ModernIDBSchema,
  IndexNames extends {
    [K in keyof Schema]?: string;
  },
> = (props: {
  event: IDBVersionChangeEvent;
  db: ModernIDB<Schema, IndexNames>;
}) => void;

export type OpenRequestHandlers<
  Schema extends ModernIDBSchema,
  IndexNames extends {
    [K in keyof Schema]?: string;
  },
> = {
  /**
   * If error is thrown inside the `onInit` handler, the version change
   * transaction will be aborted.
   */
  onInit?: VersionChangeHandler<Schema, IndexNames>;

  /**
   * If error is thrown inside the `onUpgrade` handler, the version change
   * transaction will be aborted.
   */
  onUpgrade?: VersionChangeHandler<Schema, IndexNames>;

  /**
   * If a new connection opens which requests a higher version number than
   * is the current version number, a `versionchange` event will be dispatched
   * on the IDBDatabase instance. This handler can specify desired behaviour.
   * For example, you might want to close currently connected connections
   * to allow the version change to proceed.
   */
  onBlocking?: BlockingHandler<Schema, IndexNames>;
};

type ValidKeyValue = string | number | Date;

export type KeyPath<T> = T extends { [key: string]: unknown }
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends ValidKeyValue
          ? `${K}`
          : `${K}.${KeyPath<T[K]>}`
        : never;
    }[keyof T]
  : never;

export type AnyModernIDB = ModernIDB<any, any>;
