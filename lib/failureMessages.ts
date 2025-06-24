import type { FailurePayload } from "./types.ts";

type OnOverride<T> = (fallback: T, override?: Partial<T>) => T;

function createFailureMessageGetter<T>(
  defaults: Record<number | "fallback" | "connection", T>,
  options: { onOverride: OnOverride<T> },
) {
  return function getMessage(
    failure: FailurePayload,
    overrides: Record<number, Partial<T>> = {},
  ) {
    switch (failure.type) {
      case "API_ERROR": {
        return options.onOverride(
          defaults[failure.code] ?? defaults.fallback,
          overrides[failure.code],
        );
      }

      case "NETWORK_ERROR": {
        return defaults.connection;
      }

      default: {
        return defaults.fallback;
      }
    }
  };
}

export const getFetchFailureMessages = createFailureMessageGetter(
  {
    404: {
      title: `Not found`,
      description: `The link you have followed might be broken.`,
    },
    500: {
      title: `Ooops, something went wrong`,
      description: `This is probably an issue with our servers. You can try refreshing.`,
    },
    connection: {
      title: `No connection`,
      description: `Check your interent connection and try again.`,
    },
    fallback: {
      title: `Ooops, something went wrong`,
      description: `This is probably an issue on our side. You can try refreshing.`,
    },
  },
  {
    onOverride(fallback, override) {
      return { ...fallback, ...override };
    },
  },
);

export const getSubmitFailureMessage = createFailureMessageGetter(
  {
    500: `Could not submit form due to an unexpected server error. Please refresh the page and try again.`,
    connection: `Could not submit form due to network error. Make sure you are connected to the internet and try again.`,
    fallback: `Could not submit form due to an unexpected error. Please refresh the page and try again.`,
  },
  {
    onOverride(fallback, override) {
      return override ?? fallback;
    },
  },
);
