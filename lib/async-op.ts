type Falsy = null | undefined | false | 0 | 0n | "";

type Truthy<T> = Exclude<T, Falsy>;

interface Operation<SuccessValue, FailureValue> {
  readonly type: "SUCCESS" | "FAILURE" | "PENDING";
  readonly isPending: boolean;
  readonly isSuccess: boolean;
  readonly isFailure: boolean;

  val: SuccessValue | FailureValue | null;

  valueOrNull(): SuccessValue | null;
  valueOrThrow(): SuccessValue;
  hasTruthyValue(): boolean;
  failureValueOrNull(): FailureValue | null;
  failureValueOrThrow(): FailureValue;

  flatMap<T extends AsyncOp<unknown, unknown>>(
    mappingFn: (value: SuccessValue) => T,
  ): T | Failure<FailureValue> | Pending;

  mapSuccess<MappedSuccess>(
    mappingFn: (value: SuccessValue) => MappedSuccess,
  ): Operation<MappedSuccess, FailureValue>;

  mapFailure<MappedFailure>(
    mappingFn: (value: FailureValue) => MappedFailure,
  ): Operation<SuccessValue, MappedFailure>;

  unpack<S, F, P>(
    mapS: (value: SuccessValue) => S,
    mapF: (failure: FailureValue) => F,
    mapP: () => P,
  ): S | F | P;
}

export class Pending implements Operation<never, never> {
  readonly type = "PENDING" as const;
  readonly isPending = true as const;
  readonly isSuccess = false as const;
  readonly isFailure = false as const;

  val = null;

  valueOrNull(): null {
    return null;
  }

  valueOrThrow(): never {
    throw new Error(
      `AsyncOp value was accessed but the op is in Pending state.`,
    );
  }

  hasTruthyValue(): false {
    return false;
  }

  failureValueOrNull(): null {
    return null;
  }

  failureValueOrThrow(): never {
    throw new Error(
      `AsyncOp failure value was accessed but the op is in Pending state.`,
    );
  }

  flatMap() {
    return new Pending();
  }

  mapSuccess() {
    return new Pending();
  }

  mapFailure() {
    return new Pending();
  }

  unpack<S, F, P>(
    _mapS: (value: never) => S,
    _mapF: (failure: never) => F,
    mapP: () => P,
  ): S | F | P {
    return mapP();
  }
}

export class Success<SuccessValue> implements Operation<SuccessValue, never> {
  readonly type = "SUCCESS" as const;
  readonly isPending = false as const;
  readonly isSuccess = true as const;
  readonly isFailure = false as const;
  readonly value: SuccessValue;
  readonly val: SuccessValue;

  constructor(value: SuccessValue) {
    this.value = value;
    this.val = value;
  }

  valueOrNull(): SuccessValue {
    return this.value;
  }

  valueOrThrow(): SuccessValue {
    return this.value;
  }

  hasTruthyValue(): this is Success<Truthy<SuccessValue>> {
    return !!this.value;
  }

  failureValueOrNull(): null {
    return null;
  }

  failureValueOrThrow(): never {
    throw new Error(
      `AsyncOp failure value was accessed but the op is in Success state.`,
    );
  }

  flatMap<T extends AsyncOp<unknown, unknown>>(
    mappingFn: (value: SuccessValue) => T,
  ) {
    return mappingFn(this.value);
  }

  mapSuccess<MappedValue>(mappingFn: (value: SuccessValue) => MappedValue) {
    return new Success(mappingFn(this.value));
  }

  mapFailure() {
    return new Success(this.value);
  }

  unpack<S, F, P>(
    mapS: (value: SuccessValue) => S,
    _mapF: (failure: never) => F,
    _mapP: () => P,
  ): S | F | P {
    return mapS(this.value);
  }
}

export class Failure<FailureValue> implements Operation<never, FailureValue> {
  readonly type = "FAILURE" as const;
  readonly isPending = false as const;
  readonly isSuccess = false as const;
  readonly isFailure = true as const;
  readonly failure: FailureValue;
  readonly val: FailureValue;

  constructor(failure: FailureValue) {
    this.failure = failure;
    this.val = failure;
  }

  valueOrNull(): null {
    return null;
  }

  valueOrThrow(): never {
    throw new Error(
      `AsyncOp value was accessed but the op is in Failure state.`,
    );
  }

  hasTruthyValue(): false {
    return false;
  }

  failureValueOrNull(): FailureValue {
    return this.failure;
  }

  failureValueOrThrow(): FailureValue {
    return this.failure;
  }

  flatMap() {
    return new Failure(this.failure);
  }

  mapSuccess() {
    return new Failure(this.failure);
  }

  mapFailure<MappedFailure>(mappingFn: (value: FailureValue) => MappedFailure) {
    return new Failure(mappingFn(this.failure));
  }

  unpack<S, F, P>(
    _mapS: (value: never) => S,
    mapF: (failure: FailureValue) => F,
    _mapP: () => P,
  ): S | F | P {
    return mapF(this.failure);
  }
}

/**
 * Folds multiple ops into a single op.
 *
 * To return a Success, all ops provided must be a Success. If any Failures are
 * encountered, will return the first one found.
 *
 * If neither of these conditions is true, will return Pending.
 *
 * Note that if passed an empty array, will always return a Success (with an
 * empty array as value). This mimics the semantics of many JS constructs, like
 * Promise.all or Array.prototype.every.
 */
export function fold<Ops extends readonly AsyncOp<unknown, unknown>[] | []>(
  ops: Ops,
): AsyncOp<
  {
    -readonly [Index in keyof Ops]: Ops[Index] extends AsyncOp<infer S, unknown>
      ? S
      : never;
  },
  Ops[number] extends AsyncOp<unknown, infer F> ? F : never
> {
  // Note that due to the semantics of `every`, if the array provided to `fold`
  // is empty, the result will be a Success with an empty array.
  if (ops.every((v) => v.isSuccess)) {
    return new Success(
      (ops as Success<unknown>[]).map((op) => op.value),
    ) as never;
  }

  const firstFail = ops.find((op) => op.isFailure);
  if (firstFail) {
    return firstFail as never;
  }

  return new Pending() as never;
}

export function isAsyncOp(value: unknown): value is AsyncOp<unknown, unknown> {
  return (
    value instanceof Pending ||
    value instanceof Success ||
    value instanceof Failure
  );
}

export type AsyncOp<SuccessValue, FailureValue> =
  | Pending
  | Success<SuccessValue>
  | Failure<FailureValue>;
