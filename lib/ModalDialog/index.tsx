import { Dialog, type DialogProps } from "@ariakit/react";
import type { RecipeVariants } from "@vanilla-extract/recipes";
import type { ReactNode } from "react";
import { cx } from "../class-names.ts";
import * as css from "./style.css.ts";

type Size = NonNullable<NonNullable<RecipeVariants<typeof css.dialog>>["size"]>;

export type ModalDialogProps = Omit<DialogProps, "modal" | "backdrop"> & {
  children: ReactNode;
  size: Size;
  backdropClassName?: string;
};

export function ModalDialog(props: ModalDialogProps) {
  const { size, backdropClassName, className, ...dialogProps } = props;

  return (
    <Dialog
      {...dialogProps}
      {...cx(className, css.dialog({ size }))}
      backdrop={<div {...cx(css.backdrop, backdropClassName)} />}
      modal
    >
      {props.children}
    </Dialog>
  );
}
