import type { AnchorHTMLAttributes } from "react";

export type ExternalLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "rel" | "target"
>;

export function ExternalLink(props: ExternalLinkProps) {
  return <a {...props} target="_blank" rel="noreferrer noopener" />;
}
