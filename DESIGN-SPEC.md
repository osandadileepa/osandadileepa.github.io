# Design Spec — "Architect's Ledger"

> Redesign direction for osandadileepa.github.io
> Version 1.0 · Nov 2026 · Authoring role: UI/UX Lead

---

## 1. Product definition

- **Site goal:** Convert engineering recruiters, hiring managers, and CTO-level readers into a contact / CV download / intro call.
- **Positioning sentence (drives all copy):** *I architect and lead the systems other engineers build on.*
- **Primary audience:** Engineering managers and architects hiring senior Java/Cloud/Platform engineers. They skim, distrust marketing language, and respect precision.
- **Design motto:** Quiet confidence. The metrics flex, not the CSS.

## 2. Design principles (ranked)

1. **Scannable in 10 seconds.** A recruiter on a phone sees name, role, 3 metrics, CV button before scroll.
2. **Evidence over adjectives.** Every claim carries a number, artifact, or link. Remove all 7-card "services" marketing tone.
3. **One accent, one palette, one type family (+mono).** Restraint is the aesthetic.
4. **Performance is part of the design.** Zero canvas, zero loader, system-first fonts, target LCP < 1.5s.
5. **Accessible by default.** WCAG AA everywhere, keyboard-complete, honors `prefers-reduced-motion`.

## 3. Information architecture

Old: Home / About / Resume / Services / Skills / Projects / Contact (7 sections, ~7 nav items)
New — **5 blocks, 4 nav items:**

| # | Section | Purpose | Replaces |
|---|---------|---------|----------|
| 1 | **Hero** (`#top`) | Identity + positioning + 3 key metrics + primary CTA | Hero (simplified) |
| 2 | **Track Record** (`#work`) | Timeline = career story with outcome metrics | Resume timeline + Services + About |
| 3 | **Systems** (`#systems`) | What I work with — compact stack, not a skills card grid | Skills (demoted) |
| 4 | **Contact** (`#contact`) | Email-first contact + CV download | Contact |
| 5 | Footer | Links (GitHub, LinkedIn), colophon line | Footer |

**Deletions:** Services section (content absorbed into hero subtitle + Track Record cards), Skills' 3-category card grid (replaced by one compact stack block), About paragraphs (key facts move into hero and timeline), loader, Three.js canvas, floating gradient orbs, back-to-top.

## 4. Design tokens

### 4.1 Color — light-first with dark variant (CSS custom properties, `data-theme`)

Light is the default new identity; dark ships as a persisted toggle.

```
--bg:            #ffffff     (dark: #0b0d10)
--bg-subtle:     #f6f8fa     (dark: #12151a)   -- section bands, code blocks
--surface:       #ffffff     (dark: #161a21)   -- cards, raise +1
--border:        #e4e8ee     (dark: #232a34)   -- hairlines
--border-strong: #c9d1dc     (dark: #2f3845)

--text:          #0e1116     (dark: #e8ecf1)   -- primary, 15.8:1
--text-muted:    #57606a     (dark: #99a3b0)   -- secondary, 4.9:1 AA

--accent:        #0b6fdd     (dark: #4cc2ff)   -- links, CTAs, metric highlights
--accent-text:   #0a5cb8     (dark: #7fd4ff)   -- accent used AS text (AA at small sizes)
--accent-subtle: #eaf3fd     (dark: #0e2033)   -- chip/badge background
--success:       #1a7f37     -- verified-metric checkmarks
```

**Rules:** maximum one non-neutral element per viewport band. No gradients except the single hero text underline. No glows, no glassmorphism, no orbs.

### 4.2 Typography

- **Sans:** Inter (body, headings) — self-host `woff2`, `font-display: swap`
- **Mono:** JetBrains Mono (metrics, labels, dates, tech tags)

```
Scale (1.25 major third, fluid clamp):
display:  clamp(2.6rem → 3.9rem)    hero name            /700 -0.03em
h1:       clamp(2rem → 2.75rem)     section titles       /700 -0.02em
h2:       1.5rem /600               card & job titles
body:     1.0625rem /1.7            paragraphs
small:    0.875rem                  nav, meta, captions
mono-label: 0.75rem /600 /+0.08em  uppercase kickers & tags
```

### 4.3 Spacing & layout

```
Container:   720px (prose) / 1080px (wide)   -- pinned to left inside centered container,
                                                left-aligned text everywhere; centered text only in hero on mobile
Space scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 (px)
Section padding: 96px desktop / 64px mobile
Radius:      8px cards, 999px chips, 0 dividers
Elevation:   borders over shadows; shadow only on sticky nav (`0 1px 3px rgba(0,0,0,.08)`)
```

## 5. Section-by-section wireframe

### 5.1 Nav (68px, sticky, `backdrop-filter: blur(8px)` on scroll)
```
[ <Osanda/> logo (text, mono)                      Work · Systems · Contact · [CV ⬇] ]
```
- CV button = nav CTA (the one persistent conversion path)
- Mobile: logo + CV button + plain disclosure menu; active-section underline via IntersectionObserver
- H1 skip-link; nav collapses to border-bottom after 8px scroll

### 5.2 Hero (`#top`, min-height 88vh on desktop, auto on mobile)
```
mono-label: SENIOR SOFTWARE ENGINEER — TEAM LEAD · 10+ YEARS          (gray, mono, small)
Display:    Osanda Wedamulla                                          (nav + accent underline on surname)
One-liner:  I architect and lead the systems other engineers build on —
            distributed Java backends, Kubernetes platforms, teams that ship.
[Download CV ⬇ (primary)]  [osandawedamulla@… email (copy-on-click)]
────────────────────────────────────────────
10+          10K+               99.9%
YEARS        TRANSACTIONS/MIN   UPTIME ARCHITECTED
└── mono numerals, huge (2.5rem JetBrains), hairline vertical dividers between
```
- The metric strip IS the hero visual — replaces entire particle canvas
- Below (desktop): subtle right-side career map — vertical hairline: `2015 ● Senior Eng. ─ 2021 ● Team Lead ─ now ● Architect` (static, fades in)
- Mobile: metrics become 3-across row, no scroll indicator

