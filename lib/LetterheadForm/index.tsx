import {
  FormError,
  FormInput,
  type FormInputProps,
  FormLabel,
  useFormContext,
  useStoreState,
} from "@ariakit/react";
import { type ReactNode } from "react";
import * as css from "./style.css.ts";

export type LetterheadTextFieldProps = FormInputProps & {
  label: string;
  hint?: ReactNode;
};

export function LetterheadTextField(props: LetterheadTextFieldProps) {
  const { name, label, hint, ...inputProps } = props;

  return (
    <div>
      <div className={css.field}>
        <FormLabel name={name} className={css.fieldLabel}>
          {label}
        </FormLabel>

        <FormInput {...inputProps} name={name} className={css.fieldInput} />
      </div>

      <FormError name={name} className={css.fieldIssue} />

      {hint && <div className={css.fieldHint}>{hint}</div>}
    </div>
  );
}

type LetterheadReadonlyTextFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  hint?: ReactNode;
  type?: "text" | "email" | "password";
};

/**
 * Renders a read-only text field.
 *
 * For an editable text field, use {@link LetterheadTextField} along with
 * Ariakit form store.
 */
export function LetterheadReadonlyTextField(
  props: LetterheadReadonlyTextFieldProps,
) {
  return (
    <div>
      <label className={css.field}>
        <span className={css.fieldLabel}>{props.label}</span>

        <input
          className={css.fieldInput}
          type={props.type ?? "text"}
          value={props.value}
          placeholder={props.placeholder}
          readOnly
        />
      </label>

      {props.hint && <div className={css.fieldHint}>{props.hint}</div>}
    </div>
  );
}

type LetterheadSubmitErrorProps = {
  name: string;
};

/**
 * Renders an error message from form context.
 *
 * If there is no error message, will be completely omitted from DOM, so there
 * is no need to guard it with an if statement.
 */
export function LetterheadSubmitError(props: LetterheadSubmitErrorProps) {
  const form = useFormContext();
  const message = useStoreState(form, (s) => {
    return s?.errors[props.name] as string | undefined;
  });

  return (
    <div role="alert" className={css.submitError}>
      {message}
    </div>
  );
}
