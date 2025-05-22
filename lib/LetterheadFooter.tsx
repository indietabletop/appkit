import { interactiveText } from "./common.css.ts";
import { ExternalLink } from "./ExternalLink.tsx";
import { IndieTabletopClubLogo } from "./IndieTabletopClubLogo.tsx";

export function LetterheadFooter() {
  return (
    <div
      style={{
        textAlign: "center",
        paddingBlockStart: "2rem",
        borderBlockStart: "1px solid #ececec",
        marginBlockStart: "3rem",
      }}
    >
      <IndieTabletopClubLogo style={{ margin: "0 auto 1.125rem" }} />
      <p
        style={{
          margin: "0 auto",
          maxInlineSize: "25rem",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
        }}
      >
        Indie Tabletop Club supports independent game creators with high-quality
        digital tools.{" "}
        <ExternalLink
          href="https://indietabletop.club"
          className={interactiveText}
        >
          Learn more
        </ExternalLink>
        .
      </p>
    </div>
  );
}
