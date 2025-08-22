import { Heading, type HeadingProps } from "@ariakit/react";
import type { RecipeVariants } from "@vanilla-extract/recipes";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../class-names.ts";
import { interactiveText } from "../common.css.ts";
import { ExternalLink } from "../ExternalLink.tsx";
import {
  FormSubmitButton,
  type FormSubmitButtonProps,
} from "../FormSubmitButton.tsx";
import { IndieTabletopClubLogo } from "../IndieTabletopClubLogo.tsx";
import { IndieTabletopClubSymbol } from "../IndieTabletopClubSymbol.tsx";
import { LoadingIndicator } from "../LoadingIndicator.tsx";
import * as css from "./style.css.ts";

export type LetterheadHeadingProps = RecipeVariants<typeof css.heading> &
  HeadingProps;

export function LetterheadHeading(props: LetterheadHeadingProps) {
  const { align, margin, ...rest } = props;
  return <Heading {...rest} {...cx(props, css.heading({ align, margin }))} />;
}

type LetterheadParagraphProps = RecipeVariants<typeof css.paragraph> &
  ComponentPropsWithoutRef<"p">;

export function LetterheadParagraph(props: LetterheadParagraphProps) {
  const { size, align, ...rest } = props;
  return <p {...rest} {...cx(props, css.paragraph({ size, align }))} />;
}

type LetterheadFooterProps = ComponentPropsWithoutRef<"div">;

export function LetterheadFooter(props: LetterheadFooterProps) {
  return (
    <div {...props} {...cx(props, css.letterheadFooter)}>
      <IndieTabletopClubLogo {...cx(css.letterheadFooterLogo)} />

      <LetterheadParagraph {...cx(css.letterheadFooterInfo)} size="small">
        Indie Tabletop Club supports independent game creators with premium
        digital tools.{" "}
        <ExternalLink
          href="https://indietabletop.club"
          className={interactiveText}
        >
          Learn more
        </ExternalLink>
        .
      </LetterheadParagraph>
    </div>
  );
}

type LetterheadSubmitButton = RecipeVariants<typeof css.button> &
  Omit<FormSubmitButtonProps, "loading">;

export function LetterheadSubmitButton(props: LetterheadSubmitButton) {
  const { marginBlockStart, ...rest } = props;
  return (
    <FormSubmitButton
      {...rest}
      {...cx(css.button({ marginBlockStart }), props)}
      loading={<LoadingIndicator />}
    />
  );
}

export type LetterheadProps = RecipeVariants<typeof css.letterhead> & {
  headerIcon?: ReactNode;
  children: ReactNode;
};

export function Letterhead(props: LetterheadProps) {
  const { children, textAlign, headerIcon = true } = props;

  return (
    <div className={css.letterhead({ textAlign })}>
      {headerIcon && <IndieTabletopClubSymbol {...cx(css.letterheadSymbol)} />}

      {children}

      <LetterheadFooter />
    </div>
  );
}
