import type { CSSProperties, ReactNode } from "react";
import { cn, readableTextOn } from "@/lib/format";
import type { Boutique } from "@/lib/types";

export function BoutiqueTheme({
  boutique,
  className,
  children,
}: {
  boutique: Boutique;
  className?: string;
  children: ReactNode;
}) {
  const style = {
    "--brand": boutique.brandColor,
    "--accent": boutique.accentColor,
    "--on-brand": readableTextOn(boutique.brandColor),
    "--on-accent": readableTextOn(boutique.accentColor),
  } as CSSProperties;
  return (
    <div
      className={cn("boutique", boutique.fontStyle === "serif" ? "theme-serif" : "theme-sans", className)}
      style={style}
    >
      {children}
    </div>
  );
}

export function BoutiqueLogo({ boutique, className }: { boutique: Boutique; className?: string }) {
  const serif = boutique.fontStyle === "serif";
  return (
    <span
      className={cn(
        "font-display leading-none whitespace-nowrap",
        serif ? "text-[22px] font-medium tracking-[0.06em]" : "text-[15px] font-semibold tracking-[0.28em]",
        className,
      )}
    >
      {boutique.logoText}
    </span>
  );
}
