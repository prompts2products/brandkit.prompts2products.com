# Changelog

All notable changes to BrandKit are documented here.

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
