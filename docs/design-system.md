---
title: Yellow Hood — Design System
source_url: https://www.notion.so/steering-agency/Design-System-3783cf957a68804f8561f85c2dc45f09
last_synced: 2026-07-19
canonical_source: "This file is a generated mirror. The Notion page at source_url is the single source of truth. Never hand-edit this file — regenerate it from Notion instead."
---

# Yellow Hood — Design System

**Based on @qpub/qui (Radix Primitives + CVA + Tailwind CSS) · React 18**

> 🧪 **Component QA:** Run `npm run storybook` to visually QA any component against this doc — Controls, Actions logging, and All-Variants Matrix stories replace manually eyeballing the app's `/design-system` page. This doc stays the canonical token/spec reference; Storybook is the tool for checking a component against it.

---

## Colors

### Philosophy

- **Primary** = Yellow — the main CTA color; amber-gold tone
- **Secondary** = Purple — secondary actions and accents
- **Tertiary** = Blue — third official brand accent color
- **Warning** = Orange — distinct from primary yellow; used for non-critical alerts
- **Danger** = Pink/Red — errors and destructive actions
- **Success** = Green — confirmation and success states
- **Default** = Zinc — neutral buttons and standard UI elements

### Important: Figma color names vs. code color names

In the Figma design file, color rows are labeled with generic names ("yellow", "purple", "orange", etc.). In `tailwind.config.ts`, these map to semantic names (primary, secondary, warning, etc.). Always use the semantic names in code — never use Figma's internal label names.

The Figma file's blue color row is officially **Tertiary — Blue**, a third brand accent documented as its own numbered scale below — separate from Secondary — Purple.

All numbered shade scales (primary-50…900, secondary-50…900, tertiary-50…900, warning-50…900, danger-50…900, success-50…900) are theme-aware — each step has a distinct Light/Dark hex value, wired via CSS variables in `globals.css` and referenced in `tailwind.config.ts`, the same pattern the `divider` token uses. Default (Zinc) is the one exception: a single flat scale used identically in both themes, by design (see its own section below).

---

### Primary — Yellow

| Scale | Light | Dark |
| --- | --- | --- |
| 50 | #FFFAEB | #3D1F00 |
| 100 | #FEF0C7 | #5C2F00 |
| 200 | #FEE089 | #9D5508 |
| 300 | #FDCA4C | #C97106 |
| 400 | #FDB933 | #E48D09 |
| 500 | #F9AA1A | #F9AA1A |
| 600 | #E48D09 | #FDB933 |
| 700 | #C97106 | #FDCA4C |
| 800 | #9D5508 | #FEE089 |
| 900 | #5C2F00 | #FEF0C7 |
| DEFAULT | #F9AA1A | #FDB933 |
| foreground | #18181B | #18181B |

