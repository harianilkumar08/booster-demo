import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BoutiqueLogo, BoutiqueTheme } from "@/components/BoutiqueTheme";
import { DemoBanner } from "@/components/DemoBanner";
import { Bolt, ProductImage } from "@/components/ProductImage";
import { boutiques, getBoutique } from "@/lib/boutiques";
import { cn, formatGBP, seededRandom } from "@/lib/format";
import { BOOSTER_FEE, type Boutique } from "@/lib/types";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return boutiques.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const b = getBoutique(slug);
  return { title: b ? `${b.name} · Booster orders` : "Booster orders" };
}

const STATUSES = ["Delivered", "Delivered", "Delivered", "On the way", "Rider assigned", "Packing", "New"] as const;
type Status = (typeof STATUSES)[number];
const CUSTOMERS = ["E. Hartley", "S. Okafor", "M. Lindqvist", "R. Patel", "C. Moreau", "J. Ashworth", "A. Novak", "T. Brennan"];
const DISTRICTS = ["W1K", "W1J", "SW1X", "SW3", "SW7", "W8", "NW1", "WC2E", "W1U", "SW10"];

interface FakeOrder {
  id: string;
  time: string;
  customer: string;
  district: string;
  productIndex: number;
  status: Status;
  eta: string;
}

function fakeOrders(b: Boutique): FakeOrder[] {
  const rand = seededRandom(`admin-${b.slug}`);
  let minutes = 10 * 60 + 5;
  return STATUSES.map((status, i) => {
    minutes += 18 + Math.floor(rand() * 40);
    const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mm = String(minutes % 60).padStart(2, "0");
    const etaMins = 12 + Math.floor(rand() * 35);
    return {
      id: `BST-${String(4100 + i * 7 + Math.floor(rand() * 6)).padStart(4, "0")}`,
      time: `${hh}:${mm}`,
      customer: CUSTOMERS[Math.floor(rand() * CUSTOMERS.length)] ?? "A. Customer",
      district: DISTRICTS[Math.floor(rand() * DISTRICTS.length)] ?? "W1",
      productIndex: Math.floor(rand() * b.products.length),
      status,
      eta: status === "Delivered" ? "Delivered" : status === "New" ? "Awaiting rider" : `${etaMins} min`,
    };
  }).reverse();
}

const STATUS_STYLE: Record<Status, string> = {
  Delivered: "bg-black/[0.05] text-black/55",
  "On the way": "bg-emerald-50 text-emerald-700",
  "Rider assigned": "bg-sky-50 text-sky-700",
  Packing: "bg-amber-50 text-amber-700",
  New: "bg-(--brand) text-(--on-brand)",
};

export default async function AdminPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const boutique = getBoutique(slug);
  if (!boutique) notFound();

  const orders = fakeOrders(boutique);
  const active = orders.filter((o) => o.status !== "Delivered").length;
  const goods = orders.reduce((n, o) => n + (boutique.products[o.productIndex]?.price ?? 0), 0);

  return (
    <BoutiqueTheme boutique={boutique} className="min-h-dvh bg-[#faf9f6]">
      <DemoBanner />
      <header className="border-b border-black/[0.06] bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-4">
            <BoutiqueLogo boutique={boutique} className="text-(--brand)" />
            <span className="hidden h-5 w-px bg-black/10 sm:block" />
            <span className="hidden items-center gap-1.5 text-[13px] text-black/55 sm:flex">
              <Bolt className="size-3.5 text-(--accent)" /> Booster orders
            </span>
          </div>
          <Link
            href={`/demo/${boutique.slug}`}
            className="rounded-full border border-black/10 px-4 py-2 text-[12.5px] font-medium transition hover:border-black/30"
          >
            View checkout
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        <p className="text-[11px] font-medium tracking-[0.18em] text-black/45 uppercase">
          {boutique.neighbourhood} · Today
        </p>
        <h1 className="mt-2 font-display text-[36px] leading-tight tracking-(--display-tracking)">
          Booster orders
        </h1>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-(--accent-soft) bg-(--brand-tint) p-5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-(--brand) text-(--accent)">
            <Bolt className="size-4" />
          </span>
          <p className="text-[14.5px] leading-relaxed text-black/75">
            <strong className="font-semibold text-black">
              You keep your full delivery margin; Booster is charged to the customer.
            </strong>{" "}
            The {formatGBP(BOOSTER_FEE)} fee is added at checkout, and a rider collects from your door.
          </p>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-black/[0.06] ring-1 ring-black/[0.06] md:grid-cols-4">
          <Stat label="Booster orders" value={String(orders.length)} />
          <Stat label="In progress" value={String(active)} />
          <Stat label="Order value" value={formatGBP(goods)} />
          <Stat label="Delivery cost to you" value={formatGBP(0)} />
        </dl>

        <section className="mt-10" aria-labelledby="orders-title">
          <div className="flex items-baseline justify-between">
            <h2 id="orders-title" className="text-[15px] font-semibold">
              Incoming orders
            </h2>
            <span className="text-[12px] text-black/40">Sample data</span>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06]">
            <div className="hidden grid-cols-[1.1fr_2.2fr_1.2fr_1.1fr_1fr] gap-4 border-b border-black/[0.06] px-5 py-3 text-[11px] font-medium tracking-[0.14em] text-black/40 uppercase md:grid">
              <span>Order</span>
              <span>Item</span>
              <span>Customer</span>
              <span>Status</span>
              <span className="text-right">Rider ETA</span>
            </div>
            <ul className="divide-y divide-black/[0.06]">
              {orders.map((o) => {
                const product = boutique.products[o.productIndex];
                return (
                  <li
                    key={o.id}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-4 md:grid-cols-[1.1fr_2.2fr_1.2fr_1.1fr_1fr]"
                  >
                    <div className="row-span-2 md:row-span-1">
                      <p className="text-[13px] font-medium tabular-nums">{o.id}</p>
                      <p className="text-[12px] text-black/45 tabular-nums">{o.time}</p>
                    </div>
                    <div className="flex min-w-0 items-center gap-3">
                      {product && <ProductImage image={product.image} label={product.name} size={40} className="rounded-[10px]" />}
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px]">{product?.name}</p>
                        <p className="text-[12px] text-black/45">{product ? formatGBP(product.price) : ""}</p>
                      </div>
                    </div>
                    <p className="hidden text-[13px] text-black/70 md:block">
                      {o.customer} <span className="text-black/40">· {o.district}</span>
                    </p>
                    <span
                      className={cn(
                        "justify-self-end rounded-full px-2.5 py-1 text-[11.5px] font-medium md:justify-self-start",
                        STATUS_STYLE[o.status],
                      )}
                    >
                      {o.status}
                    </span>
                    <p className="col-start-3 justify-self-end text-[12.5px] text-black/55 tabular-nums md:col-start-auto">
                      {o.eta}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <p className="mt-8 text-center text-[12px] text-black/40">
          Concept view for {boutique.name}. Orders, names and times are invented for this demo.
        </p>
      </main>
    </BoutiqueTheme>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-5 py-5">
      <dt className="text-[11.5px] text-black/45">{label}</dt>
      <dd className="mt-1.5 text-[22px] font-semibold tracking-tight tabular-nums">{value}</dd>
    </div>
  );
}
