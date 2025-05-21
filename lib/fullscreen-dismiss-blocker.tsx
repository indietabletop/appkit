import { useEffect } from "react";

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
  }
}

/**
 * This component prevents the default MacOS behaviour where a fullscreen window
 * gets minimised by pressing Escape.
 */
export function FullscreenDismissBlocker() {
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return null;
}
