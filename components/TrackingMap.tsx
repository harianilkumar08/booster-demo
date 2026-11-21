import { cn } from "@/lib/format";

const ROUTE = "M58 132 H132 V84 H212 V52 H282";

/** Map-style placeholder: stylised streets, a route and a rider dot. No tiles, no network. */
export function TrackingMap({
  stage,
  live,
  className,
}: {
  /** 0 Packed, 1 Rider assigned, 2 On the way, 3 Delivered */
  stage: number;
  live: boolean;
  className?: string;
}) {
  const riderStatic =
    stage <= 1 ? { x: 58, y: 132 } : stage === 2 ? { x: 172, y: 84 } : { x: 282, y: 52 };

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-[#efebe4]", className)}>
      <svg viewBox="0 0 340 170" className="block h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        {/* city blocks */}
        <g fill="#e6e1d8">
          {Array.from({ length: 6 }).map((_, col) =>
            Array.from({ length: 4 }).map((__, row) => (
              <rect key={`${col}-${row}`} x={8 + col * 56} y={6 + row * 42} width={44} height={32} rx={4} />
            )),
          )}
        </g>
        {/* park */}
        <rect x="232" y="94" width="96" height="70" rx="8" fill="#dfe6d6" />
        {/* river */}
        <path d="M-10 160 C 60 140, 120 175, 200 150 S 330 140, 360 120" stroke="#d3dde3" strokeWidth="16" fill="none" />
        {/* streets */}
        <g stroke="#ffffff" strokeWidth="7" strokeLinecap="round">
          {[0, 1, 2, 3, 4, 5, 6].map((c) => (
            <line key={`v${c}`} x1={4 + c * 56} y1="0" x2={4 + c * 56} y2="170" />
          ))}
          {[0, 1, 2, 3, 4].map((r) => (
            <line key={`h${r}`} x1="0" y1={2 + r * 42} x2="340" y2={2 + r * 42} />
          ))}
        </g>
        {/* route */}
        <path d={ROUTE} stroke="white" strokeWidth="9" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path
          d={ROUTE}
          stroke="var(--brand)"
          strokeWidth="3.5"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="8 4"
          className={live && stage === 2 ? "animate-march" : undefined}
        />
        {/* boutique pin */}
        <g transform="translate(58 132)">
          <circle r="11" fill="var(--brand)" />
          <path d="M-4 -1h8l-.7 6h-6.6z M-2.2 -1v-1.6a2.2 2.2 0 0 1 4.4 0V-1" fill="none" stroke="var(--on-brand)" strokeWidth="1.3" />
        </g>
        {/* destination pin */}
        <g transform="translate(282 52)">
          <circle r="11" fill="white" stroke="var(--brand)" strokeWidth="2" />
          <path d="M-4.5 1.5 0 -3l4.5 4.5V5h-9z" fill="var(--brand)" />
        </g>
        {/* rider */}
        {live && stage === 2 ? (
          <g>
            <circle r="13" fill="var(--accent)" opacity="0.35">
              <animateMotion dur="9s" repeatCount="indefinite" path={ROUTE} />
            </circle>
            <circle r="7" fill="var(--accent)" stroke="white" strokeWidth="2.5">
              <animateMotion dur="9s" repeatCount="indefinite" path={ROUTE} />
            </circle>
          </g>
        ) : (
          <g transform={`translate(${riderStatic.x} ${riderStatic.y})`}>
            <circle r="13" fill="var(--accent)" opacity="0.35" />
            <circle r="7" fill="var(--accent)" stroke="white" strokeWidth="2.5" />
          </g>
        )}
      </svg>
      <div className="absolute top-2.5 right-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium tracking-wide text-black/60 backdrop-blur">
        Map preview
      </div>
    </div>
  );
}
