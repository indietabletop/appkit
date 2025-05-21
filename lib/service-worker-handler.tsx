import { type ReactNode, useEffect } from "react";

/**
 * This component handles the installation of a service worker.
 *
 * Currently it doesn't do much, but, eventually, it should provide context
 * to nested components communicating the status of the service worker installation.
 */
export function ServiceWorkerHandler(props: {
  children: ReactNode;
  path: string;
}) {
  useEffect(() => {
    async function registerWorker() {
      // Although modern browsers all support service workers, native app's
      // web views (eg. the Facebook app's embedded browsers) do not.
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register(
            props.path,
          );
          console.info("Service worker registration obtained.");

          registration.addEventListener("updatefound", () => {
            const worker = registration.installing;
            console.info("Installing new service worker.");

            worker?.addEventListener("statechange", ({ target }) => {
              if (target instanceof ServiceWorker) {
                console.info(
                  `Service worker state changed: '${target.state}'.`,
                );
              }
            });
          });
        } catch (error) {
          // In rare cases, service worker installation can fail, e.g. due to network
          // connectivity. There is no need to report the error as there is nothing
          // that can be done to prevent this from occassionally happening.
          console.error(error);
        }
      }
    }

    void registerWorker();

    // Note that it is not necessary to 'cleanup' the registration in
    // the useEffect hook. Calling register() multiple times is a no-op.
    // See https://web.dev/articles/service-workers-registration#subsequent_visits
  }, [props.path]);

  return <>{props.children}</>;
}
