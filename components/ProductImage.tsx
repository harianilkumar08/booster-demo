import type { ReactNode } from "react";
import { cn } from "@/lib/format";

/** Minimal line-art placeholders, drawn on a 48×48 grid. */
const ICONS: Record<string, ReactNode> = {
  bag: (
    <>
      <path d="M17 18v-3a7 7 0 0 1 14 0v3" />
      <path d="M10 18h28l-2.2 22H12.2z" />
      <path d="M17 24v1M31 24v1" />
    </>
  ),
  wallet: (
    <>
      <rect x="8" y="14" width="32" height="22" rx="3" />
      <path d="M8 20h32" />
      <rect x="28" y="25" width="12" height="6" rx="1.5" />
    </>
  ),
  scarf: (
    <>
      <path d="M24 6 42 24 24 42 6 24z" />
      <path d="M24 13 35 24 24 35 13 24z" />
      <path d="M24 20l4 4-4 4-4-4z" />
    </>
  ),
  sweater: (
    <>
      <path d="M18 8h12l10 6-4 9-4-2v19H16V21l-4 2-4-9z" />
      <path d="M18 8a6 4 0 0 0 12 0" />
      <path d="M16 36h16" />
    </>
  ),
  boot: (
    <>
      <path d="M15 6h10v20l11 5c2.5 1.2 4 3 4 5.5V40H12v-8c2-3 3-6 3-10z" />
      <path d="M19 10v13" />
      <path d="M12 36h28" />
    </>
  ),
  sunglasses: (
    <>
      <circle cx="15" cy="26" r="7" />
      <circle cx="33" cy="26" r="7" />
      <path d="M22 25c1.3-1.4 2.7-1.4 4 0" />
      <path d="M8 24 5 17M40 24l3-7" />
    </>
  ),
  earring: (
    <>
      <path d="M24 6a4 4 0 0 1 4 4c0 2-2 3-4 4" />
      <path d="M24 14v8" />
      <circle cx="24" cy="31" r="8" />
      <path d="M20 28a5 5 0 0 1 3-2.5" />
    </>
  ),
  fragrance: (
    <>
      <rect x="19" y="6" width="10" height="7" rx="1" />
      <path d="M21 13h6v4h-6z" />
      <rect x="11" y="17" width="26" height="24" rx="4" />
      <path d="M17 29h14" />
    </>
  ),
  dress: (
    <>
      <path d="M19 6l-1 9 3 3-9 24h24l-9-24 3-3-1-9" />
      <path d="M20 18h8" />
      <path d="M21 6c1 3 5 3 6 0" />
    </>
  ),
  jacket: (
    <>
      <path d="M17 7 8 12v28h9" />
      <path d="M31 7l9 5v28h-9" />
      <path d="M17 7l7 13 7-13" />
      <path d="M17 40V20M31 40V20M17 40h14" />
      <path d="M24 20v20" />
    </>
  ),
  ring: (
    <>
      <circle cx="24" cy="30" r="11" />
      <circle cx="24" cy="30" r="8" />
      <path d="M19 15l5-6 5 6-5 4z" />
    </>
  ),
  hat: (
    <>
      <path d="M15 14c6-4 12-4 18 0l3 14H12z" />
      <path d="M5 28c12 8 26 8 38 0" />
      <path d="M13 23h22" />
    </>
  ),
  candle: (
    <>
      <rect x="12" y="17" width="24" height="25" rx="3" />
      <path d="M12 23h24" />
      <path d="M24 17v-4" />
      <path d="M24 4c3 3 3 6 0 8-3-2-3-5 0-8z" />
    </>
  ),
  watch: (
    <>
      <circle cx="24" cy="24" r="10" />
      <path d="M18 15l1-10h10l1 10M18 33l1 10h10l1-10" />
      <path d="M24 24v-6M24 24l4 2" />
      <path d="M34 22h2v4h-2" />
    </>
  ),
  vase: (
    <>
      <path d="M20 6h8v6c7 5 9 10 9 16 0 9-6 14-13 14s-13-5-13-14c0-6 2-11 9-16z" />
      <path d="M19 6h10" />
      <path d="M12 30h24" />
    </>
  ),
};

export function ProductImage({
  image,
  label,
  size = 72,
  className,
}: {
  image: string;
  label: string;
  size?: number;
  className?: string;
}) {
  const iconKey = image.startsWith("icon:") ? image.slice(5) : null;
  const icon = iconKey ? ICONS[iconKey] : null;
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-[14px] bg-(--accent-tint) text-(--brand)",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.7),transparent_60%)]" />
      {icon ? (
        <svg
          viewBox="0 0 48 48"
          width={size * 0.55}
          height={size * 0.55}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative"
          aria-hidden
        >
          {icon}
        </svg>
      ) : (
        <span className="relative" style={{ fontSize: size * 0.42 }} aria-hidden>
          {iconKey ? "🛍️" : image}
        </span>
      )}
    </div>
  );
}

export function Bolt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M13.5 2 4.5 14h6l-1.5 8 9-12h-6z" />
    </svg>
  );
}
