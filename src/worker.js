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
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
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
      if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
      if (request.method !== "POST") return json({ error: "Use POST" }, 405);
      if (!env.AI) return json({ error: "Workers AI is not bound to this worker" }, 501);

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Bad JSON" }, 400);
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
        if (!names.length) return json({ error: "Nothing usable came back" }, 502);
        return json({ names });
      } catch (err) {
        return json({ error: "Model call failed", detail: String(err).slice(0, 200) }, 502);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
