import Link from "next/link";

export function DemoBanner() {
  return (
    <div
      data-demo-banner
      className="sticky top-0 z-50 flex h-8 items-center justify-center gap-2 bg-ink px-4 text-[11px] tracking-[0.08em] text-white/80"
      role="note"
    >
      <span className="inline-block size-1.5 rounded-full bg-volt" aria-hidden />
      <span>Concept demo by Booster. Not a live store.</span>
      <Link href="/" className="hidden text-white underline-offset-4 hover:underline sm:inline">
        About Booster
      </Link>
    </div>
  );
}