### 5.3 Track Record (`#work`) — the centerpiece
```
mono-label: TRACK RECORD
h1:         Systems shipped, teams led.

[Timeline, single-column, 720px, left rail ●—●—●]
Each role card (~720px, bordered, 8px radius):
┌──────────────────────────────────────────────────────┐
│ 2021 — NOW                     V Fullstack GmbH      │  ← dates mono, company muted
│ Senior Full Stack Developer — Team Lead              │
│                                                       │
│ Outcome bullets (max 4, each starts with a metric):   │
│ · 10K+ txn/min microservices at 99.9% uptime         │
│ · −30% deploy time via GitOps (ArgoCD)               │
│ · −90% inference latency (FastAPI ML services)       │
│                                                       │
│ [Spring Boot] [Kubernetes] [AWS/GCP] …                │  ← mono chips, accent-subtle bg
└──────────────────────────────────────────────────────┘
```
- Bullet rules: verb-free, metric-first ("−30%", "10K+", "99.9%"), 4 max per role
- Cards parity with CV/LinkedIn wording — recruiter cross-checks these in seconds

### 5.4 Systems (`#systems`) — one compact block, replaces the 3-card skills grid
```
mono-label: SYSTEMS
h1:         What I work with.

One bordered block, left rail = 4 mono category labels, right = wrapped chips:
LANGUAGES      Java · Python · TypeScript · SQL
PLATFORMSPI    Spring Boot · Kafka · PostgreSQL · Redis
CLOUD/OPS      Kubernetes · Terraform · ArgoCD · Prometheus/Grafana
AI/SYSTEMS     FastAPI · LLM integration pipelines · monitoring stacks
```
- No progress bars, no percentages, no star ratings — seniority claims via ratings are a UX anti-pattern
- Entire block ≤ 50vh desktop

### 5.5 Contact (`#contact`) + Footer
```
mono-label:  CONTACT
h1:          The fastest way to reach me is email.
big-accent:  osandawedamulla@[…]          (click = copy, tooltip "Copied ✓")
[Email me] [Download CV ⬇]
Response line: "I reply within 24 hours — CV responds well to concrete problems."
Footer:  © Osanda Wedamulla · GitHub · LinkedIn · colophon: "Built by hand. No frameworks."
```

## 6. Motion & interaction rules

| Interaction | Behavior | Duration/curve |
|---|---|---|
| Section reveal | translateY(12px) + opacity, one-shot IO | 400ms `cubic-bezier(.2,.7,.2,1)` |
| Link hover | underline slide-in, 1px | 150ms |
| Card hover | border darkens only (no lift/scale) | 150ms |
| Copy email | tooltip swap 900ms | 150ms |
| Metric numbers | count-up once on first reveal, respects reduced-motion | 700ms linear |

- Global: `@media (prefers-reduced-motion: reduce)` → reveal/count-up disabled, content always visible
- Every interactive element: visible `:focus-visible` ring (2px accent, 2px offset)

## 7. Accessibility requirements

- AA contrast on all text pairs (checked against §4.1 values)
- Landmarks: `header/nav/main/section[aria-labelledby]/footer`
- Skip link, one `<h1>` (hero), section titles as `h2`
- CV link: real `<a download>`, file name without spaces (`CV_Osanda_Wedamulla_2026.pdf` — update href accordingly)
- Icon-only actions need `aria-label`; decorative icons `aria-hidden`

## 8. Performance budget (hard)

| Metric | Budget |
|---|---|
| LCP (mobile 4G) | < 1.5s |
| JS shipped | < 15KB gz (IntersectionObserver + copy + count-up ≈ vanilla, zero libs) |
| CSS | < 15KB gz, custom only |
| Fonts | 2 families × 2-3 weights, subset, self-hosted swap |
| Images | hero none; project screenshots AVIF/WebP with dimensions |
| Third-party | GA only (consider lightweight analyst alternative) |

**Ticker:** delete Three.js, GSAP, AOS, jQuery, Lucide CDN runtime (inline the ~12 used icons as SVG).

## 9. Content directives (copy decisions made for you)

1. **Delete** the Services section — it repositions you as a freelancer vendor, not a team lead
2. **Delete** About paragraphs — merge unique facts into hero one-liner + timeline intro
3. **Rewrite** project cards: 3 strongest projects, each = problem → your architecture decision → measured outcome → what it proves. 6 generic titles will be cut to 3 deep ones
4. **Rename** hero role: "Software Engineer & Architect" → "Senior Software Engineer — Team Lead" (recruiter search terms)
5. **Stats honesty check:** use 3 only (Years / Txn·min / Uptime); "Mounted Clients" removed (implies freelance)

## 10. Implementation order (suggested PR sequence)

1. **P0** — Delete legacy: Three.js/GSAP/AOS/jQuery/Lucide refs, loader, orbs, `single.html`, unused `scss/` + template `css/`
2. **P1** — New tokens (`css/main.css` rebuild), nav, hero + metric strip, contact, footer
3. **P2** — Track Record timeline, Systems block, mobile pass
4. **P3** — Accessibility + perf budget validation (Lighthouse ≥ 95), CV PDF filename fix
