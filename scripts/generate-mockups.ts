/**
 * Screenshots /mockups/[slug]/[screen] for every boutique and saves PNGs to
 * public/emails/[slug]/[screen].png (and copies them into out/ so the current
 * build serves them too). Run after `npm run build`.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { SCREENS } from "../lib/types";
import { loadBoutiques, ROOT } from "./data";
import { startStaticServer } from "./static-server";

const OUT = path.join(ROOT, "out");
const DEST = path.join(ROOT, "public/emails");

async function main() {
  if (!existsSync(OUT)) {
    console.error("No out/ folder found. Run `npm run build` first (or use `npm run build:all`).");
    process.exit(1);
  }

  const boutiques = loadBoutiques();
  const { server, url } = await startStaticServer(OUT);
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1000, height: 1100 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.on("pageerror", (err) => console.error("  page error:", err.message));

  let count = 0;
  try {
    for (const b of boutiques) {
      const dir = path.join(DEST, b.slug);
      mkdirSync(dir, { recursive: true });
      for (const screen of SCREENS) {
        const target = `${url}/mockups/${b.slug}/${screen}`;
        const res = await page.goto(target, { waitUntil: "networkidle" });
        if (!res || !res.ok()) throw new Error(`Failed to load ${target} (${res?.status()})`);
        await page.addStyleTag({
          content: `html,body,body>div{background:transparent!important}
            *,*::before,*::after{animation:none!important;transition:none!important}`,
        });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(150);

        const file = path.join(dir, `${screen}.png`);
        await page.locator("#mockup").screenshot({ path: file, omitBackground: true });

        const outDir = path.join(OUT, "emails", b.slug);
        mkdirSync(outDir, { recursive: true });
        copyFileSync(file, path.join(outDir, `${screen}.png`));

        count++;
        console.log(`  ✓ ${path.relative(ROOT, file)}`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`Generated ${count} mockups for ${boutiques.length} boutiques.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
