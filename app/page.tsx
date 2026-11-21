import Link from "next/link";
import { BoutiqueLogo, BoutiqueTheme } from "@/components/BoutiqueTheme";
import { DemoBanner } from "@/components/DemoBanner";
import { Bolt } from "@/components/ProductImage";
import { boutiques } from "@/lib/boutiques";
import { formatGBP } from "@/lib/format";
import { BOOSTER_ETA_MINUTES, BOOSTER_FEE } from "@/lib/types";

const STEPS = [
  {
    title: "Add Booster to your checkout",
    body: "A third delivery option appears next to your existing ones. Your products, prices and brand stay exactly as they are.",
  },
  {
    title: "Your customer chooses within the hour",
    body: `They pay a flat ${formatGBP(BOOSTER_FEE)} for delivery within the hour. The fee goes on their order, not on your costs.`,
  },
  {
    title: "A rider collects from your door",
    body: "We send a rider to the boutique, and your customer follows the delivery on a simple live timeline.",
  },
];

export default function Home() {
  return (
    <div className="min-h-dvh">
      <DemoBanner />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 text-[17px] font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-lg bg-ink text-volt">
            <Bolt className="size-4" />
          </span>
          Booster
        </Link>
        <nav className="flex items-center gap-6 text-[13px] text-black/60">
          <a href="#demos" className="transition hover:text-black">
            Demos
          </a>
          <a href="#how" className="transition hover:text-black">
            How it works
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-10 pb-24 md:grid-cols-[1.15fr_1fr] md:pt-20">
        <div className="animate-fade-up">
          <p className="text-[11px] font-medium tracking-[0.22em] text-stone uppercase">
            Central London · Luxury retail
          </p>
          <h1 className="mt-5 font-editorial text-[56px] leading-[0.98] tracking-[-0.01em] md:text-[84px]">
            Within the hour.
            <br />
            <em className="text-stone">Right at checkout.</em>
          </h1>
          <p className="mt-7 max-w-md text-[16px] leading-relaxed text-black/65">
            Booster adds a flat {formatGBP(BOOSTER_FEE)} within-the-hour delivery option to luxury boutique checkouts.
            The customer pays for it, and a rider collects from your door.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#demos"
              className="rounded-full bg-ink px-6 py-3.5 text-[14px] font-medium text-white transition hover:bg-black"
            >
              Explore the demos
            </a>
            <a
              href="#how"
              className="rounded-full border border-black/15 px-6 py-3.5 text-[14px] font-medium transition hover:border-black/40"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Hero visual: the Booster option as it appears at checkout */}
        <div className="relative animate-fade-up [animation-delay:120ms]" aria-hidden>
          <div className="absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle_at_70%_30%,#e9f7a8_0%,transparent_60%)] opacity-70" />
          <div className="relative rounded-[28px] bg-white p-6 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.45)] ring-1 ring-black/5">
            <p className="text-[10.5px] font-medium tracking-[0.18em] text-black/40 uppercase">Delivery method</p>
            <div className="mt-4 space-y-2.5">
              <FakeOption title="Standard (3-5 days)" price="Free" />
              <FakeOption title="Next day" price="£8" />
              <div className="relative rounded-2xl border border-ink bg-[#fbfcf4] p-4 shadow-[0_12px_30px_-20px_rgba(0,0,0,0.5)]">
                <span className="absolute -top-2.5 right-4 rounded-full bg-ink px-2 py-0.5 text-[9.5px] font-semibold tracking-[0.14em] text-volt uppercase">
                  Fastest
                </span>
                <div className="flex items-center gap-3">
                  <span className="grid size-[18px] place-items-center rounded-full border border-ink">
                    <span className="size-2 rounded-full bg-ink" />
                  </span>
                  <span className="flex flex-1 items-center gap-2 text-[14px] font-medium">
                    <span className="grid size-6 place-items-center rounded-full bg-ink text-volt">
                      <Bolt className="size-3.5" />
                    </span>
                    Booster: within 1 hour
                  </span>
                  <span className="text-[14px] font-medium">{formatGBP(BOOSTER_FEE)}</span>
                </div>
                <p className="mt-2 flex items-center gap-2 pl-[30px] text-[12.5px] text-black/65">
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500 text-emerald-500">
                    <span className="absolute inset-0 rounded-full animate-soft-pulse" />
                  </span>
                  Estimated arrival: <strong className="font-semibold">{BOOSTER_ETA_MINUTES} min</strong>
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-baseline justify-between border-t border-black/[0.06] pt-4 text-[13px]">
              <span className="text-black/50">Delivery</span>
              <span className="font-medium">{formatGBP(BOOSTER_FEE)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Facts strip */}
      <div className="border-y border-line bg-white/60">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-y-4 px-6 py-6 text-[13px] text-black/60 md:grid-cols-4">
          <li>Flat {formatGBP(BOOSTER_FEE)}, every order</li>
          <li>Paid by the customer</li>
          <li>Central London boutiques</li>
          <li>No changes to your products</li>
        </ul>
      </div>

      {/* Demos */}
      <section id="demos" className="mx-auto max-w-6xl scroll-mt-12 px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.22em] text-stone uppercase">Concept demos</p>
            <h2 className="mt-3 font-editorial text-[40px] leading-tight md:text-[52px]">Six boutiques, one checkout</h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-black/55">
            Each demo is styled for a fictional boutique. Click through the bag, choose Booster at delivery, and
            watch the tracking.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {boutiques.map((b, i) => (
            <li key={b.slug} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <BoutiqueTheme
                boutique={b}
                className="group overflow-hidden rounded-[22px] bg-white ring-1 ring-black/[0.06] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-35px_rgba(0,0,0,0.4)]"
              >
                <Link href={`/demo/${b.slug}`} className="block">
                  <div className="relative flex h-44 items-center justify-center overflow-hidden bg-(--brand) text-(--on-brand)">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,color-mix(in_srgb,var(--accent)_45%,transparent),transparent_55%)] opacity-70 transition duration-700 group-hover:opacity-100" />
                    <BoutiqueLogo boutique={b} className="relative scale-110" />
                    <span className="absolute bottom-4 left-5 text-[10.5px] tracking-[0.2em] uppercase opacity-70">
                      {b.neighbourhood}
                    </span>
                  </div>
                </Link>
                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium">{b.name}</p>
                    <p className="text-[12px] text-black/45">Fictional boutique</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-[12.5px] whitespace-nowrap">
                    <Link
                      href={`/demo/${b.slug}/admin`}
                      className="rounded-full px-3 py-1.5 text-black/50 transition hover:text-black"
                    >
                      Admin
                    </Link>
                    <Link
                      href={`/demo/${b.slug}`}
                      className="rounded-full bg-(--brand) px-3.5 py-1.5 font-medium text-(--on-brand)"
                    >
                      Checkout →
                    </Link>
                  </div>
                </div>
              </BoutiqueTheme>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-12 bg-ink text-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-[11px] font-medium tracking-[0.22em] text-white/50 uppercase">How Booster works</p>
          <h2 className="mt-3 max-w-xl font-editorial text-[40px] leading-tight md:text-[52px]">
            Three steps, and nothing changes for your team.
          </h2>
          <ol className="mt-14 grid gap-10 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="border-t border-white/15 pt-6">
                <span className="font-editorial text-[44px] leading-none text-volt">{i + 1}</span>
                <h3 className="mt-5 text-[17px] font-medium">{s.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-white/60">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-10 text-[12px] text-black/45">
        <p>Concept demo by Booster. Boutiques shown are fictional. Pilot partner: Luxury Boutique, central London.</p>
        <p>© {new Date().getFullYear()} Booster</p>
      </footer>
    </div>
  );
}

function FakeOption({ title, price }: { title: string; price: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-black/[0.08] p-4">
      <span className="size-[18px] rounded-full border border-black/25" />
      <span className="flex-1 text-[14px] font-medium">{title}</span>
      <span className="text-[14px] font-medium">{price}</span>
    </div>
  );
}
