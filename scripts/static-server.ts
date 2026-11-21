import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import path from "node:path";

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function resolveFile(root: string, urlPath: string): string | null {
  const clean = decodeURIComponent(urlPath.split("?")[0] ?? "/").replace(/\/+$/, "") || "/";
  const base = path.join(root, path.normalize(clean));
  if (!base.startsWith(root)) return null;
  const candidates = clean === "/" ? [path.join(root, "index.html")] : [base, `${base}.html`, path.join(base, "index.html")];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

/** Serves a Next.js static export folder (out/) on a local port. No dependencies. */
export function startStaticServer(root: string, port = 0): Promise<{ server: Server; url: string }> {
  const absRoot = path.resolve(root);
  const server = createServer((req, res) => {
    const file = resolveFile(absRoot, req.url ?? "/");
    if (!file) {
      const notFound = path.join(absRoot, "404.html");
      res.writeHead(404, { "content-type": TYPES[".html"]! });
      if (existsSync(notFound)) createReadStream(notFound).pipe(res);
      else res.end("Not found");
      return;
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => {
      const { port: actual } = server.address() as AddressInfo;
      resolve({ server, url: `http://127.0.0.1:${actual}` });
    });
  });
}
