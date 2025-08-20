export function transactionToPromise(
  transaction: IDBTransaction,
): Promise<Event> {
  return new Promise<Event>((resolve, reject) => {
    transaction.addEventListener("complete", resolve, { once: true });
    transaction.addEventListener("error", reject, { once: true });
    transaction.addEventListener("abort", reject, { once: true });
  });
}

export function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    const success = () => resolve(request.result);
    const error = () => reject(request.error);
    request.addEventListener("success", success, { once: true });
    request.addEventListener("error", error, { once: true });
  });
}

export function openRequestToPromise(request: IDBOpenDBRequest) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const success = () => resolve(request.result);
    const error = () => reject(request.error);
    const blocked = () =>
      reject(
        new Error(
          "Operation blocked. An existing database connection is preventing this action.",
        ),
      );

    request.addEventListener("success", success, { once: true });
    request.addEventListener("error", error, { once: true });
    request.addEventListener("blocked", blocked, { once: true });
  });
}

export async function* requestToAsyncGenerator(
  request: IDBRequest<IDBCursorWithValue | null>,
) {
  let cursor = await requestToPromise(request);

  while (cursor) {
    yield cursor;

    if (request.readyState !== "pending") {
      cursor.continue();
    }

    cursor = await requestToPromise(request);
  }
}
