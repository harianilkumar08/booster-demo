import { readFileSync } from "node:fs";
import path from "node:path";
import type { Boutique } from "../lib/types";

const root = path.resolve(import.meta.dirname, "..");

export const ROOT = root;

export function loadBoutiques(): Boutique[] {
  return JSON.parse(readFileSync(path.join(root, "data/boutiques.json"), "utf8")) as Boutique[];
}

export interface SiteConfig {
  siteUrl: string;
  companyName: string;
  contactEmail: string;
  companyAddress: string;
}

export function loadSiteConfig(): SiteConfig {
  const config = JSON.parse(readFileSync(path.join(root, "site.config.json"), "utf8")) as SiteConfig;
  return { ...config, siteUrl: config.siteUrl.replace(/\/+$/, "") };
}
