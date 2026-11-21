export type FontStyle = "serif" | "sans";

export interface Product {
  name: string;
  /** Price in GBP (whole pounds). */
  price: number;
  /** Optional variant line, e.g. "Camel · M". */
  detail?: string;
  /** An emoji (e.g. "👜") or a built-in line icon written as "icon:<name>". */
  image: string;
}

export interface Boutique {
  slug: string;
  name: string;
  neighbourhood: string;
  postcode?: string;
  brandColor: string;
  accentColor: string;
  fontStyle: FontStyle;
  logoText: string;
  products: Product[];
}

export const SCREENS = ["cart", "checkout", "tracking"] as const;
export type Screen = (typeof SCREENS)[number];

export const BOOSTER_FEE = 25;
export const NEXT_DAY_FEE = 8;
export const BOOSTER_ETA_MINUTES = 47;
