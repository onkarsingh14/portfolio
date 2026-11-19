# DESIGN.md

> A live incident console after the outage is resolved: dark, calm, precise, and glowing only where it matters.

## 1. Visual Theme & Atmosphere

**Style**: Dark Command Center (Dark Tech seed, tuned for IT operations)
**Keywords**: NOC console, signal, severity, calm-under-pressure, telemetry, precision, glass, aurora
**Tone**: confident, technical, composed — NOT neon cyberpunk, NOT glitchy, NOT gamer
**Feel**: The big screen in a network operations centre at 3 a.m., every graph green, one engineer in control.

**Interaction Tier**: L2 Smooth Interaction
**Dependencies**: CSS + vanilla JS (IntersectionObserver, rAF). No GSAP, no Lenis, no WebGL.

**Subject details used as content** (not decoration): P1–P5 severity tags, MTTR timer, incident ticket IDs (INC…), bridge-call log lines, SLA %.

## 2. Color Palette & Roles

Single, deliberate dark theme (the page sets `color-scheme: dark` and never follows a light OS setting).

```css
:root {
  /* Backgrounds */
  --bg: #070b14;                 /* page */
  --surface: rgba(255,255,255,.035);   /* cards / panels */
  --surface-alt: #0b1120;        /* alternate bands (marquee, contact) */
  --surface-hover: rgba(255,255,255,.06);

  /* Borders */
  --border: rgba(255,255,255,.08);
  --border-hover: rgba(34,211,238,.45);

  /* Text */
  --text: #e8eef7;
  --text-secondary: #a3b0c2;
  --text-tertiary: #67768c;

  /* Accent */
  --accent: #22d3ee;             /* signal cyan: links, focus, active */
  --accent-hover: #67e8f9;
  --accent-2: #8b7cf6;           /* violet, gradient partner only */

  /* RGB helpers */
  --bg-rgb: 7,11,20;
  --accent-rgb: 34,211,238;
  --accent-2-rgb: 139,124,246;

  /* Semantic */
  --success: #34d399;  --success-rgb: 52,211,153;
  --warning: #f5a524;  --warning-rgb: 245,165,36;
  --error:   #fb5a76;  --error-rgb: 251,90,118;

  /* Severity scale (P1 hottest) */
  --p1: var(--error); --p2: var(--warning); --p3: #e8c547; --p4: var(--accent); --p5: #7d8ba3;
}
```

**Color Rules:**
- Every color comes from a variable; components never contain a hex literal.
- Cyan is the only interactive accent. Violet appears only inside the hero gradient and the aurora.
- Severity colors (`--p1`…`--p5`) mean severity only. Never use them for decoration.
- Green (`--success`) is reserved for "operational / resolved" states.

## 3. Typography Rules

