import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BoutiqueTheme } from "@/components/BoutiqueTheme";
import { Checkout, type DeliveryId, type Step } from "@/components/Checkout";
import { PhoneFrame } from "@/components/PhoneFrame";
import { boutiques, getBoutique } from "@/lib/boutiques";
import { SCREENS, type Screen } from "@/lib/types";

type Params = { slug: string; screen: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return boutiques.flatMap((b) => SCREENS.map((screen) => ({ slug: b.slug, screen })));
}

export const metadata: Metadata = { title: "Booster mockup" };

const SCREEN_STATE: Record<Screen, { step: Step; delivery: DeliveryId }> = {
  cart: { step: "cart", delivery: "standard" },
  checkout: { step: "delivery", delivery: "booster" },
  tracking: { step: "confirmation", delivery: "booster" },
};

export default async function MockupPage({ params }: { params: Promise<Params> }) {
  const { slug, screen } = await params;
  const boutique = getBoutique(slug);
  if (!boutique || !(SCREENS as readonly string[]).includes(screen)) notFound();
  const state = SCREEN_STATE[screen as Screen];

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#ece8e1] p-10">
      {/* The screenshot script captures #mockup (frame plus a margin for the shadow). */}
      <div id="mockup" className="p-6">
        <BoutiqueTheme boutique={boutique}>
          <PhoneFrame>
            <Checkout
              boutique={boutique}
              initialStep={state.step}
              initialDelivery={state.delivery}
              mockup
              mockupStage={2}
            />
          </PhoneFrame>
        </BoutiqueTheme>
      </div>
    </div>
  );
}
