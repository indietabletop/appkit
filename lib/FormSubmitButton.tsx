import {
  type FormSubmitProps,
  FormSubmit,
  useFormContext,
  useStoreState,
} from "@ariakit/react";
import type { ReactNode } from "react";
import { fadeIn } from "./animations.css.ts";

export type FormSubmitButtonProps = FormSubmitProps & {
  children: ReactNode;
  loading: ReactNode;
};

/**
 * Renders Ariakit FormSubmit component.
 *
 * It's main responsibility is to render the loading component (provided via
 * the `loading` prop) when the form is in the submitting state. This component
 * will be rendered over the usual content of the button, which will be hidden
 * as long as the form is submitting.
 *
 * @remarks Must be rendered within Ariakit Form Context.
 */
export function FormSubmitButton(props: FormSubmitButtonProps) {
  const { children, className, style, loading, ...submitProps } = props;
  const form = useFormContext();
  const isSubmitting = useStoreState(form, (s) => s?.submitting);

  return (
    <FormSubmit
      {...submitProps}
      className={className}
      style={{ position: "relative", ...style }}
    >
      <span
        style={{ opacity: isSubmitting ? 0 : 1, transition: "200ms opacity" }}
      >
        {children}
      </span>

      {isSubmitting && (
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: "0",
            alignItems: "center",
            justifyContent: "center",
            animation: `${fadeIn} 200ms 200ms both`,
          }}
        >
          {loading}
        </div>
      )}
    </FormSubmit>
  );
}
