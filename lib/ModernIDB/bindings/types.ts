import type { AsyncOp } from "../../async-op.ts";
import type { AnyModernIDB } from "../types.ts";

export type DatabaseQueryOpFailure = QueryError | InaccessibleDatabaseError;

export type QueryOp<Output> = AsyncOp<Output, DatabaseQueryOpFailure>;

export type QueryError = {
  type: "QUERY_ERROR";
  error: string;
};

/**
 * The stored database version is higher than the version requested.
 */
export type VersionHigherState = {
  type: "DB_VERSION_HIGHER_THAN_REQUESTED";
  message: string;
};

/**
 * Database could not be opened for an unrecognized reason.
 */
export type UnexpectedErrorState = {
  type: "UNKNOWN_ERROR";
  message: string;
};

/**
 * This happens if the database needs an upgrade due to version change, but there are connections open to it from other tabs.
 */
export type UpgradeBlockedState = {
  type: "UPGRADE_BLOCKED";
};

/**
 * The DB has been closed to allow for version change.
 */
export type ClosedForUpgradeState = {
  type: "CLOSED_FOR_UPGRADE";
};

export type InaccessibleDatabaseError =
  | UpgradeBlockedState
  | ClosedForUpgradeState
  | VersionHigherState
  | UnexpectedErrorState;

export type DatabaseOpenRequestOp<T extends AnyModernIDB = AnyModernIDB> =
  AsyncOp<T, InaccessibleDatabaseError>;
