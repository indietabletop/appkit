/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { ModernIDBError } from "./ModernIDBError.ts";
import { ObjectStore } from "./ObjectStore.ts";
import type {
  BlockingHandler,
  ModernIDBSchema,
  ModernIDBState,
  OpenRequestHandlers,
  TransactionMode,
  VersionChangeHandler,
} from "./types.ts";
import { openRequestToPromise, transactionToPromise } from "./utils.ts";
import { VersionChangeManager } from "./VersionChangeManager.ts";

export class TransactionEvent<StoreName extends string> extends CustomEvent<{
  storeNames: StoreName[];
}> {
  constructor(type: TransactionMode, storeNames: StoreName[]) {
    super(type, { detail: { storeNames } });
  }
}

type TransactionOptions = IDBTransactionOptions & {
  /**
   * Do not emit events when this transaction completes.
   */
  noEmit?: boolean;
};

type DatabaseProps = {
  name: string;
  version: number;
};

export class ModernIDB<
  Schema extends ModernIDBSchema,
  IndexNames extends { [K in keyof Schema]?: string },
> {
  readonly name: string;
  readonly version: number;

  protected state: ModernIDBState = "closed";
  protected idbDatabase: IDBDatabase | null = null;

  private eventTarget: EventTarget;
  private onBlocking?: BlockingHandler<Schema, IndexNames>;
  private onUpgrade?: VersionChangeHandler<Schema, IndexNames>;
  private onInit?: VersionChangeHandler<Schema, IndexNames>;

  constructor(props: DatabaseProps & OpenRequestHandlers<Schema, IndexNames>) {
    this.eventTarget = new EventTarget();
    this.name = props.name;
    this.version = props.version;

    this.onInit = props.onInit;
    this.onUpgrade = props.onUpgrade;
    this.onBlocking = props.onBlocking;
  }

  public addEventListener(
    type: TransactionMode,
    callback: (event: TransactionEvent<string & keyof Schema>) => void,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.eventTarget.addEventListener(
      type,

      // The EventTarget should only have events dispatched by ModernIDB,
      // meaning that it should be safe to assume that the event will be
      // a TransactionEvent.
      callback as EventListener,
      options,
    );
  }

  public removeEventListener(
    type: TransactionMode,
    callback: (event: TransactionEvent<string & keyof Schema>) => void,
    options?: boolean | EventListenerOptions,
  ): void {
    this.eventTarget.removeEventListener(
      type,

      // The EventTarget should only have events dispatched by ModernIDB,
      // meaning that it should be safe to assume that the event will be
      // a TransactionEvent.
      callback as EventListener,
      options,
    );
  }

  /**
   * Opens a connection to IndexedDB.
   *
   * ModernIDB instance must be in a `closed` state, otherwise an
   * `InvalidConnectionStateError` will be thrown.
   *
   * If the database needs to upgrade (i.e. supplied version is higher than
   * the current version), but there are existing connections that don't
   * close on `versionchange` event (the onBlocking handler), an
   * `OpenRequestBlockedError` will be thrown.
   *
   * Additional browser-specific exceptions can also be thrown. Make
   * sure to inspect any error's `name` property to differentiate
   * between the various types of errors that could occur.
   */
  async open(handlers?: OpenRequestHandlers<Schema, IndexNames>) {
    if (this.state !== "closed") {
      throw new ModernIDBError(
        "InvalidConnectionStateError",

        `Cannot open connection to database '${this.name}'. Instance must ` +
          `be in a 'closed' state in order to be opened, but current ` +
          `state is '${this.state}'.`,
      );
    }

    this.state = "opening";

    // Override handlers supplied in the constructor
    Object.assign(this, handlers);

    const handleInit = this.onInit;
    const handleBlocking = this.onBlocking;
    const handleUpgrade = this.onUpgrade;

    return new Promise<Event>((resolve, reject) => {
      try {
        const request = indexedDB.open(this.name, this.version);

        if (handleUpgrade || handleInit) {
          request.addEventListener(
            "upgradeneeded",
            (event) => {
              const idbDatabase = request.result;
              const idbTransaction = request.transaction!;

              const manager = new VersionChangeManager<Schema, IndexNames>({
                idbDatabase,
                idbTransaction,
                event,
              });

              try {
                if (event.oldVersion === 0) {
                  handleInit?.({ event, manager, db: this });
                } else {
                  handleUpgrade?.({ event, manager, db: this });
                }
              } catch (error) {
                console.error(error);
                idbTransaction.abort();
              }
            },
            { once: true },
          );
        }

        request.addEventListener(
          "blocked",
          () => {
            this.state = "closed";
            reject(
              new ModernIDBError(
                "OpenRequestBlockedError",

                `ModernIDB connection could not be opened because there ` +
                  `is an open connection preventing a 'versionchange' ` +
                  `transaction from being created.`,
              ),
            );
          },
          { once: true },
        );

        request.addEventListener(
          "success",
          (event) => {
            if (this.state === "opening") {
              const idb = request.result;
              this.idbDatabase = idb;

              if (handleBlocking) {
                this.idbDatabase.addEventListener("versionchange", (event) => {
                  handleBlocking({ event, db: this });
                });
              }

              this.state = "open";
              resolve(event);
            }
          },
          { once: true },
        );

        request.addEventListener(
          "error",
          () => {
            this.state = "closed";
            reject(request.error);
          },
          { once: true },
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  close() {
    this.state = "closed";

    this.idbDatabase?.close();
    this.idbDatabase = null;
  }

  isOpen(): this is this & { idbDatabase: IDBDatabase } {
    return !!this.idbDatabase;
  }

  private assertOpen(
    hint: string,
  ): asserts this is this & { idbDatabase: IDBDatabase } {
    if (!this.isOpen()) {
      throw new ModernIDBError("InvalidConnectionStateError", hint);
    }
  }

  transaction<StoreName extends string & keyof Schema>(
    name: StoreName,
    mode?: TransactionMode,
    options?: TransactionOptions,
  ): [
    ObjectStore<
      Schema[StoreName],
      IndexNames[StoreName] extends string ? IndexNames[StoreName] : never
    >,
    Promise<Event>,
  ];

  transaction<StoreNamesArray extends readonly (string & keyof Schema)[] | []>(
    names: StoreNamesArray,
    mode?: TransactionMode,
    options?: TransactionOptions,
  ): [
    {
      -readonly [Index in keyof StoreNamesArray]: ObjectStore<
        Schema[StoreNamesArray[Index]],
        IndexNames[StoreNamesArray[Index]] extends string
          ? IndexNames[StoreNamesArray[Index]]
          : never
      >;
    },
    Promise<Event>,
  ];

  transaction(
    nameOrNames: string | string[],
    mode?: TransactionMode,
    options?: TransactionOptions,
  ) {
    const transactionMode = mode ?? "readonly";

    this.assertOpen(
      `The "transaction" method can only be called on an instance that is ` +
        `in the "open" state, but current state is: "${this.state}".`,
    );

    const transaction = this.idbDatabase.transaction(
      nameOrNames,
      transactionMode,
      options,
    );
    const complete = transactionToPromise(transaction);

    if (!options?.noEmit) {
      // Generally, it is best practice to always attach then/catch handlers to
      // promises. However, in this case, these should be attached in user-code,
      // as it doesn't make sense to try to handle errors from here.
      //
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      complete.then((event) => {
        this.eventTarget.dispatchEvent(
          new TransactionEvent(
            transactionMode,
            Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames],
          ),
        );
        return event;
      });
    }

    if (Array.isArray(nameOrNames)) {
      const objectStores = nameOrNames.map(
        (name) => new ObjectStore(transaction.objectStore(name)),
      );
      return [objectStores, complete];
    }

    return [new ObjectStore(transaction.objectStore(nameOrNames)), complete];
  }

  async deleteFromStore(
    storeName: string & keyof Schema,
    query: IDBValidKey | IDBKeyRange,
    options?: IDBTransactionOptions,
  ) {
    const [store, done] = this.transaction(storeName, "readwrite", options);
    await Promise.all([store.delete(query), done]);
  }

  async getFromStore<StoreName extends string & keyof Schema>(
    storeName: StoreName,
    query: IDBValidKey | IDBKeyRange,
    options?: IDBTransactionOptions,
  ) {
    const [store, done] = this.transaction(storeName, "readonly", options);
    const [data] = await Promise.all([store.get(query), done]);
    return data;
  }

  async putToStore<StoreName extends string & keyof Schema>(
    storeName: StoreName,
    value: Schema[StoreName],
    key?: IDBValidKey,
  ) {
    const [store, done] = this.transaction(storeName, "readwrite");
    const [itemKey] = await Promise.all([store.put(value, key), done]);
    return itemKey;
  }
}

export function deleteDatabase(name: string) {
  return openRequestToPromise(indexedDB.deleteDatabase(name));
}
