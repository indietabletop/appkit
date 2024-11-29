import { useCallback, useState } from "react";
import { AsyncOp, Failure, Pending, Success } from "./async-op.js";

export function useAsyncOp<T, E>() {
  const [op, setOp] = useState<AsyncOp<T, E>>(new Pending());

  const setSuccess = useCallback((value: T) => {
    setOp(new Success(value));
  }, []);

  const setFailure = useCallback((failure: E) => {
    setOp(new Failure(failure));
  }, []);

  return { op, setSuccess, setFailure };
}