**Font Stack:**
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
--font-display: "Space Grotesk", "Segoe UI", system-ui, sans-serif;
--font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, Consolas, monospace;
```

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | Space Grotesk | clamp(3.5rem, 10vw, 7.5rem) | 700 | 0.92 | -0.04em |
| Section H2 | Space Grotesk | clamp(2rem, 4.5vw, 3.25rem) | 700 | 1.05 | -0.025em |
| H3 | Space Grotesk | 1.25rem | 600 | 1.25 | -0.01em |
| Body | Inter | 1rem (lede 1.125rem) | 400 | 1.65 | — |
| Label / eyebrow | JetBrains Mono | 0.75rem | 500 | 1 | 0.16em, uppercase |
| Mono / data | JetBrains Mono | 0.85rem | 400 | 1.5 | — (tabular-nums) |

**Typography Rules:**
- Headings weight ≥ 600; body never above 500.
- Numbers in stats, dates and timers use `font-variant-numeric: tabular-nums`.
- Running text max width 64ch.
- **NEVER use**: Orbitron, Audiowide, any pixel/glitch font, Roboto, Arial as a chosen face.

**Text Decoration** (from text-decoration-rules.md, Dark Tech column):
- Hero H1: gradient (`--text` → `--accent` → `--accent-2`) + subtle glow `text-shadow` is NOT stacked on the gradient; glow is applied via a blurred pseudo layer behind it instead.
- Section H2: one key word in gradient, rest solid `--text`.
- Body `p`: no decoration.
- Eyebrow labels: cyan, letter-spaced, with a 16px leading rule.

## 4. Component Stylings

### Buttons
```css
.btn {
  display: inline-flex; align-items: center; gap: .6rem; min-height: 44px; padding: 0 1.15rem;
  border-radius: 10px; border: 1px solid var(--border); background: var(--surface);
  color: var(--text); font: 500 .9rem/1 var(--font-body); cursor: pointer;
  transition: background .2s, border-color .2s, transform .2s, box-shadow .2s;
}
.btn:hover { background: var(--surface-hover); border-color: var(--border-hover); }
.btn:active { transform: scale(.97); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.btn:disabled, .btn[aria-disabled="true"] { opacity: .45; cursor: not-allowed; transform: none; }
.btn-primary { background: var(--accent); color: var(--bg); border-color: transparent; font-weight: 600; }
.btn-primary:hover { background: var(--accent-hover); box-shadow: 0 0 0 6px rgba(var(--accent-rgb), .15), 0 10px 30px -10px rgba(var(--accent-rgb), .6); }
```

### Cards (SpotlightCard)
```css
.card {
  position: relative; overflow: hidden; border-radius: 16px;
  background: var(--surface); border: 1px solid var(--border);
  transition: border-color .25s, transform .25s, background .25s;
}
.card::before {               /* cursor-tracked light */
  content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .3s;
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(var(--accent-rgb), .12), transparent 60%);
}
.card:hover { border-color: var(--border-hover); background: var(--surface-hover); transform: translateY(-2px); }
.card:hover::before { opacity: 1; }
.card:focus-within { border-color: var(--border-hover); }
```

### Navigation
```css
.nav { position: fixed; top: 0; inset-inline: 0; z-index: 20; transition: background .3s, border-color .3s; border-bottom: 1px solid transparent; }
.nav.scrolled { background: rgba(var(--bg-rgb), .72); backdrop-filter: blur(12px); border-bottom-color: var(--border); }
.nav a { color: var(--text-tertiary); min-height: 44px; display: inline-flex; align-items: center; padding: 0 .75rem; border-radius: 8px; }
.nav a:hover { color: var(--text); }
.nav a.on { color: var(--accent); }
.nav a:focus-visible { outline: 2px solid var(--accent); }
```

### Links
```css
.link { color: var(--accent); text-decoration: none; background: linear-gradient(currentColor,currentColor) 0 100% / 0 1px no-repeat; transition: background-size .3s; }
.link:hover { background-size: 100% 1px; }
.link:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
```

### Tags / Badges (severity + status)
```css
.sev { --c: var(--p5); display: inline-flex; align-items: center; gap: .45rem; padding: .35rem .6rem; border-radius: 6px;
  font: 500 .72rem/1 var(--font-mono); color: var(--c);
  background: color-mix(in srgb, var(--c) 12%, transparent); border: 1px solid color-mix(in srgb, var(--c) 35%, transparent); }
.sev::before { content: ""; width: 6px; height: 6px; border-radius: 2px; background: var(--c); }
.status-pill { display: inline-flex; gap: .5rem; align-items: center; padding: .4rem .8rem; border-radius: 999px;
  border: 1px solid rgba(var(--success-rgb), .3); background: rgba(var(--success-rgb), .08); color: var(--success); font: 500 .75rem/1 var(--font-mono); }
