# Contributing to BrandKit

First off, **thank you!** 💜 BrandKit is a community tool, and contributions of every size are welcome: new styles, better trade words for the name generator, bug fixes, accessibility improvements, performance tweaks, docs, translations, or just good ideas.

## Code of Conduct

Be kind, be constructive, assume good intent. We want BrandKit to be a friendly place for first-time and experienced contributors alike. Harassment or discrimination of any kind won't be tolerated.

## Project Philosophy

BrandKit intentionally stays **simple**:

- ✅ **Single file**: everything lives in `index.html` (HTML + CSS + JS).
- ✅ **Zero dependencies, zero build step**: no npm, no bundler, no framework.
- ✅ **Client-side by default**: a visitor's answers must never leave their browser, except through the one opt-in, clearly labelled AI names button.
- ✅ **Accessible & responsive**: keyboard support, ARIA, reduced-motion, mobile-first.

Please keep PRs aligned with these principles. If a change would add a build tool or a runtime dependency, open an issue first to discuss.

## Getting Started

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/brandkit.git
cd brandkit

# 2. Serve it locally (any static server works)
python3 -m http.server 4188
# visit http://localhost:4188

# 3. Create a branch
git checkout -b feature/my-improvement
```

Edit `index.html`, refresh the browser, and you're iterating. There's nothing to compile.

## How to Contribute

### 🎨 Add a new style

Find the `VIBES` object in `index.html` and add an entry. Hue range, chroma multiplier, fonts and word banks all live in one place:

```js
coastal:{label:"Calm and coastal",desc:"Salt air and pale light.",hue:[185,215],chroma:0.68,
  swatch:["#3E7C8C","#8FBFC8","#E7E2D3"],
  fonts:{display:"Fraunces",body:"Nunito Sans",mono:"IBM Plex Mono",dw:600},
  words:["Tide","Cove","Drift","Harbour","Salt","Dune"],tails:["& Co","Supply","Studio"]}
```

### 📖 Add trade words to the name generator

The `LEX` object maps an industry group to nouns (`n`) and modifiers (`m`). Better words here beat any amount of clever code:

```js
florist:{n:["Stem","Posy","Bloom","Thicket"],m:["Wild","Little","Morning"]}
```

> Note: keep the default set focused and meaningful. New scenarios should test a *distinct* real-world context (a surface, a brand color family, a gradient style, a texture).

### 🐛 Fix a bug

1. Open an issue describing the bug (steps to reproduce + browser).
2. Reference the issue in your PR.

### ♿ Improve accessibility or responsiveness

Test across viewport widths (we check 375 / 480 / 720 / desktop) and with a keyboard. Verify no horizontal overflow on mobile.

### 📖 Improve docs or add screenshots

Add images to a `docs/` folder and reference them in the README.

## Pull Request Checklist

Before opening a PR, please confirm:

- [ ] The change works in the latest Chrome, Firefox, and Safari.
- [ ] No console errors (check DevTools).
- [ ] No horizontal scroll on mobile (≤ 375px).
- [ ] Nothing new leaves the browser without the visitor explicitly asking.
- [ ] No new dependencies or build steps were added.
- [ ] Existing features still work (the five questions, free-text answers, the icon and shape pickers, downloads, the printable guide).
- [ ] Your PR description explains **what** changed and **why**.

## Commit & PR Style

- Use clear, present-tense commit messages: `Add teal-to-lime gradient scenario`.
- Keep PRs focused: one logical change per PR is easier to review.
- Screenshots or a short clip are hugely appreciated for visual changes.

## Reporting Bugs & Requesting Features

Open a [GitHub Issue](../../issues) with:

- **Bugs:** what you expected, what happened, your browser/OS, and steps to reproduce.
- **Features:** the problem you're trying to solve (not just the solution), and who it helps.

## Licensing

By contributing, you agree that your contributions are licensed under the project's [MIT License](LICENSE).

---

Thanks again for helping make BrandKit better. ⭐ If you enjoy the project, star it and tell a friend!

A tool by [Prompts2Products](https://prompts2products.com)
