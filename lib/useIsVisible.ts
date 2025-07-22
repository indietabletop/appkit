import { useEffect, useRef, useState } from "react";

export function useIsVisible<T extends HTMLElement>(
  initialState = false,
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T | null>(null);
  const [isVisible, setVisible] = useState(initialState);

  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry) {
          setVisible(entry.isIntersecting);
        }
      }, options);

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }
  });

  return { ref, isVisible };
}
