import { useEffect } from "react";

/**
 * Sets document background color, reverting it to previous color on unmount.
 */
export function useDocumentBackgroundColor(bodyColor: string) {
  useEffect(() => {
    const style = window.document.documentElement.style;
    const originalColor = style.backgroundColor;
    style.backgroundColor = bodyColor;

    return () => {
      style.backgroundColor = originalColor;
    };
  });
}
