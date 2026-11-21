# booster-demo

A static, data-driven concept demo for **Booster**, a London startup that adds a flat **£25 within-the-hour delivery** option to luxury boutique checkouts. (Pilot partner: Luxury Boutique, central London.)

A pitch email links to a live demo of the boutique's own checkout with Booster built in. Each boutique gets:

- its own branded demo: `/demo/[slug]` (bag → delivery with Booster → confirmation with live tracking)
- a boutique-side order view: `/demo/[slug]/admin`
- three phone mockup PNGs: `public/emails/[slug]/{cart,checkout,tracking}.png`
- a ready-to-send HTML email (plus a plain-text version): `emails/[slug].html`, `emails/[slug].txt`

There's no backend, no API calls, no env vars and no paid services. Everything is generated from `data/boutiques.json`. The six boutiques in it are fictional.

## Stack

Next.js (App Router, `output: "export"`) · TypeScript (strict) · Tailwind CSS v4 · Playwright (screenshots only) · ESLint

## Run it

```bash
npm i
npm run build:all   # static build → mockup PNGs → emails
npm run dev         # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Static export to `out/` |
| `npm run mockups` | Installs Playwright Chromium if needed, serves `out/`, screenshots every `/mockups/[slug]/[screen]` page to `public/emails/[slug]/*.png` (and copies them into `out/`) |
| `npm run emails` | Renders `emails/[slug].html` + `.txt` from one template |
| `npm run build:all` | All three in order |
| `npm run preview` | Serves `out/` at http://localhost:4173 |
| `npm run lint` / `npm run typecheck` | ESLint / `tsc --noEmit` |

## Add a boutique

1. Add an entry to `data/boutiques.json`:

   ```json
   {
     "slug": "new-boutique",
     "name": "New Boutique",
     "neighbourhood": "Mayfair",
     "postcode": "W1",
     "brandColor": "#1F2E27",
     "accentColor": "#C8A96A",
     "fontStyle": "serif",
     "logoText": "NEW BOUTIQUE",
     "products": [
       { "name": "Silk Scarf", "price": 385, "detail": "Ivory · 90 cm", "image": "icon:scarf" },
       { "name": "Card Holder", "price": 240, "image": "👛" },
       { "name": "Tote", "price": 950, "image": "icon:bag" }
     ]
   }
   ```

   `image` is an emoji or a built-in line icon: `icon:bag`, `wallet`, `scarf`, `sweater`, `boot`, `sunglasses`, `earring`, `fragrance`, `dress`, `jacket`, `ring`, `hat`, `candle`, `watch`, `vase`. The first two products start in the bag; the third appears under "Complete the look".

2. Run `npm run build:all`. The demo pages, mockup PNGs and email are all created automatically.

## Deploy for free (Vercel)

1. Set `siteUrl` in `site.config.json` to your production URL (e.g. `https://booster-demo.vercel.app`), then run `npm run build:all` so the emails point at it.
2. Commit, including `public/emails/**` (the generated PNGs). The hosted build only runs `next build`, so it doesn't need Playwright.
3. Push to GitHub and import the repo at vercel.com/new. Vercel detects Next.js; the defaults work, and the static export in `out/` is served.

**Netlify:** build command `npm run build`, publish directory `out`.
**GitHub Pages:** add `basePath: "/<repo>"` to `next.config.ts`, run `npm run build`, and publish `out/`.

## How it's organised

```
app/
  page.tsx                       landing page: demo list + "How Booster works"
  demo/[slug]/page.tsx           boutique checkout demo
  demo/[slug]/admin/page.tsx     boutique-side Booster orders (fake data)
  mockups/[slug]/[screen]/       phone-framed screens used for the PNGs
components/                      Checkout flow, TrackingMap, PhoneFrame, theming, icons
data/boutiques.json              the single source of truth
lib/                             types, formatting, tracking stub
scripts/                         static server, mockup + email generators, email template
site.config.json                 public site URL, contact email, placeholder address
emails/                          generated emails (.html + .txt)
public/emails/                   generated mockup PNGs
```

### Tracking

Every page logs a `page_view` event to the console, including the `?src=` query value (e.g. `?src=email-checkout`). The value is kept in `sessionStorage` so later events keep their attribution. Checkout actions also log `checkout_step`, `delivery_selected`, `order_placed` and `tracking_stage`. To send these to a real analytics endpoint later, edit `track()` in `lib/track.ts`. Nothing leaves the browser today.

### Demo hygiene

Every demo page shows a "Concept demo by Booster. Not a live store." banner. All pages carry `<meta name="robots" content="noindex">`.

## Next steps

- **AI research and email agent (not built).** It would plug in upstream of `data/boutiques.json`: research a target boutique (name, neighbourhood, brand colours, typography, three representative products), then append a validated entry to that file. `npm run build:all` already turns each entry into a demo, mockups and an email. A second step could personalise the intro copy in `scripts/email-template.ts` and send through an email provider, with a human approving each send.
- Replace `track()` with a real endpoint (for example a serverless function or a privacy-friendly analytics tool) to measure email clicks by `src`.
- Add real product photography per boutique (an `image` URL option alongside emoji and icons).
- Add a real unsubscribe link and company address in `site.config.json` before sending any email.

## License

MIT
