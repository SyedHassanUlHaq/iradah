import { useId } from "react";
import { AZAADI } from "@/lib/azaadi";
import { CrescentStar } from "@/components/CrescentStar";

interface AzaadiStampProps {
  className?: string;
  size?: number;
}

export const AzaadiStamp = ({ className = "", size = 132 }: AzaadiStampProps) => {
  const uid = useId().replace(/:/g, "");
  const topId = `stampArcTop-${uid}`;
  const bottomId = `stampArcBottom-${uid}`;

  return (
    <div className={`select-none ${className}`} style={{ width: size, height: size }}>
      <div className="stamp-pulse relative w-full h-full">
        <svg
          viewBox="0 0 160 160"
          width={size}
          height={size}
          className="absolute inset-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)]"
        >
          <circle cx="80" cy="80" r="76" fill={AZAADI.cream} />
          <circle
            cx="80"
            cy="80"
            r="76"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="1 6.2"
            strokeLinecap="round"
          />
          <circle cx="80" cy="80" r="62" fill="none" stroke="currentColor" strokeWidth="1.25" />
          <path id={topId} d="M 18,80 A 62,62 0 0 1 142,80" fill="none" />
          <path id={bottomId} d="M 142,84 A 62,62 0 0 1 18,84" fill="none" />
          <text
            className="font-display"
            fill="currentColor"
            fontSize="13.5"
            letterSpacing="2.5"
          >
            <textPath href={`#${topId}`} startOffset="50%" textAnchor="middle">
              {AZAADI.stampTop}
            </textPath>
          </text>
          <text className="font-display" fill="currentColor" fontSize="12" letterSpacing="2">
            <textPath href={`#${bottomId}`} startOffset="50%" textAnchor="middle">
              {AZAADI.stampBottom}
            </textPath>
          </text>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display leading-none" style={{ fontSize: size * 0.28 }}>
            {AZAADI.percentLabel}
          </span>
          <span
            className="font-display leading-none -mt-1 flex items-center gap-1.5"
            style={{ fontSize: size * 0.12, letterSpacing: "0.25em" }}
          >
            {AZAADI.offLabel}
            <CrescentStar style={{ width: size * 0.09, height: size * 0.09 }} />
          </span>
        </div>
      </div>
    </div>
  );
};
