import { useEffect, useRef, useState } from "react";

/**
 * Sets a state that will automatically revert to null after specified number
 * of milliseconds.
 */
export function useRevertingState<T>(initialState: T, revertAfterMs: number) {
  const [state, setState] = useState<T | null>(initialState);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const timeoutId = timeoutRef.current;

    if (timeoutId) {
      clearInterval(timeoutId);
    }

    if (state) {
      timeoutRef.current = setTimeout(() => {
        setState(null);
      }, revertAfterMs);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [revertAfterMs, state]);

  return [state, setState] as const;
}
