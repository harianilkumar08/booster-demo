import { existsSync } from "node:fs";
import { startStaticServer } from "./static-server";

if (!existsSync("out")) {
  console.error("No out/ folder. Run `npm run build` first.");
  process.exit(1);
}
const port = Number(process.argv[2] ?? 4173);
const { url } = await startStaticServer("out", port);
console.log(`Serving the static export at ${url}`);
