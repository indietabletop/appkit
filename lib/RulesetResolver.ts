import { useCallback, useSyncExternalStore } from "react";
import { Failure, Pending, Success } from "./async-op.ts";
import { isNullish } from "./typeguards.ts";

type RulesetLike = { version: string };

type GetRemoteRuleset<R extends RulesetLike, F> = (
  version: string,
) => Promise<Success<R> | Failure<F>>;

type RulesetResolverProps<R extends RulesetLike, F> = {
  /**
   * The initial ruleset that will be available to all users immediately at
   * app start.
   */
  initialRuleset: R;

  /**
   * A function that should return a Result with an instance of
   * a Ruleset for the given game.
   */
  getRemoteRuleset: GetRemoteRuleset<R, F>;
};

/**
 * Encapsulates ruleset caching and retrieval logic.
 *
 * Usually you want to instantiate this class and immediately pass it to
 * {@link createRulesetResolverBindings} so that you can use it from within
 * React components with proper re-renders.
 *
 * @example
 * ```ts
 * import { createRulesetResolverBindings, RulesetResolver } from "@indietabletop/appkit";
 *
 * // Instantiate a resolver and export it for any potential use
 * export const resolver = new RulesetResolver({
 *   initialRuleset: new Ruleset({ ... }),
 *   async getRemoteRuleset(version) {
 *     // Get ruleset from a remote location somehow
 *     return new Ruleset({ ... });
 *   },
 * });
 *
 * // Generate resolver-bound hooks for use within React components
 * export const { useResolveRuleset, useLatestRuleset } =
 *   createRulesetResolverBindings(resolver);
 * ```
 */
export class RulesetResolver<R extends RulesetLike, F> {
  getRemoteRuleset: GetRemoteRuleset<R, F>;
  rulesets: Map<string, Success<R> | Failure<F>>;

  constructor(props: RulesetResolverProps<R, F>) {
    this.getRemoteRuleset = props.getRemoteRuleset;
    this.rulesets = new Map([
      [props.initialRuleset.version, new Success(props.initialRuleset)],
    ]);
  }

  get latest() {
    const sortedRulesets = Array.from(this.rulesets.values())
      .filter((result) => result.isSuccess)
      .map((result) => result.value)
      .sort((left, right) => left.version.localeCompare(right.version));

    if (sortedRulesets.length === 0) {
      throw new Error(
        `Could not resolve latest ruleset. Ruleset resolver doesn't include any succesfully resolved ruleset versions.`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return sortedRulesets.at(-1)!;
  }

  requests = new Map<string, Promise<Success<R> | Failure<F>>>();

  /**
   * Resolves a ruleset version if it is currently in memory.
   *
   * Otherwise, initiates ruleset resolution from a remote source  in the
   * background and returns `null`. If you want to know when the freshly
   * requested ruleset will be resolved, you must use the {@link subscribe}
   * method (possibly using a hook returned from {@link createRulesetResolverBindings}).
   */
  resolve(version: string) {
    const ruleset = this.rulesets.get(version);
    if (ruleset) {
      return ruleset;
    }

    void this.resolveFromRemote(version);
    return null;
  }

  /**
   * Resolves a ruleset from a remote source, deduplicating requests to
   * identical rulesets.
   */
  async resolveFromRemote(version: string) {
    const ongoingRequest = this.requests.get(version);
    if (ongoingRequest) {
      return await ongoingRequest;
    }

    const remoteRulesetPromise = this.getRemoteRuleset(version);
    this.requests.set(version, remoteRulesetPromise);

    const newRuleset = await remoteRulesetPromise;
    this.rulesets.set(version, newRuleset);
    this.notify();

    // Clear requests cache to allow for potential retries
    this.requests.delete(version);

    return newRuleset;
  }

  listeners = new Set<() => void>();

  subscribe(callback: () => void) {
    this.listeners.add(callback);
  }

  unsubscribe(callback: () => void) {
    this.listeners.delete(callback);
  }

  notify() {
    for (const notifyListener of this.listeners) {
      notifyListener();
    }
  }
}

/**
 * Given a RulesetResolver, creates bound React hooks that trigger re-renders
 * when new rulesets are resolved by the resolver.
 *
 * Usually you will create these hooks in their own module and export them
 * for further use.
 *
 * @example
 * ```ts
 * export const resolver = new RulesetResolver({ ... });
 *
 * export const { useResolveRuleset, useLatestRuleset } =
 *   createRulesetResolverHooks(resolver);
 * ```
 */
export function createRulesetResolverBindings<
  Ruleset extends RulesetLike,
  Failure,
>(resolver: RulesetResolver<Ruleset, Failure>) {
  // Pending state with stable identity — necessary so that
  // useSyncExternalStore doesn't enter an infinite loop.
  const pending = new Pending();

  /**
   * Returns a ruleset result compatible with the provided version.
   *
   * If a ruleset is not currently in memory, it will be requested in the
   * background and the component using this hook will be re-rendered once
   * the request is completed.
   *
   * Note that requests are deduplicated, so it is safe to use this hook
   * in loops/lists where multiple components might request identical
   * ruleset verions.
   */
  function useResolveRuleset(version: string) {
    const subscribe = useCallback((callback: () => void) => {
      resolver.subscribe(callback);

      return () => {
        resolver.unsubscribe(callback);
      };
    }, []);

    const getSnapshot = useCallback(() => {
      if (!isNullish(version)) {
        return resolver.resolve(version) ?? pending;
      }

      return pending;
    }, [version]);

    return useSyncExternalStore(subscribe, getSnapshot);
  }

  /**
   * Returns the latest ruleset available in memory.
   */
  function useLatestRuleset() {
    const subscribe = useCallback((callback: () => void) => {
      resolver.subscribe(callback);

      return () => {
        resolver.unsubscribe(callback);
      };
    }, []);

    const getSnapshot = useCallback(() => {
      return resolver.latest;
    }, []);

    return useSyncExternalStore(subscribe, getSnapshot);
  }

  return {
    useLatestRuleset,
    useResolveRuleset,
  };
}
