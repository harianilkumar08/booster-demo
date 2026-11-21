import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BoutiqueTheme } from "@/components/BoutiqueTheme";
import { Checkout } from "@/components/Checkout";
import { DemoBanner } from "@/components/DemoBanner";
import { boutiques, getBoutique } from "@/lib/boutiques";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return boutiques.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const b = getBoutique(slug);
  return { title: b ? `${b.name} checkout · Booster concept` : "Booster concept" };
}

export default async function DemoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const boutique = getBoutique(slug);
  if (!boutique) notFound();

  return (
    <BoutiqueTheme boutique={boutique} className="min-h-dvh bg-white md:bg-(--brand-tint)">
      <DemoBanner />
      <div className="mx-auto hidden max-w-[440px] items-center justify-between px-1 pt-8 pb-4 text-[12px] text-black/50 md:flex">
        <Link href="/" className="transition hover:text-black">
          ← All demos
        </Link>
        <span>
          {boutique.name} · {boutique.neighbourhood}
        </span>
        <Link href={`/demo/${boutique.slug}/admin`} className="transition hover:text-black">
          Boutique view →
        </Link>
      </div>
      <div className="mx-auto max-w-[440px] md:mb-12 md:overflow-hidden md:rounded-[28px] md:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] md:ring-1 md:ring-black/5">
        <Checkout boutique={boutique} />
      </div>
    </BoutiqueTheme>
  );
}
