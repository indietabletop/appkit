import { useEffect } from "react";

function preventDefaultEscHandling(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
  }
}

/**
 * This component prevents the default MacOS behaviour where a fullscreen window
 * gets minimized by pressing Escape.
 */
export function FullscreenDismissBlocker() {
  useEffect(() => {
    window.addEventListener("keydown", preventDefaultEscHandling);

    return () => {
      window.removeEventListener("keydown", preventDefaultEscHandling);
    };
  }, []);

  return null;
}
