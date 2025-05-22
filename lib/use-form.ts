import { type FormStoreState, useFormStore } from "@ariakit/react";
import { Failure, Success } from "@indietabletop/appkit/async-op";
import { useState } from "react";

type Validator<T> = (value: T) => string | null;

type MaybePromise<T> = T | Promise<T>;

export function useForm<T extends object, R>(props: {
  defaultValues: T;
  validate?: { [K in keyof T]?: Validator<T[K]> };

  /**
   * Handles form submission login.
   *
   * This function should return a Success or Failure. Failures should always contain a string
   * which will be used as the form error message.
   */
  onSubmit: (
    state: FormStoreState<T>,
  ) => MaybePromise<Success<R> | Failure<string>>;

  /**
   * If submission was successful (i.e. onSubmit returned a Success), will be run to perform any
   * side-effect necessary.
   *
   * Typically this is used for navigation on mutating some local state.
   */
  onSuccess?: (value: R, state: FormStoreState<T>) => MaybePromise<void>;
}) {
  const submitName = "submit";

  const [op, setOp] = useState<Awaited<
    ReturnType<typeof props.onSubmit>
  > | null>(null);

  const form = useFormStore({
    defaultValues: props.defaultValues,
  });

  form.useSubmit(async (state) => {
    const submitOp = await props.onSubmit(state);

    if (submitOp.isFailure) {
      form.setError(submitName, submitOp.failure);
    }

    if (submitOp.isSuccess) {
      await props.onSuccess?.(submitOp.value, state);
    }

    setOp(submitOp);
  });

  form.useValidate((state) => {
    if (props.validate) {
      const entries = Object.entries(props.validate) as Array<
        [keyof T & string, Validator<T[keyof T]>]
      >;

      for (const [key, validate] of entries) {
        const value = state.values[key];
        const message = validate(value);

        if (message) {
          form.setError(key, message);
        }
      }
    }
  });

  return { form, submitName, op };
}