Note: Primary yellow is intentionally a mid-dark amber — NOT a bright or pastel yellow. Light mode uses a deeper/more saturated gold for contrast against a light page background; dark mode uses a lighter gold for contrast against a dark background. Text on primary buttons is always dark (#18181B) in both modes.

### Secondary — Purple

| Scale | Light | Dark |
| --- | --- | --- |
| 50 | #F5EEFF | #672A7E |
| 100 | #EBDCFF | #8C3EAF |
| 200 | #E1CBFF | #A64DCC |
| 300 | #D7BBFF | #B958E6 |
| 400 | #CDA9FF | #CF6AFF |
| 500 | #CF6AFF | #D7BBFF |
| 600 | #B958E6 | #E1CBFF |
| 700 | #A64DCC | #EBDCFF |
| 800 | #8C3EAF | #F5EEFF |
| 900 | #672A7E | #F5EEFF |
| DEFAULT | #B958E6 | #CF6AFF |
| foreground | #FFFFFF | #FFFFFF |

Note: light mode uses the deeper/more saturated tone for contrast against a light page background; dark mode uses the lighter tone for contrast against a dark background. Text is white in both modes.

### Tertiary — Blue

| Scale | Light | Dark |
| --- | --- | --- |
| 50 | #EBF2FF | #24389D |
| 100 | #D6E3FF | #4E67D9 |
| 200 | #C2D4FF | #5C75E6 |
| 300 | #AEC5FF | #6A84F2 |
| 400 | #99B6FF | #7792FF |
| 500 | #7792FF | #99B6FF |
| 600 | #6A84F2 | #AEC5FF |
| 700 | #5C75E6 | #C2D4FF |
| 800 | #4E67D9 | #D6E3FF |
| 900 | #24389D | #EBF2FF |

### Warning — Orange

| Scale | Light | Dark |
| --- | --- | --- |
| 50 | #FFF3EE | #803211 |
| 100 | #FFEAD9 | #B34F24 |
| 200 | #FFCAA5 | #CC5B29 |
| 300 | #FF8F5B | #E6672E |
| 400 | #FF844B | #FF7332 |
| 500 | #FF7332 | #FF844B |
| 600 | #E6672E | #FF8F5B |
| 700 | #CC5B29 | #FFCAA5 |
| 800 | #B34F24 | #FFEAD9 |
| 900 | #803211 | #FFF3EE |
| DEFAULT | #FF7332 | #FF844B |
| foreground | #FFFFFF | #18181B |

### Danger — Pink/Red

| Scale | Light | Dark |
| --- | --- | --- |
| 50 | #FEE7EF | #310413 |
| 100 | #FDD0DF | #610726 |
| 200 | #FAA0BF | #920B3A |
| 300 | #F871A0 | #C20E4D |
| 400 | #F54180 | #F31260 |
| 500 | #F31260 | #F54180 |
| 600 | #C20E4D | #F871A0 |
| 700 | #920B3A | #FAA0BF |
| 800 | #610726 | #FDD0DF |
| 900 | #310413 | #FEE7EF |
| DEFAULT | #F31260 | #F54180 |
| foreground | #FFFFFF | #FFFFFF |

### Success — Green

| Scale | Light | Dark |
| --- | --- | --- |
| 50 | #E8FAF0 | #052814 |
| 100 | #D1F4E0 | #095028 |
| 200 | #A2E9C1 | #0E793C |
| 300 | #74DFA2 | #12A150 |
| 400 | #45D483 | #17C964 |
| 500 | #17C964 | #45D483 |
| 600 | #12A150 | #74DFA2 |
| 700 | #0E793C | #A2E9C1 |
| 800 | #095028 | #D1F4E0 |
| 900 | #052814 | #E8FAF0 |
| DEFAULT | #17C964 | #45D483 |
| foreground | #FFFFFF | #18181B |

### Default — Zinc (neutral, same scale used in both modes)

| Scale | Value |
| --- | --- |
| 50 | #FAFAFA |
| 100 | #F4F4F5 |
| 200 | #E4E4E7 |
| 300 | #D4D4D8 |
| 400 | #A1A1AA |
| 500 | #71717A |
| 600 | #52525B |
| 700 | #3F3F46 |
| 800 | #27272A |
| 900 | #18181B |

Semantic `DEFAULT`/`foreground` (used by `bg-default`, `text-default-foreground`):

| Token | Light | Dark |
| --- | --- | --- |
| DEFAULT | #E4E4E7 | #3F3F46 |
| foreground | #18181B | #FAFAFA |

### Background / Foreground / Content Layers

| Token | Light | Dark |
| --- | --- | --- |
| background | #FFFFFF | #000000 |
| foreground | #18181B | #FAFAFA |
| content1 | #FFFFFF | #18181B |
| content2 | #F4F4F5 | #27272A |
| content3 | #E4E4E7 | #3F3F46 |
| content4 | #D4D4D8 | #52525B |
| divider | #E4E4E7 (zinc-200) | #3F3F46 (zinc-700) |

Content foreground levels (text on content layers):

| Level | Light text | Dark text |
| --- | --- | --- |
| foreground1 | #18181B (zinc-900) | #FAFAFA (zinc-50) |
| foreground2 | #27272A (zinc-800) | #F4F4F5 (zinc-100) |
| foreground3 | #3F3F46 (zinc-700) | #D4D4D8 (zinc-300) |
| foreground4 | #52525B (zinc-600) | #A1A1AA (zinc-400) |

---

## Sizes & Spacing

### Spacing Units

| Token | px |
| --- | --- |
| unit-xs | 8 |
| unit-sm | 12 |
| unit-md | 16 |
| unit-lg | 22 |
| unit-xl | 36 |
| unit-2xl | 48 |
| unit-3xl | 80 |
| unit-4xl | 120 |
| unit-5xl | 224 |
| unit-6xl | 288 |
| unit-7xl | 384 |
| unit-8xl | 512 |
| unit-9xl | 640 |

### Border Radius

| Token | Value | Usage |
| --- | --- | --- |
| rounded-none | 0px | no rounding |
| rounded-small | 8px | small standalone elements only — OTP inputs and Chips use rounded-medium (12px), not rounded-small; see the OTP Input section below |
| rounded-medium | 12px | inputs, small buttons (sm) |
| rounded-large | 14px | buttons (md/lg/xl), cards, modals |
| rounded-full | 999px | pill badges, avatar rings |

### Borders

| Token | Value | Usage |
| --- | --- | --- |
| border-small | 1px | default input border, inactive OTP |
| border-medium | 1.5px | — |
| border-large | 3px | — |

---

## Typography

### Font Families

- **EN:** `Nunito` — self-hosted variable font via `next/font/local`, served from `fonts/Nunito-Variable.ttf`
- **FA:** `IRANSansXV` — self-hosted variable font via `next/font/local`, served from `fonts/IRANSansXV.ttf`; always apply `font-variation-settings: 'dots' 8`

Both fonts must be loaded before rendering any UI. If IRANSansXV is not available, fall back to a system sans-serif — never fall back to Nunito for Persian text.

### English (EN) Type Scale

Lead uses weight 300 (font-light), matching the deliberate EN/FA weight-matching pattern used throughout this scale (the same reasoning behind H1 being 900 in EN but 800 in FA).

| Role | Size | Line height | Weight | Token |
| --- | --- | --- | --- | --- |
| H1 | 72px | 72px (1.0) | 900 black | text-7xl / font-black |
| H2 | 36px | 40px | 800 extrabold | text-4xl / font-extrabold |
| Subtitle | 24px | 32px | 600 semibold | text-subtitle / font-semibold |
| Lead | 20px | 28px | 300 light | text-lead / font-light |
| Body | 16px | 24px | 400 normal | text-base / font-normal |
| Label | 12px | 16px | 700 bold | text-xs / font-bold |
| Text Button SM | 12px | 16px | 600 semibold | text-xs / font-semibold |
| Text Button MD | 14px | 20px | 600 semibold | text-sm / font-semibold |
| Text Button LG | 16px | 24px | 500 medium | text-base / font-medium |
| Text Button XL | 18px | 28px | 500 medium | text-lg / font-medium |

### Persian (FA) Type Scale

| Role | Size | Line height | Weight |
| --- | --- | --- | --- |
| H1 | 72px | 72px | 800 extrabold |
| H2 | 36px | 40px | 700 bold |
| Subtitle | 24px | 32px | 600 demibold |
| Lead | 20px | 28px | 300 light |
| Body | 16px | 24px | 400 normal |
| Label | 12px | 16px | 700 bold |
| Text Button SM | 12px | 16px | 500 |
| Text Button MD | 14px | 20px | 500 |
| Text Button LG | 16px | 24px | 400 |
| Text Button XL | 18px | 28px | 400 |

Note: Persian H1 uses extrabold (800) vs English H1 which uses black (900). This is intentional — IRANSansXV does not have a true 900 weight.

---

## Buttons

Yellow Hood uses five button types: the custom Animated component, plus four `@qpub/qui` Button variants (Solid, Bordered, Flat, Ghost). Read the full spec before implementing any button.

---

### Button Type 1 — Animated Button (Custom 3D / 2.5D)

This is a **fully custom component** — it does not exist in `@qpub/qui`. Do not try to implement it using qui's Button with CSS hacks. Build it as a standalone component.

**Visual behavior:** It looks like a physical keyboard key with visible depth. On press, the top layer moves down 8px to simulate a click. On release, it springs back.

**Two-layer structure:**

- **Wall layer** — a static div positioned 8px below the button layer. This is the "side wall" of the key. It is always a darker shade of the button color.
- **Button layer** — the interactive element that sits on top. On press: `translateY(4px)`. On release: returns to `translateY(0)`.

```typescript
// AnimatedButton — custom component implementation reference
interface AnimatedButtonProps {
  color?: "primary" | "secondary" | "default";
  size?: "lg" | "xl";  // role-based, NOT device-based: lg = regular primary CTA (any device), xl = hero/single-focus CTA e.g. login, onboarding (any device)
  startContent?: React.ReactNode;
  children: React.ReactNode;
  onPress?: () => void;
  isDisabled?: boolean;
}

// Layout (size lg, total container height 48px):
// Face height reuses the NEXT SIZE DOWN's total height — e.g. lg's face = md's 40px face, xl's face = lg's 48px face.
// Wall layer: absolute, inset-x-0 bottom-0, height 8px, rounded-b-[14px], bg = wallColor (always visible at rest, sits BELOW the face, not covered by it)
// Button layer (face): absolute, inset-x-0 top-0, height = container height - 8px, rounded-[14px], bg = buttonColor
//              on active: translateY(8px), transition: transform 80ms ease-out (face moves down to sit flush with wall)
//              on release: translateY(0), transition: transform 120ms ease-in
// IMPORTANT: face height must be EXPLICITLY set to (container - 8px) — never inset-0 / 100% height, or it will fully cover the wall in every state.
```

**Color values — fixed, independent values (do NOT derive from the numbered scale's positional index; the scale is theme-aware and mirrors between light/dark, so a fixed position like "primary-400" resolves to a different hex per theme):**

| Color | Mode | Button layer | Hover | Wall layer | Text |
| --- | --- | --- | --- | --- | --- |
| primary | light | #FDCA4C | #F9C142 | #E48D09 | #18181B |
| primary | dark | #FDB933 | #F5AE2C | #C97106 | #18181B |
| secondary | light | #CF6AFF | #C966F7 | #A64DCC | #18181B |
| secondary | dark | #B958E6 | #B254DE | #8C3EAF | #FFFFFF |
| default | light | #E4E4E7 | #DADADE | #A1A1AA | #18181B |
| default | dark | #52525B | #4C4C54 | #27272A | #FFFFFF |

Key rules:

- Primary yellow is amber-gold — NOT pastel. Use #FDCA4C (light) and #FDB933 (dark) exactly.
- Default (zinc) in light mode = light gray face, dark text. In dark mode = dark charcoal face, white text.
- Wall layer is always a significantly darker shade than the button face, in both light and dark mode — a fixed, independent value per the table above, not derived from the numbered scale's position index.
- Only three colors exist for Animated: primary, secondary, default. No danger, success, or warning.
- Font inside button: Text Button LG (16px, weight 500 medium, Nunito)
- Icon inside button: 20×20px, color matches text color

**Sizes:**

| size | use case | total height | face height | wall height | padding | radius |
| --- | --- | --- | --- | --- | --- | --- |
| lg | regular primary CTA (any device) | 48px | 40px (same face as the md-step button) | 8px | 0px 24px | 14px |
| xl | hero / single-focus CTA — e.g. login, onboarding (any device) | 56px | 48px (same face as the lg-step button) | 8px | 0px 24px | 14px |

The wall riser is 8px at every step. Each size's face height equals the total height of the step below it: lg's face (40px) = md's total height; xl's face (48px) = lg's total height.

Size is role-based, not device-based: **xl is for hero/single-focus CTAs** (the one primary action on a page, e.g. login, onboarding, payment confirmation) and **lg is for regular primary CTAs** — both usable on any device/screen width.

There is no Solid or Bordered equivalent at XL size — XL exists only for Animated.

**Disabled state:** reduce opacity to 0.4 on both layers. Do not remove the wall layer.

**Loading state:** show a spinner inside the button layer at the same position as the icon. Button layer should not animate on press during loading.

---

### Button Type 2 — Solid Button

Standard `@qpub/qui` `variant="solid"`. Use where Animated is not appropriate: inside cards, inline flows, modals, small action areas.

```typescript
<Button color="primary" variant="solid" size="lg">Login</Button>
<Button color="secondary" variant="solid" size="md">Login</Button>
<Button color="default" variant="solid" size="sm">Login</Button>
<Button color="error" variant="solid" size="md" isDisabled>Delete</Button>
<Button color="success" variant="solid" size="md" isLoading>Saving</Button>
```

Available colors: primary, secondary, default, error, success, warning
Available sizes: sm, md, lg (NOT xl)

**Default color appearance:**

- Light: background `#52525B`, text `#FFFFFF`
- Dark: background `#E4E4E7`, text `#18181B`

---

### Button Type 3 — Bordered Button

Standard `@qpub/qui` `variant="bordered"`. Use for ghost/outline actions, or as a secondary option alongside a Solid or Animated button.

```typescript
<Button color="primary" variant="bordered" size="lg">Login</Button>
<Button color="default" variant="bordered" size="sm">Cancel</Button>
```

Available colors: primary, secondary, default, error, success, warning
Available sizes: sm, md, lg (NOT xl)

**Color values (border + text, background always transparent):**

| Color | Light | Dark |
| --- | --- | --- |
| primary | #C97106 | #FDB933 |
| secondary | #A64DCC | #CF6AFF |
| warning | #CC5B29 | #FF844B |
| success | #0E793C | #45D483 |
| error | #920B3A | #F54180 |
| default | #52525B | #E4E4E7 |

**Hover:** border and text stay unchanged from rest state — only a background tint appears, `bg-{color}/20`, in both themes, for every color including default.

---

### Button Type 4 — Flat Button

Standard `@qpub/qui` `variant="flat"`, with app-level overrides in `components/ui/Button.tsx` for rest-state text color and hover behavior. A softer, tinted-background alternative to Solid — no border. Use for lower-emphasis actions that still need color-coding without competing visually with a Solid or Animated primary CTA nearby.

**Rest-state text color:** pinned to the same value as Ghost's rest-state text for that color — `text-{color}-700` in light mode, `dark:text-{color}` in dark mode (see Button Type 5 below for the exact per-color hex values). Background stays `bg-{color}/20` in both themes.

**Hover:** text color never changes — stays pixel-identical to rest. Only the background tint deepens (becomes more opaque than rest), signaling interaction without any loss of text contrast.

```typescript
<Button color="primary" variant="flat" size="md">Learn more</Button>
```

---

### Button Type 5 — Ghost Button

Standard `@qpub/qui` `variant="ghost"`, with app-level overrides in `components/ui/Button.tsx`. A true borderless "ghost" pattern — no border ever renders, in either rest or hover state, in either theme. Text-only at rest; a background tint appears on hover, sized to the same bounds the border used to occupy.

**Rest-state color values (text only — background and border are always transparent):**

| Color | Light | Dark |
| --- | --- | --- |
| primary | #C97106 | #FDB933 |
| secondary | #A64DCC | #CF6AFF |
| warning | #CC5B29 | #FF844B |
| success | #0E793C | #45D483 |
| error | #920B3A | #F54180 |
| default | #52525B | #E4E4E7 |

**Hover:** identical behavior to Bordered's hover (see Button Type 3 above) — a `bg-{color}/20` background tint appears, applied uniformly in both light and dark mode, for every color including default. No border ever appears at any point. Text color stays unchanged from rest — it does not switch to a solid foreground pairing (unlike the retired "fills solid" behavior this replaces).

```typescript
<Button color="primary" variant="ghost" size="md">Learn more</Button>
```

---

### Which button type to use

| Situation | Button type |
| --- | --- |
| Primary CTA on a full page (login, pay, continue) | Animated primary |
| Primary CTA inside a modal or card (e.g. a game card's "Play" button, a wallet connect card's "Connect" button, any card in a grid/list) | Solid primary — NOT Animated. Animated is reserved for full-page/full-flow primary actions, never for a repeated element inside a grid or list of cards. |
| Secondary action alongside a primary CTA | Animated secondary or Solid secondary |
| Destructive action (delete, remove) | Solid error |
| Cancel / dismiss | Bordered default |
| Neutral inline action | Solid default |
| Hero / single-focus CTA (e.g. login, onboarding, payment confirmation) — any device | Animated primary XL |
| Primary CTA on a dedicated full-page flow that isn't the single hero action (e.g. a wallet's main Swap/Send/Receive action on its own page, not inside a small card) | Animated primary LG |

The test is not "is this a primary action" — it's "is this the single hero action of a dedicated page/flow, or is it one repeated instance inside a grid/list of cards?" Cards always get Solid, regardless of color/importance.

---

### Color × Type Availability Matrix

| Color | Animated | Solid | Bordered | Flat | Ghost |
| --- | --- | --- | --- | --- | --- |
| primary | Yes — LG and XL | Yes | Yes | Yes | Yes |
| secondary | Yes — LG only | Yes | Yes | Yes | Yes |
| default | Yes — LG only | Yes | Yes | Yes | Yes |
| error | No | Yes | Yes | Yes | Yes |
| success | No | Yes | Yes | Yes | Yes |
| warning | No | Yes | Yes | Yes | Yes |

---

### Button Sizes — full spec

`sm` is 28px natively (@qpub/qui). `md` is natively 36px in `@qpub/qui`, but is overridden to 40px in the app-level `components/ui/Button.tsx` wrapper (mirroring the same override pattern used for Input and Select) so that Button, Input, and Select all default to the same 40px height. `sm` and `lg` are left untouched at their native values.

| size | available in | height | h-padding | font-size | font-weight | radius |
| --- | --- | --- | --- | --- | --- | --- |
| sm | Solid, Bordered | 28px (native @qpub/qui, not overridden) | 12px | 12px | 600 | 12px |
| md (default) | Solid, Bordered | 40px (native @qpub/qui md is 36px — overridden to 40px in `components/ui/Button.tsx`) | 16px | 14px | 600 | 14px |
| lg | All three types | 48px | 24px | 16px | 500 | 14px |
| xl | Animated only | 56px | 24px | 16px | 500 | 14px |

Note: MD size does not exist for Animated Button. If you need a medium-sized animated feel, use Solid instead.

### Size Usage Guidelines

**AnimatedButton**

- `xl` — the largest size. Use for a fixed, full-width CTA at the bottom of a page, or any context that is free to feature a single standalone primary action (hero/single-focus flows — e.g. login, onboarding, payment confirmation).
- `lg` — use when the button is paired with another button, or sits alongside other content rather than standing alone (e.g. inside the Header or Footer, where it shares space with other elements).

**Button (Solid / Bordered / Flat / Ghost)**

- `lg` — standalone functional actions, e.g. "Save profile", "Confirm" — typically paired with a Bordered `default` button beside it (e.g. Cancel / Save).
- `md` — the default choice inside boxes, cards, and popups/modals.
- `sm` — buttons that sit close together, or need to stay compact — e.g. a card's trailing action row, or an inline confirm action.

### Select

`components/ui/Select.tsx` wraps `@qpub/qui`'s `SelectTrigger`. Only the `bordered` variant exists in `@qpub/qui` for Select — there is no solid/flat/ghost option.

Select is brought in line with the other form controls (Input, AnimatedButton, Chip):

1. **Radius** — `@qpub/qui`'s native SelectTrigger hardcodes `rounded-xs`. Overridden in `components/ui/Select.tsx` to `rounded-medium` (12px), matching Input and every other interactive control.
2. **Sizes** — Select officially supports two sizes, mirroring Input exactly: default (40px, overridden from qui's native 36px) and lg (56px, overridden from qui's native 48px). `sm` (28px, native) remains unexposed/unused, same as Input.

| size | height | border-radius | source |
| --- | --- | --- | --- |
| (default) | 40px | rounded-medium (12px) | native @qpub/qui md is 36px — overridden in `components/ui/Select.tsx` |
| lg | 56px | rounded-medium (12px) | native @qpub/qui lg is 48px — overridden in `components/ui/Select.tsx`, matching Input's lg override |

Only the default (40px) is currently used in real production call sites (settings page) — lg is documented/available and shown on the `/design-system` page but has no real production usage yet.

---

### Tabs

Tabs uses `@qpub/qui`'s `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent` directly (imported in `app/design-system/page.tsx`) — there is no `components/ui/Tabs.tsx` app-level wrapper, since Tabs has no real production usage anywhere in the app yet. The spec below documents how Tabs matches Yellow Hood's color system, ready for whenever a wrapper is needed.

Rendered as a pill/segmented control — rounded-full track, active trigger is a solid rounded-full pill filled with the primary color, inactive triggers sit directly on the track with no background.

**Colors:**

| State | Background | Text (light) | Text (dark) |
| --- | --- | --- | --- |
| Track (TabsList) | default-100 (light) / default-800 (dark) | — | — |
| Active trigger | bg-primary (semantic, theme-aware) | text-primary-foreground | text-primary-foreground |
| Inactive trigger (enabled) | transparent | default-500 (#71717A) | default-500 (#71717A) — same value, no dark override needed; this flat mid-gray is the app's established "safe in both themes" muted-text convention, used the same way throughout `/design-system` for secondary/description text |
| Disabled trigger | transparent | default-400 (#A1A1AA) | default-600 (#52525B) — intentionally goes darker/more muted in dark mode (opposite direction from normal text) so it reads as clearly dimmer than the enabled inactive state in both themes |

No underline anywhere — the active state is communicated purely by the filled pill.

---

### Button States

| State | Animated | Solid / Bordered |
| --- | --- | --- |
| Default | Normal, wall visible below | Normal qui appearance |
| Hover | Dedicated, subtle per-color face shift (see AnimatedButton Color values table above for exact hex per color/theme) — no change to wall or press behavior | qui auto-hover (~10% brightness shift) |
| Pressed | Button layer translateY(8px), wall becomes fully visible | qui active state |
| Disabled | `isDisabled` prop; both layers at 40% opacity | `isDisabled` prop; qui handles opacity |
| Loading | `isLoading` behavior — spinner shown, press animation disabled | `isLoading` prop, implemented in `components/ui/Button.tsx` (`@qpub/qui`'s own Button has no native loading/spinner support) — swaps to a `Spinner` and forces `isDisabled` |

Do not manually implement disabled or loading states. Always use `isDisabled` and `isLoading` props.

---

### Default (Zinc) Button — Full Spec

The default color has no semantic meaning. It is intentionally neutral. Full breakdown:

**Animated Default — Light:**

- Button face: #E4E4E7 — light gray
- Wall: #A1A1AA — medium gray, a two-step contrast against face. Fixed, independent value — not derived from or bound to the numbered zinc scale.
- Text + icon: #18181B

**Animated Default — Dark:**

- Button face: #52525B — medium-dark gray, keeps a two-step contrast against the wall (matching the light-mode gap)
- Wall: #27272A — deep charcoal
- Text + icon: #FFFFFF

**Solid Default — Light:**

- Background: `#52525B`
- Text: `#FFFFFF`

**Solid Default — Dark:**

- Background: `#E4E4E7`
- Text: `#18181B`

**Bordered Default — Light:**

- Border: `#52525B`
- Text: `#52525B`
- Background: transparent
- Hover: border/text unchanged, background tint `#52525B`/20

**Bordered Default — Dark:**

- Border: `#E4E4E7`
- Text: `#E4E4E7`
- Background: transparent
- Hover: border/text unchanged, background tint `#E4E4E7`/20

**Flat Default — Light:**

- Background: `#52525B`/20, text: `#52525B`
- Hover: text unchanged (`#52525B`), background deepens (more opaque than rest)

**Flat Default — Dark:**

- Background: `#E4E4E7`/20, text: `#E4E4E7`
- Hover: text unchanged (`#E4E4E7`), background deepens (more opaque than rest)

**Ghost Default — Light:**

- Text: `#52525B`, background and border always transparent
- Hover: background tint `#52525B`/20 appears, text unchanged, border stays absent

**Ghost Default — Dark:**

- Text: `#E4E4E7`, background and border always transparent
- Hover: background tint `#E4E4E7`/20 appears, text unchanged, border stays absent

Note: this color is dedicated to Button/Chip's `default` only — it is a fixed, component-scoped pair, decoupled from the semantic `bg-default`/`text-default-foreground` token (which exists but is not wired into any real component) and from `--foreground`/`--background` (the page's own text/background colors).

---

## Inputs

Only `variant="bordered"` is used. Never use `variant="flat"` or `variant="underlined"`.

### Input structure

Each input has:

- A **label**, rendered as a static element above the input box — not floating or animated.
- A **content** area (the typed value)
- A **border** that changes color by state
- Optional **startContent** / **endContent** slots (20×20px icons)

### Input Typography

Input content, placeholder, and label follow the same EN/FA font-switching rule as the rest of the type scale — Nunito for EN, IRANSansXV (with `font-variation-settings: 'dots' 8`) for FA — sized and weighted as Body (16px/400), matching the Body role in the main type scale above. Font selection follows the input's `dir` prop automatically (`dir="rtl"` → IRANSansXV, default/`dir="ltr"` → Nunito) — the component switches font-family internally, the same way heading/body text switches by language elsewhere in the app. No manual per-call-site font override should be needed.

### Input States

| State | Border (light) | Border (dark) | Background | Label color | Notes |
| --- | --- | --- | --- | --- | --- |
| Default (idle) | #E4E4E7 zinc-200 | #3F3F46 zinc-700 | `bg-muted/5` | #52525B zinc-600 | Border is subtle |
| Hovered | #A1A1AA zinc-400 | #71717A zinc-500 | `bg-muted/5` (unchanged) | #52525B | Slightly stronger border; background does not shift on hover |
| Selected / Focused | #F9AA1A primary-500 | #F9AA1A | `bg-muted/5` (unchanged) | #F9AA1A | Border and label turn primary yellow; background does not shift on focus |
| Warning | #FF7332 warning-500 | #FF7332 | `bg-warning/5` | #FF7332 | Border and label turn orange |
| Error / Invalid | #F31260 danger-500 | #F31260 | `bg-error/10` | #F31260 | Border and label turn danger pink; background uses double the standard /5 opacity (isInvalid override), not the general bg-\{color\}/5 formula |
| Success | #17C964 success-500 | #17C964 | `bg-success/5` | #17C964 | Border and label turn success green |

Background pattern (previously undocumented): background is a flat `bg-{color}/5` tint tied to the input's active `color` — it is set once and stays constant across idle/hover/focus; only the border color changes between those three interaction states. `{color}` follows the same token as the border/label (`muted` for the default/neutral state, `warning`, `success`). The one exception is Error/Invalid, which uses `bg-error/10` (double opacity) via the `isInvalid` prop, not the general formula. `muted`, `warning`, `error`, and `success` are theme-aware CSS variables (`app/globals.css`), so a single `bg-{color}/{opacity}` class — no `dark:` variant needed — renders correctly in both themes.

Focus/selected state for Persian (FA) inputs: The border becomes white (#FFFFFF) in dark mode instead of yellow. Label color stays #F9AA1A. This is a special case for RTL context only.

### Input Sizes

Input `lg` height matches AnimatedButton's `xl` height (56px), keeping one consistent "large touch-target" height across Input and Button. Border-radius stays `rounded-medium` (12px) at every size, explicitly pinned regardless of size — matching `components/ui/OtpInput.tsx`.

The default size height is 40px, matching the unified default height shared by Button and Select — all three form controls default to 40px so they align visually when placed together (e.g. a form with Input + Select + Button).

| size prop | total height | border-radius | usage | source |
| --- | --- | --- | --- | --- |
| (default) | 40px | rounded-medium (12px) | used by every Input in the app today (no `size` prop is ever passed, so this is the current de facto standard size) | native @qpub/qui `size="md"` is 36px — overridden to 40px in the app-level `components/ui/Input.tsx` wrapper |
| lg | 56px | rounded-medium (12px) — must be explicitly set, not inherited | large/touch-friendly variant, matching AnimatedButton xl (56px) | native @qpub/qui `size="lg"` is only 48px — overridden in the app-level `components/ui/Input.tsx` wrapper (height only; do not touch `@qpub/qui` itself) |

Only these two sizes are officially supported: default (40px) and lg (56px). `sm` (28px, native to @qpub/qui) is not used anywhere in the app and is not part of the documented Input size set.

`lg` is the primary, default recommendation — larger and easier to read and fill, so it's used first in Login, modals, and popups. The default (40px) size is reserved for layouts where multiple inputs need to sit side by side and horizontal space is limited.

The label sits as a static element above the input box at all times — it does not float, shrink, or move on focus/fill.

### Input Props Reference

```typescript
// Basic usage
<Input
  variant="bordered"
  size="lg"
  label="Email"
  placeholder="you@example.com"
/>

// States via props
<Input variant="bordered" size="lg" color="warning" label="Username" />
<Input variant="bordered" size="lg" isInvalid errorMessage="Required" label="Password" />

// Disabled
<Input variant="bordered" size="lg" isDisabled label="Read only" />

// With icons
<Input
  variant="bordered"
  size="lg"
  startContent={<Icon />}
  endContent={<Icon />}
  label="Search"
/>
```

### Persian / RTL Input

Font-family switches automatically based on `dir` (see Input Typography above) — no manual `font-[IRANSansXV]` override needed. Only layout-specific classes (text alignment, wrapper direction) are passed manually:

```typescript
<Input
  variant="bordered"
  size="lg"
  dir="rtl"
  label="نام کامل"
  classNames={{
    input: "text-right",
    label: "right-3 left-auto",
    innerWrapper: "flex-row-reverse",
  }}
/>
```

### OTP Input

Four separate bordered inputs in a row.

OTP Input supports two sizes, with cell height explicitly pinned to match Input's heights (width is independent, using the component's own proportional width):

| size prop | cell dimensions | height matches |
| --- | --- | --- |
| lg (default, no size prop needed) | 48px wide × 56px tall | Input's lg (56px) |
| sm (opt-in, `size="sm"`) | 40px wide × 40px tall | Input's default (40px) |

- Border-radius: 12px (rounded-medium), both sizes — same as Input.
- Border: theme-aware, following Input's bordered-state idle/hover/focus pattern (see Input States table above) rather than a flat light-gray:
  - Idle: `#E4E4E7` zinc-200 (light) / `#3F3F46` zinc-700 (dark), 1px
  - Hover: `#A1A1AA` zinc-400 (light) / `#71717A` zinc-500 (dark), 1px
  - Active/focused: `#F9AA1A` primary-500 (both themes), 2px
- Background: shares Input's exact default-color background pattern (see Input States table above) — flat `bg-muted/5`, unchanged across idle/hover/focus, replacing the previous flat `bg-background`
- Centered single character text inside each cell
- Font: Text Button LG (16px, weight 500)
- On the `/design-system` page, OTP Input is documented as a subsection of **Inputs** (after Select), not as its own top-level section — grouping all form-control specimens together.

---

## Avatar

Standard `@qpub/qui` `Avatar` — no dedicated `components/ui/Avatar.tsx` wrapper; sizing is applied directly at call sites via a shared size map (the `/design-system` page's own `AVATAR_SIZES` array).

### Sizes & Usage

Ordered largest → smallest, left to right — matching every other component's specimen layout on `/design-system`.

| Size | Dimensions | Radius | Usage |
| --- | --- | --- | --- |
| xl | 80×80px | rounded-large (14px) | Main Profile screen, Settings |
| lg | 64×64px | rounded-full | App Header |
| md | 48×48px | rounded-full | Leaderboard, Friends list, Chat / Mission cards |
| sm | 32×32px | rounded-full | Cards, Notifications |

Note: xl is the only size that breaks from the circular default — a squircle radius reserved for the hero/profile context (Main Profile, Settings). lg, md, and sm stay fully circular (`rounded-full`). This is a component-scoped exception to the general border-radius rule (sm → medium, md–lg → large) used elsewhere in the system — Avatar's default shape is always circular, with xl as the single, deliberate hero-context exception.

### Structure

- `src` always from props
- Initials fallback when no `src` is provided
- Optional `ring-2 ring-primary` for active/selected state — applies uniformly across all four sizes

---

## Tailwind Config (tailwind.config.ts)

Token values are defined directly in `tailwind.config.ts` under `theme.extend` and via CSS variables in `globals.css` — see the Colors, Border Radius, and Borders tables above for the canonical values. `@qpub/qui` consumes these same Tailwind tokens through its preset.

---

## Rules

### Do

```typescript
// Always use semantic color props
<Button color="primary" variant="solid" size="lg" />
<Button color="default" variant="solid" size="md" />
<Chip color="success" />
<Input variant="bordered" size="lg" />
<Input variant="bordered" isInvalid color="error" />
<div className="text-error">Error message</div>
<div className="bg-primary text-primary-foreground">Highlight</div>

// Use isDisabled and isLoading props — never fake these manually
<Button color="primary" variant="solid" isDisabled />
<Button color="primary" variant="solid" isLoading />
```

### Do NOT

```typescript
// Never hardcode hex values on components
<Button style={{ backgroundColor: "#FDCA4C" }} />
<Button className="bg-[#FDCA4C] text-[#18181B]" />

// Never fake disabled/loading state
<Button className="opacity-50 cursor-not-allowed" />
<div className="flex items-center gap-2"><Spinner /><Button /></div>

// Never use wrong input variants
<Input variant="flat" />
<Input variant="underlined" />

// Tertiary blue is a numbered scale only (bg-tertiary-500, text-tertiary-700, etc.)
// No semantic tertiary/tertiary-foreground token exists yet — do not invent one
```

### Font Usage

```typescript
// English
<p className="font-[Nunito] font-medium text-base leading-6">Body text</p>
<h1 className="font-[Nunito] font-black text-7xl leading-none">Heading 1</h1>

// Persian / RTL — always include fontVariationSettings
<p
  className="font-[IRANSansXV] font-normal text-base leading-6 text-right"
  style={{ fontVariationSettings: "'dots' 8" }}
  dir="rtl"
>
  متن فارسی
</p>

// Never mix font families on the same text element
// Never use Nunito for Persian content
// Never use IRANSansXV without fontVariationSettings: 'dots' 8
```

---

## Implementation Notes — @qpub/qui (Post-Migration)

**Migration status: Done.** Component foundation moved from HeroUI (NextUI v2) to `@qpub/qui` (Radix Primitives + CVA + Tailwind CSS). **Every value on this page — colors, spacing, radius, typography — is unchanged and remains the single source of truth.** Only the underlying component implementation layer changed.

### What changed

- All `@heroui/*` packages removed; zero remaining imports.
- `@qpub/qui` installed via a Tailwind preset with the full token set injected: border-radius (small 8px / medium 12px / large 14px), border-width (small 1px / medium 1.5px / large 3px), all six color scales (primary/secondary/warning/danger/success/default) with light/dark DEFAULTs, background/foreground, and both font families (Nunito EN, IRANSansXV FA).
- Component props are no longer HeroUI's (`variant="solid" color="primary"`) — see the per-component mapping below.

### Component-by-component mapping

| Component | Implementation |
| --- | --- |
| Chip / Badge | `components/ui/Chip.tsx` — CVA-based. Variants: solid/bordered/flat/dot. Colors (Chip's own public API): primary/secondary/success/warning/danger/default — Chip deliberately keeps `danger` as its public prop name and translates it internally to the underlying qui primitive's `error` key; this is an intentional translation layer, not an inconsistency. Sizes: sm/md/lg. `dot` is not a distinct background style — it renders identically to `flat` (10%-opacity tinted background, no border) plus a small solid-color circle marker prepended before the content; padding around the marker+text is consistent with Chip's other variants. Bordered's non-`default` colors use the same light-mode step-700 border/text values as Button's Bordered (see Button Type 3 above); dark mode uses each color's semantic DEFAULT value. Bordered's hover currently has no visible effect for any color, including `default` — a known limitation of the underlying qui primitive. The underlying qui `Badge` primitive is never used directly anywhere in the app — always through this Chip wrapper; the `/design-system` page's "Badges" section actually renders `<Chip>` components, despite the section label. |
| AnimatedButton | `components/ui/AnimatedButton.tsx` — custom two-layer (wall + button), same spec as documented above: press translateY(8px) 80ms ease-out, release 120ms ease-in, 3 colors only (primary/secondary/default), lg/xl sizes (role-based, not device-based — see Sizes table above). |
| Solid / Bordered Button | `components/ui/Button.tsx` — thin wrapper over `@qpub/qui`'s Button. Passes props through unchanged except the default/md size, which is overridden from qui's native 36px to 40px (matching Input and Select). sm (28px) and lg (48px) are untouched. Classified per the "Which button type to use" table above. |
| Input | `components/ui/Input.tsx` wrapper — bordered variant only, static label above the input, RTL dark-mode white-border focus override retained exactly as spec'd above. Default height overridden to 40px, lg to 56px (both overridden from qui's native 36px/48px). |
| Select | `components/ui/Select.tsx` — thin wrapper over `@qpub/qui`'s SelectTrigger, same default-height-override pattern as Button (36px → 40px). Only the `bordered` variant exists (native to qui). |
| OTP Input | `components/ui/OtpInput.tsx` — 4 independent single-char cells, auto-advance on input, backspace clears current cell and returns focus to previous, `onComplete` callback when all 4 filled. Two sizes: lg (default, 48×56) and sm (opt-in, 40×40) — see OTP Input section above. |
| Avatar | No dedicated `components/ui/Avatar.tsx` wrapper exists — sizing is applied directly to the real `@qpub/qui` `Avatar` via the page's own `AVATAR_SIZES` array. See the dedicated Avatar section (below Inputs) for the full size/radius/usage spec. `src` always from props, initials fallback, optional `ring-2 ring-primary` for active/selected state, uniform across sizes. |

### Technical invariants (carried over from the migration epic)

- No hardcoded hex values anywhere — Tailwind semantic classes only.
- Only the `bordered` variant is used for Input — `flat` and `underlined` are forbidden.
- AnimatedButton `xl` size is for hero/single-focus CTAs (e.g. login, onboarding) — usable on any device, not tied to screen width (role-based, not device-based).
- AnimatedButton exists in exactly three colors: primary, secondary, default. No danger/success/warning.
- Tertiary blue is an official numbered color scale, wired into `tailwind.config.ts` with distinct Light/Dark values — see Colors section above. It has no semantic `tertiary`/`tertiary-foreground` token and is not wired into any component's `color` prop yet.

### Reference

Migration epic: [Migrate Component Foundation: HeroUI → @qpub/qui](https://app.notion.com/p/38d3cf957a688133b78eca1bf5bf3eec) — Status: Done
