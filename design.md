---
name: Deep Space Glass
colors:
  bg: '#06030f'
  accent: '#7c3aed'
  accent-light: '#a78bfa'
  accent-glow: 'rgba(124, 58, 237, 0.35)'
  glass: 'rgba(255, 255, 255, 0.04)'
  glass-border: 'rgba(255, 255, 255, 0.08)'
  glass-border-hover: 'rgba(124, 58, 237, 0.4)'
  text: '#f8fafc'
  text-2: '#94a3b8'
  text-3: '#475569'
  error: '#f87171'
  error-bg: 'rgba(239, 68, 68, 0.08)'
  error-border: 'rgba(239, 68, 68, 0.25)'
  diff-easy: '#34d399'
  diff-medium: '#fbbf24'
  diff-hard: '#f87171'
  missing: '#fbbf24'
  gradient-text: 'linear-gradient(135deg, #c4b5fd 0%, #818cf8 50%, #60a5fa 100%)'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 52px
    fontWeight: '800'
    lineHeight: '1.05'
    letterSpacing: '-0.03em'
    style: gradient-text
  label:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: '0.12em'
    textTransform: uppercase
    color: accent-light
  label-muted:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: '0.15em'
    textTransform: uppercase
    color: text-3
  body:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.6'
    color: text-2
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    color: text-2
  numeric:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '800'
    textAlign: center
    color: text
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 24px
  xl: 48px
  page-top: 72px
  page-bottom: 96px
  page-horizontal: 20px
  content-max-width: 680px
  panel-padding: 24px
  card-padding: '20px 24px'
  gap-panels: 12px
  gap-cards: 12px
  gap-rows: 8px
border-radius:
  panel: 20px
  card: 20px
  button-primary: 14px
  button-ghost: 8px
  input: 10px
  badge: 999px
  chip: 8px
  step-number: 50%
  time-input: 14px
---

## Brand & Style

"Deep Space Glass" — dark, minimal, focused. Single-column interface where the user provides ingredients and time; an AI agent returns recipe suggestions. No navigation, no sidebar, no dashboard metaphor.

The personality is calm and precise. The interface defers to content; structural chrome is invisible until needed. Purple is the only color with meaning — it signals interactivity and brand identity. Everything else is neutral or semantic (green = easy, yellow = medium/warning, red = hard/error).

## Colors

Background is near-black with a purple tint (`#06030f`). Two radial gradients are composited as a fixed pseudo-element: a large purple ellipse from the top center (18% opacity) and a smaller blue ellipse at the bottom-right (8% opacity). These are decorative only — they give depth without distraction.

**Accent** (`#7c3aed`) is the single interactive color. Used for focus rings, active states, button backgrounds, step number circles, and the pulsing brand badge dot. Light variant (`#a78bfa`) is used for section labels and ghost button text.

**Text hierarchy** uses three shades:
- `#f8fafc` — primary (headings, values, interactive labels)
- `#94a3b8` — secondary (body copy, descriptions, time display)
- `#475569` — muted (column headers, footer attribution, empty states)

**Semantic colors** appear only in specific contexts:
- `#34d399` (green) — "Fácil" difficulty badge
- `#fbbf24` (amber) — "Médio" difficulty badge + missing ingredients
- `#f87171` (red) — "Difícil" difficulty badge + error states

## Typography

Dual-font system. **Space Grotesk** for all structural text: headings, section labels, badge text, column headers, numeric inputs, button labels. **Inter** for content: ingredient placeholders, recipe descriptions, step text, body copy.

The H1 ("Chef Alexandre") uses gradient text — a diagonal sweep from violet (`#c4b5fd`) through indigo (`#818cf8`) to blue (`#60a5fa`). Applied via `-webkit-background-clip: text`.

Section labels follow a strict pattern: 10–11px / Space Grotesk / 700 weight / 0.12–0.15em tracking / uppercase. Accent-light (`#a78bfa`) for panel section titles ("Ingredientes", "Tempo disponível", "Modo de preparo"). Muted (`#475569`) for structural labels (column headers, footer).

## Layout & Spacing

Single-column, centered, max-width 680px. Page padding: 72px top, 96px bottom, 20px horizontal. No grid, no sidebar.

Form panels stack vertically with 12px gap. Each panel is a glass card (borderRadius 20, padding 24px). Submit button sits directly below with 4px extra margin-top. Results appear below the form with 48px separation.

Spacing rhythm is 8px base: xs=4, sm=8, md=12 (panel gap), lg=24 (panel padding), xl=48 (results offset).

## Glass Morphism

All panels and cards use the `.glass` pattern:
- Background: `rgba(255,255,255,0.04)`
- Border: `1px solid rgba(255,255,255,0.08)`
- `backdrop-filter: blur(12px)`

