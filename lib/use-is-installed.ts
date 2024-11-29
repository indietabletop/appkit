import { useMemo } from "react";

/**
 * Checks whether the app is installed.
 *
 * Note that this doesn't check whether the app is installed on the device at
 * all, only whether the currently running process is within an installed window
 * or running within a browser.
 */
export function useIsInstalled() {
  // The only way to get into the Standalone display mode is to install
  // the app, so this is a good way to check installation status.
  return useMemo(
    () => window.matchMedia("(display-mode: standalone)").matches,
    [],
  );
}
