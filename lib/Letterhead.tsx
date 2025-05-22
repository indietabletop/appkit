import type { ReactNode } from "react";
import { itcCard } from "./common.css.ts";
import { IndieTabletopClubSymbol } from "./IndieTabletopClubSymbol.tsx";
import { LetterheadFooter } from "./LetterheadFooter.tsx";

export type LetterheadProps = {
  headerIcon?: boolean;
  children: ReactNode;
};

export function Letterhead(props: LetterheadProps) {
  const { children, headerIcon = true } = props;

  return (
    <div
      className={itcCard}
      style={{
        textTransform: "none",
        padding: "4rem",
        borderRadius: "1rem",
        marginInline: "auto",
        maxInlineSize: "36rem",
      }}
    >
      {headerIcon && (
        <IndieTabletopClubSymbol
          style={{
            marginBlockStart: "-1rem",
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
