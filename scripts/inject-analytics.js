#!/usr/bin/env node
/**
 * Build-time analytics injection.
 *
 * BrandKit stays a single static file, but we never commit tracking IDs to the
 * repo. Instead, the committed index.html holds inert placeholders, and this
 * script swaps in the real IDs from environment variables at deploy time.
 *
 * Environment variables (set them in your host, e.g. Cloudflare → Settings → Variables):
 *   GA_MEASUREMENT_ID   Google Analytics 4 measurement ID, e.g. "G-XXXXXXXXXX"
 *   CLARITY_PROJECT_ID  Microsoft Clarity project id (optional)
 *
 * Output: a `dist/` folder containing the deployable site. If no env vars are
 * set, the placeholders are blanked out and analytics simply stays off.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "dist");

// Load a local .env (git-ignored) without any dependency. Real environment
// variables always win, so hosts like Vercel keep full control.
const envPath = path.join(ROOT, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

const ga = (process.env.GA_MEASUREMENT_ID || "").trim();
const clarity = (process.env.CLARITY_PROJECT_ID || "").trim();

let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
html = html
  .split("__GA_MEASUREMENT_ID__").join(ga)
  .split("__CLARITY_PROJECT_ID__").join(clarity);

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "index.html"), html);

// Copy docs/ (e.g. og-image.png) so Open Graph assets resolve, if present.
const docs = path.join(ROOT, "docs");
if (fs.existsSync(docs)) {
  fs.cpSync(docs, path.join(OUT, "docs"), { recursive: true });
}

// Crawler and indexing files sit next to index.html in the deployed root.
for (const name of ["robots.txt", "llms.txt", "sitemap.xml", "_headers"]) {
  const from = path.join(ROOT, name);
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(OUT, name));
}

console.log(
  `[inject-analytics] built dist/  GA4: ${ga ? "set (" + ga + ")" : "off"}  Clarity: ${clarity ? "set" : "off"}`
);
