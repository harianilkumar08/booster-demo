/**
 * Builds emails/[slug].html (and a plain-text .txt alternative) for every
 * boutique from one template. Image dimensions are read from the generated PNGs.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { SCREENS } from "../lib/types";
import { loadBoutiques, loadSiteConfig, ROOT } from "./data";
import { renderEmailHtml, renderEmailText, type EmailImage } from "./email-template";

const DISPLAY_WIDTH = 240;

function pngSize(file: string): { width: number; height: number } | null {
  if (!existsSync(file)) return null;
  const buf = readFileSync(file);
  if (buf.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const config = loadSiteConfig();
const boutiques = loadBoutiques();
const outDir = path.join(ROOT, "emails");
mkdirSync(outDir, { recursive: true });

let missing = 0;
for (const b of boutiques) {
  const images: EmailImage[] = SCREENS.map((screen) => {
    const size = pngSize(path.join(ROOT, "public/emails", b.slug, `${screen}.png`));
    if (!size) missing++;
    const ratio = size ? size.height / size.width : 1.95;
    return {
      screen,
      src: `${config.siteUrl}/emails/${b.slug}/${screen}.png`,
      width: DISPLAY_WIDTH,
      height: Math.round(DISPLAY_WIDTH * ratio),
    };
  });
  writeFileSync(path.join(outDir, `${b.slug}.html`), renderEmailHtml(b, config, images));
  writeFileSync(path.join(outDir, `${b.slug}.txt`), renderEmailText(b, config));
  console.log(`  ✓ emails/${b.slug}.html`);
}
if (missing) console.warn(`Note: ${missing} mockup PNG(s) not found yet. Run \`npm run mockups\` first.`);
console.log(`Generated ${boutiques.length} emails using siteUrl ${config.siteUrl}`);
