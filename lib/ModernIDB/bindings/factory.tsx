import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Failure, isAsyncOp, Pending, Success } from "../../async-op.ts";
import { caughtValueToString } from "../../caught-value.ts";
import { useAsyncOp } from "../../use-async-op.ts";
import type { AnyModernIDB } from "../types.ts";
import type {
  DatabaseOpenRequestOp,
  FlattenSuccessOps,
  InaccessibleDatabaseError,
  QueryOp,
} from "./types.ts";
import { toKnownError } from "./utils.tsx";

export function createDatabaseBindings<T extends AnyModernIDB>(db: T) {
  const DatabaseContext = createContext(db);

  const DatabaseOpenRequest = createContext<DatabaseOpenRequestOp<T>>(
    new Pending(),
  );

  const cache = new Map<string, unknown>();

  /**
   * Performs an IndexedDB query and watches for changes.
   *
   * Note that queries will only be executed once IndexedDB is open.
   *
   * If query output is an AsyncOp, it will be flattened. In other words, you
   * will only get one 'layer' of async ops.
   *
   * Provide a cache key if you want to make sure that data is synchronously
   * available during mounts/unmounts.
   */
  function useQuery<Output>(
    /**
     * `query` must have stable identity.
     *
     * Make sure you use `useCallback` or a module-scoped function.
     */
    query: (db: T) => Promise<Output>,

    cacheKey?: string,
  ): FlattenSuccessOps<QueryOp<Output>> {
    const openRequest = useDatabaseOpenRequest();
    const [queryOp, setOp] = useState<QueryOp<Output>>(new Pending());

    useEffect(() => {
      async function runQuery(): Promise<void> {
        if (openRequest.isSuccess) {
          try {
            const data = await query(openRequest.value);
            const success = new Success(data);
            setOp(success);

            if (cacheKey) {
              cache.set(cacheKey, success);
            }
          } catch (error) {
            const failure = new Failure({
              type: "QUERY_ERROR" as const,
              error: caughtValueToString(error),
            });

            setOp(failure);
            if (cacheKey) {
              cache.set(cacheKey, failure);
            }
          }
        }
      }

      db.addEventListener("readwrite", runQuery);
      window.addEventListener("focus", runQuery);
      void runQuery();

      return () => {
        db.removeEventListener("readwrite", runQuery);
        window.removeEventListener("focus", runQuery);
      };
    }, [cacheKey, openRequest, query]);

    return openRequest.flatMap(() => {
      const flattenOutput = (output: Output) => {
        if (isAsyncOp(output)) {
          return output as FlattenSuccessOps<QueryOp<Output>>;
        }

        return new Success(output) as FlattenSuccessOps<QueryOp<Output>>;
      };

      if (cacheKey) {
        const lastResult = cache.get(cacheKey) as QueryOp<Output> | undefined;

        if (lastResult && queryOp.isPending) {
          return lastResult.flatMap(flattenOutput);
        }
      }

      return queryOp.flatMap(flattenOutput);
    });
  }

  function useDatabase() {
    return useContext(DatabaseContext);
  }

  function useDatabaseOpenRequest() {
    return useContext(DatabaseOpenRequest);
  }

  function DatabaseProvider(props: { children: ReactNode }) {
    const { op, setSuccess, setFailure } = useAsyncOp<
      T,
      InaccessibleDatabaseError
    >();

    useEffect(() => {
      db.open({
        onBlocking() {
          setFailure({ type: "CLOSED_FOR_UPGRADE" });
          db.close();
          console.info("Database closed due to version upgrade.");
        },
      }).then(
        () => {
          setSuccess(db);
          console.info("Database open.");
        },
        (error: unknown) => {
          setFailure(toKnownError(error));
          console.warn(`Request to open database failed.`);
        },
      );

      return () => {
        db.close();
        console.info("Database closed.");
      };
    }, [setFailure, setSuccess]);

    return (
      <DatabaseOpenRequest.Provider value={op}>
        {props.children}
      </DatabaseOpenRequest.Provider>
    );
  }

  return {
    useQuery,
    useDatabase,
    useDatabaseOpenRequest,
    DatabaseProvider,
  };
}
