import {
  FormCheckbox,
  type FormCheckboxProps,
  FormError,
  FormInput,
  type FormInputProps,
  FormLabel,
  type FormStore,
  useFormContext,
  useStoreState,
} from "@ariakit/react";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { type ReactNode } from "react";
import * as css from "./style.css.ts";

export function FormCheckboxField(
  props: FormCheckboxProps & { label: ReactNode },
) {
  const { label, name, ...inputProps } = props;

  return (
    <div>
      <FormCheckbox name={name} {...inputProps} />{" "}
      <FormLabel name={name}>{label}</FormLabel>
      <FormError name={name} className={css.issue} />
    </div>
  );
}

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

      <FormError name={name} className={css.issue} />

      {hint && <div className={css.fieldHint}>{hint}</div>}
    </div>
  );
}

export function FormTextAreaField(
  props: FormInputProps & {
    label: string;
    minRows?: number;
  },
) {
  const { name, label, minRows, ...textareaProps } = props;
  const form: FormStore<Record<string, string>> | undefined = useFormContext();
  const value =
    useStoreState(form, (state) => state?.values[name as string]) ?? "";
  const lines = value.split("\n");

  return (
    <div className={css.field}>
      <FormLabel name={name} className={css.fieldLabel}>
        {label}
      </FormLabel>

      <span
        className={css.fieldTextAreaContainer}
        style={assignInlineVars({
          [css.minRows]: `${minRows ?? 2}`,
        })}
      >
        <span aria-hidden="true" className={css.fieldTextAreaSpacer}>
          {lines.map((line, index) => {
            return (
              <span className={css.fieldTextAreaSpacerLine} key={index}>
                {line}
              </span>
            );
          })}
        </span>

        <FormInput
          {...textareaProps}
          name={name}
          render={<textarea />}
          className={css.fieldTextArea}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
              void form?.submit();
            }
          }}
        />
      </span>
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
