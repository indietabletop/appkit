import {
  DialogProvider,
  useDialogContext,
  useStoreState,
} from "@ariakit/react";
import type { ReactElement, ReactNode } from "react";

function DialogGuard(props: { children: ReactNode }) {
  const dialog = useDialogContext();
  const isMounted = useStoreState(dialog, (store) => store?.mounted);
  if (!isMounted) {
    return null;
  }
  return props.children;
}

/**
 * Wraps AriaKit's DialogProvider, but take a tuple of Dialog a DialogDisclosure
 * elements as children, and makes sense that the Dialog component is not
 * rendered when it is hidden.
 *
 * This is important in cases where the dialog contains a form that should only
 * be initialized and re-initialized when the dialog opens, not when it is first
 * rendered.
 */
export function DialogTrigger(props: {
  children: [ReactElement, ReactElement];
}) {
  const [dialog, button] = props.children;
  return (
    <DialogProvider>
      <DialogGuard>{dialog}</DialogGuard>
      {button}
    </DialogProvider>
  );
}