On focus-within, panels upgrade their border to accent-hover (`rgba(124,58,237,0.4)`) with a subtle inner glow (`inset 0 0 20px rgba(124,58,237,0.04)`).

Recipe cards use the same values inline (not the `.glass` class) with a 2px accent strip at the top (purple→indigo→transparent gradient, 70% opacity) and a separator line between header and steps.

## Components

### Button — Primary
Full-width, 14px borderRadius. Gradient fill `#7c3aed → #4f46e5` (135°). Box-shadow: `0 0 20px rgba(124,58,237,0.3)` + inset highlight. Hover: shadow expands to 30px/50% + `translateY(-1px)`. Disabled: 35% opacity, no transform, `not-allowed` cursor. Loading state replaces icon with a 16px spinning ring (border `2px`, border-top white, `spin 0.7s linear infinite`).

### Glass Panels (Form Cards)
`borderRadius: 20`, `padding: 24px`. Use `.glass` class. Focus-within upgrades border.

### Input Fields
`borderRadius: 10`, `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(255,255,255,0.08)`. Focus via JS event handlers: border → `rgba(124,58,237,0.5)`, box-shadow → `0 0 0 2px rgba(124,58,237,0.15)`.

### Select (Unit)
Same base style as input. Custom SVG chevron via `backgroundImage` data URI (color `#475569`). `appearance: none`, `paddingRight: 28px`. Option background: `#0d0b1a`.

### Time Input
Larger variant: 80px wide, `borderRadius: 14`, `fontSize: 28px / fontWeight: 800`. Background `rgba(124,58,237,0.08)`, border `rgba(124,58,237,0.3)`. Focus: border 0.6 opacity + `0 0 0 3px rgba(124,58,237,0.18)` ring.

### Preset Buttons (Time)
Pill shape (`borderRadius: 999`). Two states:
- **Inactive:** transparent bg, `rgba(255,255,255,0.08)` border, text-3 color. Hover → accent border + accent-light text.
- **Active:** `rgba(124,58,237,0.2)` bg, `rgba(124,58,237,0.7)` border, `#c4b5fd` text.

### Ghost Button (Add Ingredient)
`borderRadius: 8`, `background: rgba(124,58,237,0.12)`, `border: rgba(124,58,237,0.25)`, text accent-light. Hover: bg → 0.20, border → 0.45. Contains a `+` SVG icon (11×11, strokeWidth 1.8).

### Remove Button
32×32px, `borderRadius: 8`, transparent bg. Shows `×` (fontSize 18). Hover → `#f87171` text + `rgba(239,68,68,0.1)` bg.

### Brand Badge
Pill (`borderRadius: 999`), `background: rgba(124,58,237,0.12)`, border 0.3 opacity accent. Contains 6×6px circle dot with `pulse-glow 2s ease-in-out infinite`. Text: 11px / Space Grotesk / 700 / 0.1em tracking / uppercase / accent-light.

### Error Box
`borderRadius: 16`, `background: rgba(239,68,68,0.08)`, `border: rgba(239,68,68,0.25)`. Two-line: label ("ERRO") in `#f87171` / 10px + message in `rgba(252,165,165,0.8)` / 13px. Animates in with `fadeUp 0.2s`.

### Recipe Card
`borderRadius: 20`, glass-like bg/border inline. Three sections separated by 1px dividers:
1. **Header** — index label (text-3) + difficulty badge + time display / recipe name (20px/700/Space Grotesk) + description
2. **Steps** — "Modo de preparo" label + ordered list. Each step: 22px circle step number (purple bg/border, accent-light text) + step text
3. **Missing ingredients** (conditional) — amber-tinted panel with pill chips for each missing item

### Difficulty Badge
Pill (`borderRadius: 999`), 10px/700/Space Grotesk/uppercase. Three variants:
- Fácil: `#34d399` text, 10% bg, 25% border
- Médio: `#fbbf24` text, 10% bg, 25% border
- Difícil: `#f87171` text, 10% bg, 25% border

### Empty States
- No ingredients: dashed border `rgba(124,58,237,0.2)`, `rgba(124,58,237,0.03)` bg, 32px vertical padding
- No recipes found: glass card, centered, 48px padding, emoji + heading + helper text

## Animations

Three keyframe animations defined in globals.css:

| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| `spin` | 0.7s | linear infinite | Loading spinner in submit button |
| `fadeUp` | 0.2–0.3s | ease | Error box + results container on appear |
| `pulse-glow` | 2s | ease-in-out infinite | Brand badge dot box-shadow |

`fadeUp`: `opacity: 0, translateY(10px)` → `opacity: 1, translateY(0)`.

`pulse-glow`: box-shadow oscillates between `0 0 6px rgba(124,58,237,0.6)` and `0 0 12px rgba(124,58,237,1)`.
