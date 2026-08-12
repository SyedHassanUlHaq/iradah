import type { SVGProps } from "react";

/** Crescent + star mark used across Azaadi sale UI */
export const CrescentStar = ({ className, style, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={style}
    aria-hidden="true"
    {...props}
  >
    <path
      d="M14.8 4.2a7.8 7.8 0 1 0 4.6 13.2A9.2 9.2 0 0 1 14.8 4.2Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.18"
    />
    <path
      d="M19.6 3.2l.55 1.35 1.35.55-1.35.55-.55 1.35-.55-1.35-1.35-.55 1.35-.55.55-1.35Z"
      fill="currentColor"
    />
  </svg>
);
