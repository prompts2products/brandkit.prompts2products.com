# BrandKit

**A whole brand kit from five plain-English questions. Free, no sign up, runs in your browser.**

> **▶️ Try it live:** [brandkit.prompts2products.com](https://brandkit.prompts2products.com)

Answer five questions about what you're making and how you want it to feel. BrandKit gives you back a colour palette that actually passes contrast checks, a font pairing, a logo, name ideas built from your trade, and a brand guide you can print to PDF.

No designer. No account. Nothing uploaded.

---

## What you get

| | |
|---|---|
| **Colour** | Primary, hover, soft, secondary, accent, backgrounds, borders, four ink steps, status colours and a 50–900 ramp |
| **Type** | A display, body and mono pairing chosen to match your style |
| **Logo** | 1,553 searchable icons + 35 hand-drawn marks, in 10 outer shapes, exported as SVG |
| **Names** | Built from a trade lexicon, not random mashups. Optional free-AI button for more |
| **Files** | Logo SVG, CSS custom properties, JSON, and a printable brand guide |

## Why the colours are trustworthy

Palettes are generated in **OKLCH**, not HSL, so lightness means the same thing at every hue. Before anything renders, every pair that carries text is measured and nudged until it passes:

- Body text on its background: **7:1** or better
- Text on your primary colour: **4.5:1** or better
- Status colours on the background: **4.5:1** or better

The kit ships you the contrast table so you can see the numbers yourself. A palette that fails isn't shown to you and fixed later; it can't be generated in the first place.

## How it works

1. **What are you making?** — app, newsletter, agency, shop, community or local business
2. **What do you do?** *(optional)* — your trade, which picks your icon and drives the name ideas
3. **What style do you want?** — eight styles, each showing the real colours it produces
4. **How bright?** and **how many colours?** and **what background?**

Every option previews the actual palette you'd get. If none of the options fit, there's a box where you describe it in your own words; a keyword reader with negation handling works out what you meant, with no AI call.

## Privacy

Everything runs in your browser. Your answers live in your own `localStorage` and nowhere else.

The single exception is opt-in and clearly labelled: the **"Get more ideas from a free AI"** button on the results page posts your trade and style to this site's own `/api/names` endpoint, which asks Cloudflare Workers AI for extra name suggestions. No key is ever in the page and no third party is involved. Don't press it and nothing leaves your machine.

## Run it locally

It's one HTML file with zero dependencies.

```bash
git clone https://github.com/prompts2products/brandkit.prompts2products.com.git
cd brandkit.prompts2products.com
open index.html
```

That's it. No build, no server, no `npm install`.

## Deploying

The committed `index.html` holds inert analytics placeholders. A tiny build step swaps in real IDs from environment variables, so no tracking ID is ever committed:

```bash
cp .env.example .env     # add your GA4 / Clarity IDs
node scripts/inject-analytics.js   # writes dist/
```

With no env vars set, the placeholders are blanked and analytics simply stays off.

<details>
<summary><strong>Cloudflare Workers</strong> (how brandkit.prompts2products.com is hosted)</summary>

`wrangler.jsonc` is already configured: it runs the build command, serves `dist/`, and binds the custom domain.

```bash
npx wrangler deploy
```

Set `GA_MEASUREMENT_ID` and `CLARITY_PROJECT_ID` as environment variables in the Cloudflare dashboard so they're injected at build time.
</details>

## Credits

Icons are [Lucide](https://lucide.dev) (ISC licence), inlined as compact draw commands so the tool still works offline. Fonts are served by Google Fonts. Optional AI names come from Cloudflare Workers AI, on its free allocation.

## Licence

MIT. See [LICENSE](LICENSE).

---

**BrandKit is a tool by [Prompts2Products](https://prompts2products.com)**, a free community where people with no coding background build real software with AI.

Made with 💜 by **Aisha** for [Prompts2Products](https://prompts2products.com)
