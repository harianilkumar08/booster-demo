"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BoutiqueLogo } from "@/components/BoutiqueTheme";
import { Bolt, ProductImage } from "@/components/ProductImage";
import { TrackingMap } from "@/components/TrackingMap";
import { cn, formatGBP, orderNumber } from "@/lib/format";
import { track } from "@/lib/track";
import { BOOSTER_ETA_MINUTES, BOOSTER_FEE, NEXT_DAY_FEE, type Boutique } from "@/lib/types";

export type Step = "cart" | "delivery" | "confirmation";
export type DeliveryId = "standard" | "nextday" | "booster";

const DELIVERY: Record<DeliveryId, { title: string; fee: number }> = {
  standard: { title: "Standard (3-5 days)", fee: 0 },
  nextday: { title: "Next day", fee: NEXT_DAY_FEE },
  booster: { title: "Booster: within 1 hour", fee: BOOSTER_FEE },
};

const STAGES = [
  { label: "Packed", detail: (b: Boutique) => `Wrapped and ready at ${b.name}` },
  { label: "Rider assigned", detail: () => "Jules is collecting your order" },
  { label: "On the way", detail: () => "Travelling by e-cargo bike" },
  { label: "Delivered", detail: () => "Handed over at your door" },
];
const STAGE_ETA = [BOOSTER_ETA_MINUTES, 44, 21, 0];

interface CheckoutProps {
  boutique: Boutique;
  initialStep?: Step;
  initialDelivery?: DeliveryId;
  /** Mockup mode: fixed state, no timers, sized to fill a phone frame. */
  mockup?: boolean;
  /** Tracking stage to show in mockup mode. */
  mockupStage?: number;
}

function useTweened(value: number, enabled: boolean): number {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (!enabled) return;
    const start = performance.now();
    const origin = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 420);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(origin + (value - origin) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, enabled]);
  return enabled ? display : value;
}

