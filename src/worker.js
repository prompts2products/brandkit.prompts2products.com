/**
 * BrandKit worker.
 *
 * The site is static. This adds exactly one endpoint: POST /api/names,
 * which asks Cloudflare Workers AI for extra brand name ideas.
 *
 * Why server side: keyless public AI endpoints now block browser-origin
 * requests behind a bot challenge, and we will not ship a key to the
 * browser. Workers AI runs on Cloudflare's free allocation, so this stays
 * free with no card and nothing for the visitor to sign up for.
 *
 * Everything else about BrandKit still runs in the visitor's browser.
 */

const MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8";

/**
 * There is no API key anywhere in this project. Workers AI is reached
 * through the env.AI binding, which Cloudflare resolves inside the
 * runtime, so no credential exists to leak: not in the page, not in the
 * repo, not in this file. The browser only ever sees /api/names.
 *
 * What does need protecting is the account's AI allowance, since this
 * endpoint spends it. Hence the origin check and the rate limit below.
 */
const ALLOWED_ORIGINS = [
  "https://brandkit.prompts2products.com",
  "https://brandkit-prompts2products-com.prompts2products.workers.dev",
];
const isAllowedOrigin = (o) =>
  !!o && (ALLOWED_ORIGINS.includes(o) || /^http:\/\/localhost(:\d+)?$/.test(o));

const corsFor = (origin) => ({
  "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin",
});

const json = (body, status = 200, origin = "") =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsFor(origin) },
  });

/** Keep the model's answer to things that look like brand names. */
function parseNames(text) {
  const seen = new Set();
  return String(text || "")
    .split(/[,\n]/)
    .map((t) => t.replace(/^[\s\-*\d.)\]"']+/, "").replace(/["'\s]+$/, "").trim())
    .filter((t) => {
      if (t.length < 3 || t.length > 25) return false;
      if (/[:;!?]/.test(t)) return false;
      if (t.split(/\s+/).length > 3) return false;
      const k = t.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, 8);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/names") {
      const origin = request.headers.get("Origin") || "";

      if (request.method === "OPTIONS") return new Response(null, { headers: corsFor(origin) });
      if (request.method !== "POST") return json({ error: "Use POST" }, 405, origin);

      // This endpoint exists for the page in front of it. Anything else is
      // spending someone else's AI allowance.
      if (!isAllowedOrigin(origin)) return json({ error: "Not allowed" }, 403, origin);

      if (env.NAMES_RATE) {
        const ip = request.headers.get("CF-Connecting-IP") || "anon";
        const { success } = await env.NAMES_RATE.limit({ key: ip });
        if (!success) return json({ error: "Too many requests. Try again in a minute." }, 429, origin);
      }

      if (!env.AI) return json({ error: "Name service unavailable" }, 503, origin);

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Bad request" }, 400, origin);
      }

      // Never pass visitor text straight through at length.
      const what = String(body.what || "a small business").slice(0, 80);
      const style = String(body.style || "").slice(0, 120);

      const prompt =
        `Brand name ideas for ${what}. Style: ${style}. ` +
        `Give 8 short brand names. One or two real words each, with a space between them, ` +
        `never smashed together. No explanations, no numbering, no quotes. ` +
        `Reply as a comma separated list only.`;

      try {
        const out = await env.AI.run(MODEL, {
          messages: [
            { role: "system", content: "You name brands. You reply with a comma separated list and nothing else." },
            { role: "user", content: prompt },
          ],
          max_tokens: 160,
        });
        const names = parseNames(out.response);
        if (!names.length) return json({ error: "Nothing usable came back" }, 502, origin);
        return json({ names }, 200, origin);
      } catch (err) {
        // Logged for us, not returned: the raw error names internal models
        // and Cloudflare error codes, which the public does not need.
        console.error("names endpoint failed:", err);
        return json({ error: "The model did not answer" }, 502, origin);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
