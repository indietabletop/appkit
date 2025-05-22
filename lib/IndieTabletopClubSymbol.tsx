import type { SVGAttributes } from "react";

type IndieTabletopClubSymbolProps = Omit<
  SVGAttributes<SVGElement>,
  "width" | "height" | "viewBox"
> & {
  backgroundColor?: string;
  symbolColor?: string;
};

export function IndieTabletopClubSymbol(props: IndieTabletopClubSymbolProps) {
  const {
    symbolColor = "#FF5937",
    backgroundColor = "#F0F0F0",
    ...svgProps
  } = props;

  return (
    <svg {...svgProps} width="65px" height="65px" viewBox="0 0 65 65">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect
          fill={backgroundColor}
          x="0"
          y="0"
          width="65"
          height="65"
          rx="11"
        />
        <polygon
          fill={symbolColor}
          fillRule="nonzero"
          points="52.2105164 26.1156583 47.8803714 46.1156174 28.0633944 52.4341166 12.5765623 38.7524522 16.9067073 18.7524931 36.7278519 12.4341166"
        />
      </g>
    </svg>
  );
}