export function Checkout({
  boutique,
  initialStep = "cart",
  initialDelivery = "standard",
  mockup = false,
  mockupStage = 2,
}: CheckoutProps) {
  const [step, setStep] = useState<Step>(initialStep);
  const [delivery, setDelivery] = useState<DeliveryId>(initialDelivery);
  const [qty, setQty] = useState<number[]>(() => boutique.products.map((_, i) => (i < 2 ? 1 : 0)));
  const [stage, setStage] = useState(mockup ? mockupStage : 0);
  const [arrivalClock, setArrivalClock] = useState<string | null>(null);

  const items = boutique.products.map((p, i) => ({ ...p, index: i, qty: qty[i] ?? 0 }));
  const inBag = items.filter((i) => i.qty > 0);
  const suggestions = items.filter((i) => i.qty === 0);
  const count = inBag.reduce((n, i) => n + i.qty, 0);
  const subtotal = inBag.reduce((n, i) => n + i.qty * i.price, 0);
  const fee = DELIVERY[delivery].fee;
  const total = subtotal + fee;
  const shownTotal = useTweened(total, !mockup);

  // Live "estimated arrival" clock (client only, so static HTML never mismatches).
  useEffect(() => {
    if (mockup) return;
    const update = () => {
      const t = new Date(Date.now() + BOOSTER_ETA_MINUTES * 60_000);
      setArrivalClock(t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    };
    const first = window.setTimeout(update, 0);
    const id = window.setInterval(update, 30_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [mockup]);

  // Simulated tracking: advance one stage every few seconds.
  useEffect(() => {
    if (mockup || step !== "confirmation" || delivery !== "booster") return;
    const id = window.setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 3200);
    return () => window.clearInterval(id);
  }, [mockup, step, delivery]);

  useEffect(() => {
    if (mockup || step !== "confirmation" || delivery !== "booster") return;
    track("tracking_stage", { slug: boutique.slug, stage: STAGES[stage]?.label });
  }, [mockup, step, delivery, stage, boutique.slug]);

  const go = (next: Step) => {
    setStep(next);
    track("checkout_step", { slug: boutique.slug, step: next });
    if (!mockup) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeQty = (index: number, delta: number) =>
    setQty((q) => q.map((v, i) => (i === index ? Math.max(0, Math.min(9, v + delta)) : v)));

  const chooseDelivery = (id: DeliveryId) => {
    setDelivery(id);
    track("delivery_selected", { slug: boutique.slug, option: id });
  };

  const placeOrder = () => {
    setStage(0);
    track("order_placed", { slug: boutique.slug, delivery, total });
    go("confirmation");
  };

  const restart = () => {
    setQty(boutique.products.map((_, i) => (i < 2 ? 1 : 0)));
    setDelivery("standard");
    setStage(0);
    go("cart");
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-white text-[#191816]",
        mockup ? "h-full" : "min-h-[calc(100dvh-2rem)] md:min-h-[760px]",
      )}
    >
      {/* Header */}
      <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-black/[0.06] px-4">
        {step === "delivery" ? (
          <button
            type="button"
            onClick={() => go("cart")}
            className="grid size-9 place-items-center rounded-full text-black/60 transition hover:bg-black/5"
            aria-label="Back to bag"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <span className="size-9" />
        )}
        <BoutiqueLogo boutique={boutique} className="text-(--brand)" />
        <span className="relative grid size-9 place-items-center text-black/70" aria-label={`${count} items in bag`}>
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 9V7a4 4 0 0 1 8 0v2M5 9h14l-1 11H6z" strokeLinejoin="round" />
          </svg>
          {count > 0 && (
            <span className="absolute top-0.5 right-0.5 grid size-4 place-items-center rounded-full bg-(--brand) text-[9px] font-semibold text-(--on-brand)">
              {count}
            </span>
          )}
        </span>
      </header>

      {step !== "confirmation" && <Stepper step={step} />}

      <main
        key={step}
        className={cn("flex-1 px-5 pb-6", mockup ? "overflow-hidden" : "animate-fade-up", step === "confirmation" ? "pt-6" : "pt-2")}
      >
        {step === "cart" && (
          <section aria-labelledby="bag-title">
            <div className="flex items-baseline justify-between">
              <h1 id="bag-title" className="font-display text-[30px] leading-tight tracking-(--display-tracking)">
                Your bag
              </h1>
              <span className="text-[13px] text-black/45">
                {count} {count === 1 ? "item" : "items"}
              </span>
            </div>

            <ul className="mt-4 divide-y divide-black/[0.06] border-y border-black/[0.06]">
              {inBag.length === 0 && <li className="py-8 text-center text-sm text-black/50">Your bag is empty.</li>}
              {inBag.map((item) => (
                <li key={item.index} className="flex gap-4 py-4">
                  <ProductImage image={item.image} label={item.name} size={84} />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-display text-[17px] leading-snug">{item.name}</p>
                      <p className="text-[14px] font-medium tabular-nums">{formatGBP(item.price * item.qty)}</p>
                    </div>
                    {item.detail && <p className="mt-0.5 text-[12.5px] text-black/45">{item.detail}</p>}
                    <div className="mt-auto flex items-center gap-1 pt-2">
                      <QtyButton label={`Remove one ${item.name}`} onClick={() => changeQty(item.index, -1)}>
                        −
                      </QtyButton>
                      <span className="w-6 text-center text-[13px] tabular-nums">{item.qty}</span>
                      <QtyButton label={`Add one ${item.name}`} onClick={() => changeQty(item.index, 1)}>
                        +
                      </QtyButton>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {suggestions.length > 0 && (
              <div className="mt-6">
                <p className="text-[11px] font-medium tracking-[0.16em] text-black/45 uppercase">Complete the look</p>
                {suggestions.map((s) => (
                  <div key={s.index} className="mt-3 flex items-center gap-3 rounded-2xl bg-(--brand-tint) p-3">
                    <ProductImage image={s.image} label={s.name} size={52} className="rounded-[10px]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-[15px]">{s.name}</p>
                      <p className="text-[12.5px] text-black/50">{formatGBP(s.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => changeQty(s.index, 1)}
                      className="rounded-full border border-(--brand)/25 px-3.5 py-1.5 text-[12px] font-medium text-(--brand) transition hover:bg-(--brand) hover:text-(--on-brand)"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-6 flex items-center gap-2 text-[12.5px] text-black/50">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 8h16v12H4zM4 8l2-4h12l2 4M12 8v12" strokeLinejoin="round" />
              </svg>
              Complimentary gift wrapping on every order
            </p>
          </section>
        )}

        {step === "delivery" && (
          <section aria-labelledby="delivery-title">
            <h1 id="delivery-title" className="font-display text-[30px] leading-tight tracking-(--display-tracking)">
              Delivery
            </h1>

            <div className="mt-4 flex items-start justify-between rounded-2xl border border-black/[0.07] p-4">
              <div>
                <p className="text-[11px] font-medium tracking-[0.16em] text-black/45 uppercase">Deliver to</p>
                <p className="mt-1.5 text-[14px] font-medium">A. Customer</p>
                <p className="text-[13px] text-black/55">
                  12 Sample Mews, London {boutique.postcode ?? ""}
                </p>
              </div>
              <span className="text-[12px] text-black/40 underline underline-offset-4">Change</span>
            </div>

            <fieldset className="mt-6">
              <legend className="text-[11px] font-medium tracking-[0.16em] text-black/45 uppercase">
                Delivery method
              </legend>
              <div className="mt-3 space-y-2.5">
                {(["standard", "nextday"] as const).map((id) => (
                  <DeliveryOption
                    key={id}
                    id={id}
                    selected={delivery === id}
                    onSelect={chooseDelivery}
                    title={DELIVERY[id].title}
                    price={DELIVERY[id].fee === 0 ? "Free" : formatGBP(DELIVERY[id].fee)}
                  />
                ))}
                <DeliveryOption
                  id="booster"
                  selected={delivery === "booster"}
                  onSelect={chooseDelivery}
                  title={DELIVERY.booster.title}
                  price={formatGBP(BOOSTER_FEE)}
                  highlight
                >
                  <p className="mt-2 flex items-center gap-2 text-[12.5px] text-black/70">
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500 text-emerald-500">
                      {!mockup && <span className="absolute inset-0 rounded-full animate-soft-pulse" />}
                    </span>
                    <span>
                      Estimated arrival: <strong className="font-semibold">{BOOSTER_ETA_MINUTES} min</strong>
                      {arrivalClock && <span className="text-black/45"> · by {arrivalClock}</span>}
                    </span>
                  </p>
                  <p className="mt-1 text-[11.5px] text-black/45">Hand-delivered across central London</p>
                </DeliveryOption>
              </div>
            </fieldset>

            <dl className="mt-6 space-y-2 border-t border-black/[0.06] pt-4 text-[13.5px]">
              <SummaryRow label="Subtotal" value={formatGBP(subtotal)} />
              <SummaryRow
                label="Delivery"
                value={fee === 0 ? "Free" : formatGBP(fee)}
                emphasis={delivery === "booster"}
              />
            </dl>
          </section>
        )}

        {step === "confirmation" && (
          <section aria-labelledby="confirm-title">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-(--brand) text-(--on-brand) animate-pop">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <h1 id="confirm-title" className="font-display text-[26px] leading-tight tracking-(--display-tracking)">
                  Thank you
                </h1>
                <p className="text-[12.5px] text-black/50">Order {orderNumber(boutique.slug)} is confirmed</p>
              </div>
            </div>

            {delivery === "booster" ? (
              <>
                <div className="mt-5 flex items-center justify-between rounded-2xl bg-(--brand) px-4 py-3.5 text-(--on-brand)">
                  <div>
                    <p className="text-[11px] tracking-[0.14em] uppercase opacity-70">
                      {stage === 3 ? "Delivered" : "Estimated arrival"}
                    </p>
                    <p className="mt-0.5 text-[24px] leading-none font-semibold tabular-nums">
                      {stage === 3 ? "Enjoy" : `${STAGE_ETA[stage]} min`}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[11.5px] font-medium">
                    <Bolt className="size-3.5 text-(--accent)" />
                    Booster
                  </span>
                </div>

                <TrackingMap stage={stage} live={!mockup} className="mt-3 aspect-[2/1]" />

                <ol className="mt-5" aria-label="Delivery progress">
                  {STAGES.map((s, i) => {
                    const done = i < stage || stage === 3;
                    const current = i === stage && stage !== 3;
                    return (
                      <li key={s.label} className="relative flex gap-3.5 pb-4 last:pb-0">
                        {i < STAGES.length - 1 && (
                          <span className="absolute top-5 left-[9px] h-[calc(100%-16px)] w-px bg-black/10">
                            <span
                              className="block w-px bg-(--brand) transition-[height] duration-700 ease-out"
                              style={{ height: i < stage ? "100%" : "0%" }}
                            />
                          </span>
                        )}
                        <span
                          className={cn(
                            "relative z-10 mt-0.5 grid size-[19px] shrink-0 place-items-center rounded-full border transition-colors duration-500",
                            done && "border-(--brand) bg-(--brand) text-(--on-brand)",
                            current && "border-(--brand) bg-white text-(--brand)",
                            !done && !current && "border-black/15 bg-white",
                          )}
                        >
                          {done && (
                            <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                          {current && (
                            <span className={cn("size-2 rounded-full bg-current", !mockup && "animate-soft-pulse")} />
                          )}
                        </span>
                        <div className={cn("transition-opacity duration-500", !done && !current && "opacity-40")}>
                          <p className="text-[14px] font-medium leading-tight">{s.label}</p>
                          <p className="mt-0.5 text-[12.5px] text-black/50">{s.detail(boutique)}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </>
            ) : (
              <>
                <div className="mt-6 rounded-2xl border border-black/[0.07] p-5">
                  <p className="text-[11px] font-medium tracking-[0.16em] text-black/45 uppercase">
                    {DELIVERY[delivery].title}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-black/70">
                    {delivery === "nextday"
                      ? "Your order will arrive tomorrow. We will email you tracking details once it ships."
                      : "Your order will arrive in 3-5 working days. We will email you tracking details once it ships."}
                  </p>
                </div>
                <div className="mt-3 rounded-2xl bg-(--brand-tint) p-5">
                  <p className="flex items-center gap-2 text-[14px] font-medium">
                    <Bolt className="size-4 text-(--accent)" /> See the Booster experience
                  </p>
                  <p className="mt-1.5 text-[13px] text-black/60">
                    Try the demo again with within-the-hour delivery to see live tracking.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      chooseDelivery("booster");
                      go("delivery");
                    }}
                    className="mt-3 rounded-full bg-(--brand) px-4 py-2 text-[12.5px] font-medium text-(--on-brand)"
                  >
                    Choose Booster instead
                  </button>
                </div>
              </>
            )}
          </section>
        )}
      </main>

      {/* Footer action bar */}
      <footer
        className={cn(
          "shrink-0 border-t border-black/[0.06] bg-white/95 px-5 pt-3 backdrop-blur",
          mockup ? "pb-8" : "sticky bottom-0 pb-[max(1rem,env(safe-area-inset-bottom))]",
        )}
      >
        {step !== "confirmation" && (
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-[13px] text-black/55">{step === "cart" ? "Subtotal" : "Total"}</span>
            <span className="text-[18px] font-semibold tabular-nums">
              {formatGBP(step === "cart" ? subtotal : shownTotal)}
            </span>
          </div>
        )}
        {step === "cart" && (
          <PrimaryButton disabled={count === 0} onClick={() => go("delivery")}>
            Checkout
          </PrimaryButton>
        )}
        {step === "delivery" && <PrimaryButton onClick={placeOrder}>Place order</PrimaryButton>}
        {step === "confirmation" &&
          (mockup ? (
            <PrimaryButton onClick={() => undefined} variant="outline">
              Back to shop
            </PrimaryButton>
          ) : (
            <div className="flex gap-2">
              <PrimaryButton onClick={restart} variant="outline">
                Restart demo
              </PrimaryButton>
              <Link
                href={`/demo/${boutique.slug}/admin`}
                className="flex h-12 flex-1 items-center justify-center rounded-full bg-(--brand) text-[14px] font-medium text-(--on-brand)"
              >
                Boutique view
              </Link>
            </div>
          ))}
      </footer>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: Array<{ id: Step; label: string }> = [
    { id: "cart", label: "Bag" },
    { id: "delivery", label: "Delivery" },
    { id: "confirmation", label: "Confirmation" },
  ];
  const active = steps.findIndex((s) => s.id === step);
  return (
    <nav aria-label="Checkout progress" className="flex shrink-0 gap-2 px-5 pt-4 pb-3">
      {steps.map((s, i) => (
        <div key={s.id} className="flex-1">
          <div className="h-[2px] overflow-hidden rounded-full bg-black/[0.07]">
            <div
              className="h-full bg-(--brand) transition-[width] duration-500 ease-out"
              style={{ width: i <= active ? "100%" : "0%" }}
            />
          </div>
          <p
            className={cn(
              "mt-1.5 text-[10.5px] tracking-[0.12em] uppercase",
              i === active ? "font-medium text-black/75" : "text-black/35",
            )}
          >
            {s.label}
          </p>
        </div>
      ))}
    </nav>
  );
}

function DeliveryOption({
  id,
  title,
  price,
  selected,
  onSelect,
  highlight,
  children,
}: {
  id: DeliveryId;
  title: string;
  price: string;
  selected: boolean;
  onSelect: (id: DeliveryId) => void;
  highlight?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "relative block cursor-pointer rounded-2xl border p-4 transition-all duration-300",
        highlight
          ? selected
            ? "border-(--brand) bg-(--brand-tint) shadow-[0_10px_30px_-18px_var(--brand)]"
            : "border-(--accent-soft) bg-(--brand-tint)"
          : selected
            ? "border-(--brand)"
            : "border-black/[0.08] hover:border-black/20",
      )}
    >
      <input
        type="radio"
        name="delivery"
        value={id}
        checked={selected}
        onChange={() => onSelect(id)}
        className="peer sr-only"
      />
      <div className="flex items-center gap-3 peer-focus-visible:[&>span:first-child]:ring-2">
        <span
          className={cn(
            "grid size-[18px] shrink-0 place-items-center rounded-full border transition-colors",
            selected ? "border-(--brand)" : "border-black/25",
          )}
          aria-hidden
        >
          <span
            className={cn(
              "size-2 rounded-full bg-(--brand) transition-transform duration-200",
              selected ? "scale-100" : "scale-0",
            )}
          />
        </span>
        <span className="flex flex-1 items-center gap-2 text-[14px] font-medium">
          {highlight && (
            <span className="grid size-6 place-items-center rounded-full bg-(--brand) text-(--accent)">
              <Bolt className="size-3.5" />
            </span>
          )}
          {title}
        </span>
        <span className="text-[14px] font-medium tabular-nums">{price}</span>
      </div>
      {children && <div className="pl-[30px]">{children}</div>}
      {highlight && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-(--brand) px-2 py-0.5 text-[9.5px] font-semibold tracking-[0.14em] text-(--on-brand) uppercase">
          Fastest
        </span>
      )}
    </label>
  );
}

function SummaryRow({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-black/55">{label}</dt>
      <dd className={cn("tabular-nums", emphasis && "font-medium text-(--brand)")}>{value}</dd>
    </div>
  );
}

function QtyButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-7 place-items-center rounded-full border border-black/10 text-[14px] text-black/60 transition hover:border-black/30"
    >
      {children}
    </button>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  variant = "solid",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "solid" | "outline";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-12 flex-1 rounded-full px-6 text-[14px] font-medium tracking-wide transition active:scale-[0.99] disabled:opacity-40",
        variant === "solid"
          ? "w-full bg-(--brand) text-(--on-brand) hover:opacity-95"
          : "w-full border border-black/12 text-black/75 hover:border-black/30",
      )}
    >
      {children}
    </button>
  );
}
