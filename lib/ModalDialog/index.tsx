import { Dialog, type DialogProps } from "@ariakit/react";
import type { ReactNode } from "react";
import { cx } from "../class-names.ts";
import * as css from "./style.css.ts";

export type ModalDialogProps = Omit<DialogProps, "modal" | "backdrop"> & {
  children: ReactNode;
  variant: "form" | "confirm";
  backdropClassName?: string;
};

export function ModalDialog(props: ModalDialogProps) {
  const { variant, backdropClassName, className, ...dialogProps } = props;

  return (
    <Dialog
      {...dialogProps}
      {...cx(className, css.dialog({ variant }))}
      backdrop={<div {...cx(css.backdrop, backdropClassName)} />}
      modal
    >
      {props.children}
    </Dialog>
  );
}
