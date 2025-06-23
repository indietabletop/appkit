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

export function FormTextField(
  props: FormInputProps & {
    label: string;
    hint?: ReactNode;
  },
) {
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

/**
 * Renders a read-only text field.
 *
 * For an editable text field, use {@link FormTextField} along with Ariakit form store.
 */
export function ReadonlyTextField(props: {
  label: string;
  value: string;
  placeholder?: string;
  hint?: ReactNode;
  type?: "text" | "email" | "password";
}) {
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

/**
 * Renders an error message from form context.
 *
 * If there is no error message, will be completely omitted from DOM, so there
 * is no need to guard it with an if statement.
 */
export function FormSubmitError(props: { name: string }) {
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
