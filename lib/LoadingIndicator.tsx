import { assignInlineVars } from "@vanilla-extract/dynamic";
import { animationDelay, dot } from "./internal.css.ts";

export function LoadingIndicator(props: { className?: string }) {
  const diameter = 10;
  const radius = diameter / 2;
  const gap = diameter;
  const cy = diameter;
  const height = cy * 2;
  const width = diameter * 3 + gap;
  const initialDelay = 300;
  const interBounceDelay = 150;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={props.className}
    >
      <g stroke="none" fill="inherit">
        {Array.from({ length: 3 }, (_, index) => {
          const delay = `${initialDelay + interBounceDelay * index}ms`;

          return (
            <circle
              key={index}
              cx={radius * (index + 1) + gap * index}
              cy={cy}
              r={radius}
              className={dot}
              style={assignInlineVars({ [animationDelay]: delay })}
            />
          );
        })}
      </g>
    </svg>
  );
}
