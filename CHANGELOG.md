# Changelog

All notable changes to BrandKit are documented here.

## [1.5.1] - 2026-09-17

### Added
- Cloudflare Web Analytics on brandkit.prompts2products.com. The existing account site only covered the apex `prompts2products.com`, so the subdomain was counting nothing. A separate site was registered and its beacon installed. The token is a public site identifier that ships in the page source by design, so it lives in the source rather than the build-time injection used for GA and Clarity, which keeps analytics from silently switching off on a deploy from another machine

## [1.5.0] - 2026-09-17

### Security
- Audited for exposed credentials: none exist. Workers AI is reached through the `env.AI` binding, which Cloudflare resolves inside the runtime, so there is no key in the page, the repo or the worker source. The live page, the full git history and the working tree were all scanned for key-shaped strings and came back clean
- `/api/names` was open to the world, so anyone could spend the account's AI allowance. It now accepts requests only from this site's own origin and is rate limited to 8 per minute per IP
- Error responses no longer return raw exception text. The earlier deprecated-model failure had been disclosing internal model identifiers and Cloudflare error codes to the public; those are logged instead

### Fixed
- The newsletter card, icon sheet and toast printed into the PDF. They sit outside the app shell so they never picked up `.noprint`

## [1.4.1] - 2026-09-17

### Fixed
- Live at brandkit.prompts2products.com. Three things only surfaced once it was deployed:
  - `/api/names` returned `AiError 5028`: the model alias resolved to one Cloudflare deprecated on 2026-05-30. Now pinned to `@cf/meta/llama-3.1-8b-instruct-fp8`, chosen by running the real prompt against the account's current catalogue
  - `not_found_handling` was set to `single-page-application`, so every unknown URL answered 200 with the homepage. BrandKit has no client-side routing, so that was a soft 404 inviting search engines to index junk URLs as duplicates. Unmatched paths now return a real 404
  - The build copied all of `docs/` into the deploy, publishing the OG image source page and internal repo notes. Only `og-image.png` ships now

## [1.4.0] - 2026-09-17

### Added
- A visible **Questions people ask** section carrying the same seven answers as the structured data. AI answer engines quote text on the page, not just JSON-LD, and a page whose answers exist only in a script tag gives them nothing to quote
- Static content inside the Styles and What you get sections, replaced by the rich grids once JavaScript runs. Most AI crawlers do not execute JavaScript, and those two sections previously rendered as empty divs to anything that did not

### Changed
- Static text a non-JavaScript crawler can read went from 1,710 to about 4,400 characters

## [1.3.0] - 2026-09-17

### Changed
- The navbar call to action follows the view. Once a kit exists it reads **Download PDF** and prints, because offering "Build my brand" to someone who has already built one is the wrong next step. The landing page nav links are hidden outside the landing page, since the sections they point at are hidden by then
- The newsletter card no longer goes quiet forever after one sighting. It now waits by outcome: 7 days if it was only seen, 60 days if it was closed, 180 days if the visitor clicked into the Substack box. That last one is inferred from focus moving to the embed, since a cross-origin iframe cannot report a signup back

## [1.2.1] - 2026-09-17

### Removed
- The Regenerate, Download CSS and Download logo SVG buttons. Download PDF is now the only action on the results header. CSS is still available from the Copy CSS button in the Handoff section and the kit still exports as JSON, so the only capability actually lost is the SVG logo export
- Claims about an SVG download were removed from the structured data, the README and `llms.txt` so they still describe what the tool does

## [1.2.0] - 2026-09-17

### Added
- The brand guide now specifies **clear space** and **minimum size**, the two things anyone placing a logo actually asks for. Clear space is drawn as an exclusion box marked x on all four sides, where x is half the height of the mark. Minimum sizes are shown at actual size for the mark and the lockup

### Changed
- The brand guide is written in the third person and names the brand, because it is a document handed to other people rather than the tool talking to its user. "Your logo, three ways" is now "The <name> logo", "Your colour carries every interaction" is "The primary colour", and "Remember these five things" is "The five rules". The tool itself still speaks plainly to the person using it

## [1.1.1] - 2026-09-17

### Fixed
- Logo marks were optically inconsistent. A shape's bounding box is a poor guide to how big it looks, so every shape is now drawn to carry the same visual weight and every glyph is sized to the same optical width rather than to a per-shape guess. The diamond and hexagon were reading small and starved, while the ring and square outline had a glyph lost in the middle of them
- The wordmark started at a fixed x for every shape, so a diamond, which comes to a point at exactly the height of the text, almost touched the first letter. Each shape now sets where the wordmark begins

## [1.1.0] - 2026-09-17

### Added
- Logo colour picker: paint the mark in any of ten colours from your own kit, with the glyph on top re-checked for contrast against whichever you pick
- Icon search now understands trade words (fitness, dentist, wedding, plumber and 40 more) and matches part-typed words

### Fixed
- **The printable guide was silently losing every style after a font name.** Font stacks were wrapped in double quotes inside double-quoted `style` attributes, which closed the attribute early. Colours, flex and sizes after the font were dropped, so dark kits printed dark text on dark cards and the footer ran together as "v1.0BrandKit"
- The guide now prints in the kit's own background rather than BrandKit cream, so a dark brand gets a dark document instead of pale ink on cream
- The landing page's pill `.chip` style was leaking into the guide and rendering every colour swatch as an oval
- The icon picker's "nothing matches" message was a grid item in a 58px column, so it read one word per line

### Changed
- AI name ideas now come from this site's own `/api/names` endpoint on Cloudflare Workers AI. The previous keyless public service began returning `403 Missing Turnstile token` for any request from a browser, so the button was broken in production
- The newsletter card uses the real Substack embed instead of a form that handed off to a subscribe page

## [1.0.0] - 2026-09-17

First public release.

### Added
- Five-question quiz producing a full brand kit, plus one optional question about your trade
- OKLCH colour generation with WCAG contrast enforced before render
- Font pairing per style, loaded from Google Fonts
- Logo builder: 35 hand-drawn marks plus a searchable library of 1,553 Lucide icons, in 10 outer shapes
- Name generator built from a 19-group trade lexicon and real naming patterns
- Optional AI name ideas via the site's own `/api/names` endpoint on Cloudflare Workers AI, opt-in and clearly labelled
- Downloads: logo SVG, CSS custom properties, JSON, printable brand guide
- Free-text "none of these" reader using keyword scoring with negation handling, no AI call
- Session memory in localStorage so a reload keeps your place
- Newsletter invite shown only after real engagement, never as a full-screen interstitial
- SEO and AEO: structured data (SoftwareApplication, FAQPage, HowTo, Organization), `llms.txt`, `robots.txt` welcoming AI crawlers, sitemap
- GA4 and Microsoft Clarity, injected at build time so no tracking ID is committed
