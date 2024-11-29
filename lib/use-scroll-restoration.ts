import { useEffect, useLayoutEffect, useMemo } from "react";

type TimestampedCoordniates = [ts: number, x: number, y: number];

const scrollPositions = new Map<string, TimestampedCoordniates>();

/**
 * Handles scroll restoration on window.
 *
 * This hook behaves a little differently than the default browser scroll
 * restoration. This is due to limitations of Wouter (our router of choice)
 * as well the need to make the app feel more app-like.
 *
 * Every scroll position is remembered however the user has got to it (we
 * don't differentiate between new entries in browser history and back
 * navigation), but they are only restored if the user last visited the
 * location less than 60 minutes ago.
 */
export function useScrollRestoration(
  /**
   * The current path, provided by your router of choice.
   */
  pathname: string,

  options?: {
    /**
     * A list of paths where scroll restoration should never be performed.
     *
     * This list should have stable identity for optimal performance. Make
     * sure to use `useMemo` or define the list in module scope.
     */
    neverRestore?: string[];
  }
) {
  // Standardise pathname, making sure that paths ending with and without
  // a slash are treated equally
  const normalizedPathname = pathname.replace(/\/$/, "") || "/";

  const neverRestore = useMemo(
    () => new Set(options?.neverRestore),
    [options?.neverRestore]
  );

  // Record scroll position for given pathname on pushState/replaceState.
  useEffect(() => {
    const handleEvent = () => {
      const x = window.scrollX;
      const y = window.scrollY;
      scrollPositions.set(normalizedPathname, [Date.now(), x, y]);
      console.info(
        `Set scroll position for '${normalizedPathname}' (x: ${x}, y: ${y}).`
      );
    };

    // These events are provided by Wouter. They are not native browser events!
    window.addEventListener("pushState", handleEvent);
    window.addEventListener("replaceState", handleEvent);

    return () => {
      window.removeEventListener("pushState", handleEvent);
      window.removeEventListener("replaceState", handleEvent);
    };
  }, [normalizedPathname]);

  // Restore scroll position if last visit was less than 60 minutes ago.
  useLayoutEffect(() => {
    const maxDiff = 60_000 * 60; // 60 minutes
    const coordinates = scrollPositions.get(normalizedPathname);

    if (coordinates) {
      if (!neverRestore.has(normalizedPathname)) {
        const now = Date.now();
        const [ts, x, y] = coordinates;

        if (now - ts < maxDiff) {
          window.scrollTo(x, y);
          console.info(
            `Restoring scroll position for '${normalizedPathname}' (x: ${x}, y: ${y}).`
          );
        } else {
          window.scrollTo(0, 0);
          console.info(
            `Not restoring scroll position for '${normalizedPathname}'. Last visit >60 min ago.`
          );
        }
      } else {
        window.scrollTo(0, 0);
        console.info(
          `Not restoring scroll position for '${normalizedPathname}'. Page is set never to restore.`
        );
      }
    } else {
      window.scrollTo(0, 0);
      console.info(
        `Not restoring scroll position for '${normalizedPathname}'. Page not visited yet.`
      );
    }
  }, [normalizedPathname]);
}
