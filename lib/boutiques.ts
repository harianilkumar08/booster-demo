import data from "@/data/boutiques.json";
import type { Boutique } from "./types";

export const boutiques = data as Boutique[];

export function getBoutique(slug: string): Boutique | undefined {
  return boutiques.find((b) => b.slug === slug);
}
