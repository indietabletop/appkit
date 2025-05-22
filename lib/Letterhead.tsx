import type { ReactNode } from "react";
import { IndieTabletopClubSymbol } from "./IndieTabletopClubSymbol.tsx";
import { letterhead } from "./internal.css.ts";
import { LetterheadFooter } from "./LetterheadFooter.tsx";

export type LetterheadProps = {
  headerIcon?: boolean;
  children: ReactNode;
};

export function Letterhead(props: LetterheadProps) {
  const { children, headerIcon = true } = props;

  return (
    <div className={letterhead}>
      {headerIcon && (
        <IndieTabletopClubSymbol
          style={{
            marginBlock: "-1rem 1rem",
            marginInline: "auto",
            display: "block",
            inlineSize: "2.5rem",
            blockSize: "2.5rem",
          }}
        />
      )}

      {children}

      <LetterheadFooter />
    </div>
  );
}
