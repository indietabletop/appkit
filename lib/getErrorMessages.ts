import type { FailurePayload } from "./types.ts";

type FailureMessages = {
  title: string;
  description: string;
};

const defaultMessages: Record<
  number | "fallback" | "connection",
  FailureMessages
> = {
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
};

export function getFailureMessages(
  failure: FailurePayload,
  messageOverrides: Record<number, Partial<FailureMessages>> = {},
) {
  switch (failure.type) {
    case "API_ERROR": {
      return {
        ...(defaultMessages[failure.code] ?? defaultMessages.fallback),
        ...messageOverrides[failure.code],
      };
    }

    case "NETWORK_ERROR": {
      return defaultMessages.connection;
    }

    default: {
      return defaultMessages.fallback;
    }
  }
}