```

### Console panel (hero signature)
```css
.console { border-radius: 16px; border: 1px solid var(--border); background: rgba(var(--bg-rgb), .6); backdrop-filter: blur(10px); font: 400 .8rem/1.7 var(--font-mono); }
.console-bar { display: flex; gap: 6px; padding: .8rem 1rem; border-bottom: 1px solid var(--border); }
.console-line .t { color: var(--text-tertiary); } .console-line .ok { color: var(--success); } .console-line .warn { color: var(--warning); }
```

## 5. Layout Principles

**Container:** max-width 1160px; side padding `max(16px, env(safe-area-inset-*))` → 24px ≥ 768px. Narrow text column 64ch.

**Spacing Scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 72 / 112px.
- Section padding: 112px desktop, 72px mobile (`padding-block`).
- Component gap: 16–24px.
- Card internal padding: 28px desktop, 20px mobile.

**Grid:**
```css
.hero-grid { display: grid; grid-template-columns: 1.15fr .85fr; gap: 48px; align-items: center; }
.split { display: grid; grid-template-columns: 240px 1fr; gap: 32px; }        /* label rail + content */
.bento { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
.bento .b-wide { grid-column: span 4; } .bento .b-mid { grid-column: span 3; } .bento .b-small { grid-column: span 2; }
```

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | no shadow, `--border` hairline | lists, rows, stats |
| Surface | `--surface` fill + hairline | cards, chips |
| Glass | `rgba(bg,.6)` + `backdrop-filter: blur(10–12px)` | console panel, scrolled nav (never large scrolling areas) |
| Glow | `0 0 0 6px rgba(accent,.15), 0 10px 30px -10px rgba(accent,.6)` | primary button hover, current role only |

## 7. Animation & Interaction

**Motion Philosophy**: Calm, telemetry-like motion. Only `opacity` and `transform`; things resolve, they don't bounce.
**Tier**: L2

### Dependencies
None. Vanilla JS.

### Entrance Animation
```css
@keyframes rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
.enter { animation: rise .8s cubic-bezier(.2,.7,.2,1) both; animation-delay: calc(var(--i, 0) * 90ms); }
```

### Scroll Behavior
```js
// Reveal: elements start visible; JS adds .pre only when it can animate them, then .in on intersection.
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => { el.classList.add('pre'); io.observe(el); });
// Nav state
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 24), { passive: true });
// Parallax: aurora blobs translateY(scrollY * .15) inside one rAF.
```
```css
.pre { opacity: 0; transform: translateY(24px); transition: opacity .7s, transform .7s cubic-bezier(.2,.7,.2,1); transition-delay: calc(var(--i,0) * 80ms); }
.pre.in { opacity: 1; transform: none; }
```

### Hover & Focus States
Every `a`, `button`, card: hover changes border to `--border-hover` or color to `--text`; `:focus-visible` gets a 2px `--accent` outline at 3px offset.

### Special Effects (the six L2 signature categories)
| Category | Effect | Where |
|---|---|---|
| Text — Hero H1 | **DecryptedText**: name resolves from random glyphs, then holds the gradient | Hero name |
| Text — Section H2 | **SplitText**: words rise in with 60ms stagger on scroll | All H2 |
| Text — Body/Label | **ScrambleText** eyebrows + **TextType** console log lines | Eyebrows, hero console |
| Animation — element | **Magnet** primary CTA + **ClickSpark** on copy buttons | Hero CTAs, contact |
| Component | **SpotlightCard** + Bento skills grid; severity ladder cards | Experience, skills |
| Background | **Aurora** (3 blurred static blobs, transform-only drift) + dot grid mask | Global, behind hero |

**Landing "wow" points:**
1. Hero: decrypting name + live console panel (ticking MTTR clock, typed bridge-call log, SLA meter).
2. First scroll: full-bleed marquee band of client industries + count-up stats.
3. List: Bento skill grid with spotlight cards; experience as a P5→P1 escalation ladder.
**Easter egg**: copying the email fires a spark and a toast "INC-COPY resolved · MTTR 0.2s"; the footer reports how long the visitor has been on the page as "Session uptime".

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .pre { opacity: 1 !important; transform: none !important; }
  .marquee-track { transform: none !important; }
}
```
JS also skips decrypt, typing, count-up, magnet and parallax when reduced motion is set; final text renders immediately.

## 8. Do's and Don'ts

### Do
- Use real resume facts only: dates, roles, tools, industries, certifications.
- Keep the page fully readable with JS disabled (content in HTML; JS only animates).
- Use severity colors to tell the career story (P5 → P1).
- Pause the aurora and marquee when off-screen.
- Keep tap targets ≥ 44×44px.
- Keep one accent per component.

### Don't
- ❌ No hex literals in component CSS.
- ❌ No `filter: blur()` on moving elements (aurora blobs are pre-blurred, they only translate).
- ❌ No `backdrop-filter` above 14px or over large scrolling areas.
- ❌ No glitch/RGB-split text, scanlines or Matrix rain: this is calm ops, not hacking.
- ❌ No emoji as icons; inline SVG only.
- ❌ No `mailto:`/`tel:` as the only way to get contact info; always show selectable text + Copy.
- ❌ No content hidden at `opacity:0` until scroll without JS adding the hidden state first.
- ❌ No fabricated metrics (no invented "99.99% uptime" claims about the person); console figures are labelled as a demo.
- ❌ No custom cursor replacement.
- ❌ No light theme fallback mixing: the page is dark by design.

## 9. Responsive Behavior

| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | > 1024px | Hero 2 columns (text + console), bento 6 cols, split label rail |
| Tablet | 640–1024px | Hero stacks, console below; bento 2 cols; stats 2×2 |
| Mobile | < 640px | Single column; nav links become a horizontally scrollable chip row; H1 3.5rem; section padding 72px |

**Touch Targets:** minimum 44×44px.
**Collapsing Strategy:** nav collapses to a scroll-snapping chip row under the logo; label rails stack above content; bento cards go full width.

```css
@media (max-width: 1024px) { .hero-grid { grid-template-columns: 1fr; } .bento { grid-template-columns: repeat(2, 1fr); } .bento > * { grid-column: span 1 !important; } .bento .b-wide { grid-column: span 2 !important; } }
@media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: 12px; } }
@media (max-width: 640px) { .bento { grid-template-columns: 1fr; } .bento > * { grid-column: auto !important; } }
```
