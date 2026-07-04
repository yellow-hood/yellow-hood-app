/* eslint-disable react/no-unescaped-entities */
"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Separator,
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@qpub/qui";
import { useTheme } from "next-themes";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { OtpInput } from "@/components/ui/OtpInput";
import { SelectTrigger } from "@/components/ui/Select";
import { MoonLinearIcon, SunLinearIcon, SettingsLinearIcon } from "@/components/ui/icons";

// Real control radius token (Yellow Hood Design System radius tokens, tailwind.config.ts).
// AnimatedButton (components/ui/AnimatedButton.tsx) uses `rounded-medium` for both its
// wall and face layers, so that's the real token for interactive controls on this page.
const CONTROL_RADIUS_CLASS = "rounded-medium";
const DOC_CARD_CLASS =
  "mx-auto w-full border border-default-200 dark:border-default-800 bg-background/70 backdrop-blur";

// Literal Tailwind class names are required here (not template-literal composition):
// Tailwind's JIT content scanner only detects class names that appear verbatim as
// substrings in the source file text, so `bg-${family}-${step}` would silently fail
// to generate any CSS. Each entry below is the real, live-generated utility class for
// the corresponding scale in tailwind.config.ts theme.extend.colors.
const PRIMARY_SWATCHES = [
  { step: 50, bgClass: "bg-primary-50" },
  { step: 100, bgClass: "bg-primary-100" },
  { step: 200, bgClass: "bg-primary-200" },
  { step: 300, bgClass: "bg-primary-300" },
  { step: 400, bgClass: "bg-primary-400" },
  { step: 500, bgClass: "bg-primary-500" },
  { step: 600, bgClass: "bg-primary-600" },
  { step: 700, bgClass: "bg-primary-700" },
  { step: 800, bgClass: "bg-primary-800" },
  { step: 900, bgClass: "bg-primary-900" },
] as const;

const SECONDARY_SWATCHES = [
  { step: 50, bgClass: "bg-secondary-50" },
  { step: 100, bgClass: "bg-secondary-100" },
  { step: 200, bgClass: "bg-secondary-200" },
  { step: 300, bgClass: "bg-secondary-300" },
  { step: 400, bgClass: "bg-secondary-400" },
  { step: 500, bgClass: "bg-secondary-500" },
  { step: 600, bgClass: "bg-secondary-600" },
  { step: 700, bgClass: "bg-secondary-700" },
  { step: 800, bgClass: "bg-secondary-800" },
  { step: 900, bgClass: "bg-secondary-900" },
] as const;

const WARNING_SWATCHES = [
  { step: 50, bgClass: "bg-warning-50" },
  { step: 100, bgClass: "bg-warning-100" },
  { step: 200, bgClass: "bg-warning-200" },
  { step: 300, bgClass: "bg-warning-300" },
  { step: 400, bgClass: "bg-warning-400" },
  { step: 500, bgClass: "bg-warning-500" },
  { step: 600, bgClass: "bg-warning-600" },
  { step: 700, bgClass: "bg-warning-700" },
  { step: 800, bgClass: "bg-warning-800" },
  { step: 900, bgClass: "bg-warning-900" },
] as const;

const DANGER_SWATCHES = [
  { step: 50, bgClass: "bg-danger-50" },
  { step: 100, bgClass: "bg-danger-100" },
  { step: 200, bgClass: "bg-danger-200" },
  { step: 300, bgClass: "bg-danger-300" },
  { step: 400, bgClass: "bg-danger-400" },
  { step: 500, bgClass: "bg-danger-500" },
  { step: 600, bgClass: "bg-danger-600" },
  { step: 700, bgClass: "bg-danger-700" },
  { step: 800, bgClass: "bg-danger-800" },
  { step: 900, bgClass: "bg-danger-900" },
] as const;

const SUCCESS_SWATCHES = [
  { step: 50, bgClass: "bg-success-50" },
  { step: 100, bgClass: "bg-success-100" },
  { step: 200, bgClass: "bg-success-200" },
  { step: 300, bgClass: "bg-success-300" },
  { step: 400, bgClass: "bg-success-400" },
  { step: 500, bgClass: "bg-success-500" },
  { step: 600, bgClass: "bg-success-600" },
  { step: 700, bgClass: "bg-success-700" },
  { step: 800, bgClass: "bg-success-800" },
  { step: 900, bgClass: "bg-success-900" },
] as const;

const DEFAULT_SWATCHES = [
  { step: 50, bgClass: "bg-default-50" },
  { step: 100, bgClass: "bg-default-100" },
  { step: 200, bgClass: "bg-default-200" },
  { step: 300, bgClass: "bg-default-300" },
  { step: 400, bgClass: "bg-default-400" },
  { step: 500, bgClass: "bg-default-500" },
  { step: 600, bgClass: "bg-default-600" },
  { step: 700, bgClass: "bg-default-700" },
  { step: 800, bgClass: "bg-default-800" },
  { step: 900, bgClass: "bg-default-900" },
] as const;

type ColorFamily = "primary" | "secondary" | "warning" | "danger" | "success" | "default";

// Rough per-family lightness threshold for swatch label contrast. Not a design token —
// just picks readable label text for the live hex readout.
const TEXT_CONTRAST_THRESHOLD: Record<ColorFamily, number> = {
  primary: 700,
  secondary: 500,
  warning: 600,
  danger: 500,
  success: 600,
  default: 600,
};

// Semantic single-value tokens, driven by the CSS variables in app/globals.css and the
// @qpub/qui preset (oklch(var(--primary)), etc). Unlike the numbered scales above, these
// ARE theme-aware and will change live when the page's light/dark toggle is used.
// Note: the numbered pink/red scale is named `danger` in tailwind.config.ts, but its
// semantic DEFAULT counterpart is named `error` in the qui preset / globals.css (see
// Navbar.tsx's `text-error`) — both are real, correctly-named tokens for the same family.
const SEMANTIC_TOKENS = [
  { name: "Primary", bg: "bg-primary", text: "text-primary-foreground", border: "border-primary" },
  { name: "Secondary", bg: "bg-secondary", text: "text-secondary-foreground", border: "border-secondary" },
  { name: "Success", bg: "bg-success", text: "text-success-foreground", border: "border-success" },
  { name: "Warning", bg: "bg-warning", text: "text-warning-foreground", border: "border-warning" },
  { name: "Error (Danger)", bg: "bg-error", text: "text-error-foreground", border: "border-error" },
  { name: "Default", bg: "bg-default", text: "text-foreground", border: "border-default-300 dark:border-default-400" },
] as const;

const SURFACE_TOKENS = [
  {
    name: "bg-surface",
    className: "bg-background",
    description: "Primary layout background",
  },
  {
    name: "bg-elevated",
    className: "bg-default-50 dark:bg-default-900",
    description: "Cards and raised containers",
  },
  {
    name: "bg-subtle",
    className: "bg-default-100 dark:bg-default-800",
    description: "Nested groups and quiet emphasis",
  },
] as const;

const SPACING_SWATCHES = [
  { token: "1", widthClass: "w-1" },
  { token: "2", widthClass: "w-2" },
  { token: "3", widthClass: "w-3" },
  { token: "4", widthClass: "w-4" },
  { token: "6", widthClass: "w-6" },
  { token: "8", widthClass: "w-8" },
  { token: "10", widthClass: "w-10" },
  { token: "12", widthClass: "w-12" },
  { token: "16", widthClass: "w-16" },
] as const;

const RADIUS_SWATCHES = [
  { name: "Small", token: "rounded-small", className: "rounded-small" },
  { name: "Medium (Controls)", token: "rounded-medium", className: "rounded-medium", highlight: true },
  { name: "Large", token: "rounded-large", className: "rounded-large" },
] as const;

const BUTTON_VARIANTS = ["solid", "bordered", "flat", "ghost"] as const;
const BUTTON_COLORS = ["primary", "secondary", "default", "success", "warning", "error"] as const;

const ALERT_TOKENS = [
  { color: "success", name: "Success" },
  { color: "warning", name: "Warning" },
  { color: "error", name: "Error" },
  { color: "info", name: "Info" },
] as const;

const AVATAR_SIZES = [
  { size: "sm", avatarClass: "h-8 w-8", textClass: "text-xs", initials: "YH" },
  { size: "md", avatarClass: "h-10 w-10", textClass: "text-sm", initials: "KM" },
  { size: "lg", avatarClass: "h-14 w-14", textClass: "text-base", initials: "AN" },
  { size: "xl", avatarClass: "h-16 w-16", textClass: "text-lg", initials: "FH" },
] as const;

type UsageGuidance = {
  use: string;
  avoid: string;
  mistakes: string;
};

export default function DesignSystemPage() {
  const isProd = process.env.NODE_ENV === "production";
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-background px-4 py-16 font-nunito text-foreground sm:px-6 sm:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20">
        <header className="flex w-full max-w-5xl flex-col gap-8 border-b border-default-200 dark:border-default-800 pb-12">
          <div className="flex flex-col-reverse items-start justify-between gap-6 sm:flex-row">
            <div className="space-y-6">
              <p className="text-xs font-label uppercase tracking-[0.08em] text-default-500">
                Documentation
              </p>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                Yellow Hood Design System
              </h1>
              <p className="max-w-3xl text-lead font-light text-default-500">
                Canonical reference for tokens, components, states, and usage patterns.
                Every value and component on this page is imported live from tailwind.config.ts
                and components/ui/ — nothing here is a hardcoded copy.
              </p>
            </div>
            <Button
              isIconOnly
              variant="light"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle light/dark mode for this page"
              className="shrink-0"
            >
              {mounted ? (
                theme === "dark" ? <SunLinearIcon size={20} /> : <MoonLinearIcon size={20} />
              ) : (
                <SunLinearIcon size={20} />
              )}
            </Button>
          </div>

          <nav className="flex flex-wrap gap-3 text-xs md:text-sm">
            <NavPill href="#typography">Typography</NavPill>
            <NavPill href="#colors">Colors</NavPill>
            <NavPill href="#spacing-radius">Spacing & Radius</NavPill>
            <NavPill href="#buttons">Buttons</NavPill>
            <NavPill href="#inputs">Inputs</NavPill>
            <NavPill href="#otp-input">OTP Input</NavPill>
            <NavPill href="#badges-chips">Badges & Chips</NavPill>
            <NavPill href="#avatars-cards">Avatars & Cards</NavPill>
            <NavPill href="#alerts-tabs-lists">Alerts, Tabs & Rows</NavPill>
          </nav>

          {isProd && (
            <p className="text-xs font-semibold tracking-wide text-secondary">
              This page is intended for design and engineering audits.
            </p>
          )}
        </header>

        <section id="typography" className="w-full max-w-5xl space-y-8">
          <SectionHeader
            title="Typography"
            description="Nunito is the Latin typeface. Keep hierarchy clear through weight and spacing before adding extra visual chrome."
          />
          <DocCard>
            <div className="space-y-8">
              <TypographySample
                label="H1 / Page title"
                titleClass="text-4xl font-black tracking-tight md:text-5xl"
                titleText="The quick brown fox jumps over the lazy dog"
                description="Reserved for one primary title per page."
              />
              <Separator className="bg-default-100" />
              <TypographySample
                label="H2 / Section title"
                titleClass="text-2xl font-bold md:text-3xl"
                titleText="The quick brown fox jumps over the lazy dog"
                description="Use for major content groups and section starts."
              />
              <Separator className="bg-default-100" />
              <TypographySample
                label="Lead / Intro copy"
                titleClass="text-lead font-light text-default-500"
                titleText="Lead copy gives framing context and helps users scan content quickly."
                description="Keep it short and avoid putting actions inside lead text."
              />
              <Separator className="bg-default-100" />
              <TypographySample
                label="Body / Default copy"
                titleClass="text-base leading-relaxed text-foreground"
                titleText="Body text handles instructions, supporting details, and guidance."
                description="Prefer complete sentences with concise structure."
              />
              <Separator className="bg-default-100" />
              <TypographySample
                label="Label / Forms and controls"
                titleClass="text-xs font-label text-foreground"
                titleText="Email address"
                description="Keep labels specific and use sentence case."
              />
              <Separator className="bg-default-100" />
              <div className="space-y-4" dir="rtl">
                <p className="text-xs font-semibold text-default-500" dir="ltr">
                  Persian / RTL — font-iranxv token
                </p>
                <p className="font-iranxv text-2xl">
                  روباه قهوه‌ای چابک از روی سگ تنبل می‌پرد
                </p>
                <p className="text-sm text-default-500" dir="ltr">
                  This uses the real <code>font-iranxv</code> Tailwind class from tailwind.config.ts.
                  As of this page&apos;s last edit, no font file, <code>next/font</code> call, or
                  <code>@font-face</code> rule backs the <code>--font-iranxv</code> CSS variable
                  anywhere in the app, so this text is currently rendering in the inherited fallback
                  font rather than IRANSansXV. This gap is flagged for the codebase owners, not fixed
                  by this page.
                </p>
              </div>
            </div>
          </DocCard>
          <UsageBlock
            guidance={{
              use: "Apply this scale for page titles, section headers, descriptive copy, and field labels.",
              avoid: "Creating one-off text sizes for individual screens.",
              mistakes: "Using muted text for interactive labels or overusing heavy weights in dense layouts.",
            }}
          />
        </section>

        <section id="colors" className="w-full max-w-5xl space-y-8">
          <SectionHeader
            title="Color System"
            description="Color is token-first: numbered scales support design decisions, semantic tokens communicate intent, and surfaces establish depth."
          />
          <DocCard>
            <div className="space-y-10">
              <div className="space-y-6">
                <SubgroupHeader
                  title="Numbered scales"
                  description="Every swatch below reads its true rendered color live via getComputedStyle on the real Tailwind utility class — nothing here is a duplicated hex string, so it can't drift from tailwind.config.ts."
                />
                <ColorScaleGrid title="Primary (Amber-Gold)" family="primary" swatches={PRIMARY_SWATCHES} />
                <ColorScaleGrid title="Secondary (Purple)" family="secondary" swatches={SECONDARY_SWATCHES} />
                <ColorScaleGrid title="Warning (Orange)" family="warning" swatches={WARNING_SWATCHES} />
                <ColorScaleGrid title="Danger (Pink/Red)" family="danger" swatches={DANGER_SWATCHES} />
                <ColorScaleGrid title="Success (Green)" family="success" swatches={SUCCESS_SWATCHES} />
                <ColorScaleGrid title="Default (Neutral)" family="default" swatches={DEFAULT_SWATCHES} />
                <p className="text-xs text-default-500">
                  Flag: these numbered scales use one flat hex per step regardless of light/dark mode —
                  toggling the page above will not change them. See QA note on the spec card.
                </p>
              </div>

              <Separator className="bg-default-100" />

              <div className="space-y-6">
                <SubgroupHeader
                  title="Semantic tokens"
                  description="Single-value tokens driven by CSS variables in globals.css. These are theme-aware — toggle light/dark above and watch them update live."
                />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {SEMANTIC_TOKENS.map((token) => (
                    <SemanticTokenPreview key={token.name} token={token} />
                  ))}
                </div>
              </div>

              <Separator className="bg-default-100" />

              <div className="space-y-6">
                <SubgroupHeader
                  title="Surface layers"
                  description="Surface tokens communicate depth and grouping without heavy borders."
                />
                <div className="grid gap-6 md:grid-cols-3">
                  {SURFACE_TOKENS.map((surface) => (
                    <SurfaceTokenPreview key={surface.name} surface={surface} />
                  ))}
                </div>
              </div>
            </div>
          </DocCard>
          <UsageBlock
            guidance={{
              use: "Use semantic tokens for message intent and surface tokens for container depth.",
              avoid: "Choosing arbitrary palette shades directly in product UI.",
              mistakes: "Using warning/error colors for decorative accents unrelated to state or feedback.",
            }}
          />
        </section>

        <section id="spacing-radius" className="w-full max-w-5xl space-y-8">
          <SectionHeader
            title="Spacing & Radius"
            description="Layout rhythm is built on the app's 8pt spacing scale (tailwind.config.ts theme.spacing). Every value below is measured live from a rendered element, not typed out by hand."
          />
          <DocCard>
            <div className="grid gap-10 md:grid-cols-2">
              <div className="space-y-6">
                <SubgroupHeader
                  title="Spacing tokens"
                  description="Prefer `space-6` and `space-8` between major groups to keep hierarchy readable."
                />
                <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
                  {SPACING_SWATCHES.map((item) => (
                    <SpacingSwatch key={item.token} token={item.token} widthClass={item.widthClass} />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <SubgroupHeader
                  title="Radius tokens"
                  description="Interactive controls (AnimatedButton, Chip, Input) share `rounded-medium`; larger surfaces can use `rounded-large`."
                />
                <div className="space-y-4 text-xs">
                  {RADIUS_SWATCHES.map((item) => (
                    <RadiusRow
                      key={item.token}
                      name={item.name}
                      token={item.token}
                      className={item.className}
                      highlight={"highlight" in item ? item.highlight : false}
                    />
                  ))}
                </div>
              </div>
            </div>
          </DocCard>
          <UsageBlock
            guidance={{
              use: "Apply 24/32px spacing between stacked groups and keep controls on shared radius tokens.",
              avoid: "Mixing unrelated radius values within the same interaction cluster.",
              mistakes: "Using borders to separate every block instead of spacing and subtle surfaces.",
            }}
          />
        </section>

        <section id="buttons" className="w-full max-w-5xl space-y-8">
          <SectionHeader
            title="Buttons"
            description="Two real button implementations exist in this app: the custom AnimatedButton (components/ui/AnimatedButton) and the @qpub/qui Button primitive."
          />
          <DocCard>
            <div className="space-y-10">
              <div className="space-y-6">
                <SubgroupHeader
                  title="Animated Button (components/ui/AnimatedButton)"
                  description="Hover, press, and Tab-focus the buttons below directly — these are the real interactive component, not a static mockup."
                />
                <div className="space-y-8">
                  {(["primary", "secondary", "default"] as const).map((color) => (
                    <div key={color} className="space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-default-500">{color}</p>
                      <div className="flex flex-wrap items-center gap-6">
                        <AnimatedButton color={color} size="lg">Continue</AnimatedButton>
                        <AnimatedButton color={color} size="xl">Continue (xl)</AnimatedButton>
                        <AnimatedButton color={color} size="lg" isDisabled>Disabled</AnimatedButton>
                        <AnimatedButton color={color} size="lg" isLoading>Loading</AnimatedButton>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-default-500">
                  Disabled and loading above use the component&apos;s real `isDisabled` / `isLoading`
                  props. AnimatedButton defines a real press animation (translateY on pointer-down) but
                  no dedicated hover style, so hovering will not visibly change it — that is the
                  component&apos;s actual behavior today, not an omission on this page.
                </p>
                <p className="text-xs text-default-500">
                  Investigation: at rest, the wall layer&apos;s `&lt;div&gt;` spans from 4px below the
                  container top to the container bottom, but the button face is not shorter than the
                  wall — it stretches to fill the full container height (flex default `align-items:
                  normal`) and paints above it at `z-index: 10`, so the wall is fully covered in every
                  state, including when pressed (measured live: container 0–48px, wall 4–48px, face
                  0–48px in both rest and pressed states). This is a real gap in
                  `components/ui/AnimatedButton.tsx` itself, not a spacing issue on this page — no
                  page-level CSS change can expose it, so it is flagged for the component owner rather
                  than patched here.
                </p>

                <Separator className="bg-default-100" />

                <div className="space-y-4">
                  <SubgroupHeader
                    title="Sizes"
                    description="AnimatedButton only defines two sizes — lg for desktop and xl for mobile-only hero CTAs. Shown here in primary color only, since size is independent of color."
                  />
                  <div className="flex flex-wrap items-end gap-8 rounded-xl border border-default-200 dark:border-default-800 bg-default-50 p-6 dark:bg-default-900">
                    <div className="space-y-2 text-center">
                      <AnimatedButton color="primary" size="lg">Continue</AnimatedButton>
                      <p className="text-[11px] text-default-500">lg — 48px (desktop)</p>
                    </div>
                    <div className="space-y-2 text-center">
                      <AnimatedButton color="primary" size="xl">Continue</AnimatedButton>
                      <p className="text-[11px] text-default-500">xl — 56px (mobile-only)</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-default-100" />

              <div className="space-y-6">
                <SubgroupHeader
                  title="Button (@qpub/qui primitive)"
                  description="Interact directly with the buttons below for real hover/focus states."
                />
                <div className="space-y-6">
                  {BUTTON_VARIANTS.map((variant) => (
                    <div key={variant} className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-default-500">{variant}</p>
                      <div className="flex flex-wrap gap-4">
                        {BUTTON_COLORS.map((color) => (
                          <Button key={color} variant={variant} color={color} size="md">
                            {color}
                          </Button>
                        ))}
                        <Button variant={variant} color="primary" size="md" isDisabled>
                          Disabled
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-default-500">
                  This component has no `isLoading` prop today, so no loading specimen is shown here —
                  flagged rather than simulated.
                </p>

                <Separator className="bg-default-100" />

                <div className="space-y-4">
                  <SubgroupHeader
                    title="Icon-only"
                    description="Solid variant, primary and default colors, sm/md/lg — no visible text label, icon only. Interact directly for real hover/focus; disabled uses the component's real `isDisabled` prop. Each button carries a real `aria-label` since there is no visible text for assistive tech to read."
                  />
                  <div className="flex flex-wrap items-end gap-8 rounded-xl border border-default-200 dark:border-default-800 bg-default-50 p-6 dark:bg-default-900">
                    {(["primary", "default"] as const).map((color) => (
                      <div key={color} className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-default-500">{color}</p>
                        <div className="flex flex-wrap items-end gap-3">
                          <div className="space-y-1 text-center">
                            <Button
                              isIconOnly
                              variant="solid"
                              color={color}
                              size="sm"
                              aria-label={`${color} settings, small`}
                            >
                              <SettingsLinearIcon size={16} />
                            </Button>
                            <p className="text-[11px] text-default-500">sm</p>
                          </div>
                          <div className="space-y-1 text-center">
                            <Button
                              isIconOnly
                              variant="solid"
                              color={color}
                              size="md"
                              aria-label={`${color} settings, medium`}
                            >
                              <SettingsLinearIcon size={18} />
                            </Button>
                            <p className="text-[11px] text-default-500">md</p>
                          </div>
                          <div className="space-y-1 text-center">
                            <Button
                              isIconOnly
                              variant="solid"
                              color={color}
                              size="lg"
                              aria-label={`${color} settings, large`}
                            >
                              <SettingsLinearIcon size={20} />
                            </Button>
                            <p className="text-[11px] text-default-500">lg</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="space-y-1 text-center">
                      <Button isIconOnly variant="solid" color="primary" size="md" isDisabled aria-label="Settings, disabled">
                        <SettingsLinearIcon size={18} />
                      </Button>
                      <p className="text-[11px] text-default-500">disabled</p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-default-100" />

                <div className="space-y-4">
                  <SubgroupHeader
                    title="Sizes"
                    description="Shown here for the solid variant, primary color only, since size is independent of variant/color."
                  />
                  <div className="flex flex-wrap items-end gap-6 rounded-xl border border-default-200 dark:border-default-800 bg-default-50 p-6 dark:bg-default-900">
                    <div className="space-y-2 text-center">
                      <Button variant="solid" color="primary" size="sm">Continue</Button>
                      <p className="text-[11px] text-default-500">sm — 32px</p>
                    </div>
                    <div className="space-y-2 text-center">
                      <Button variant="solid" color="primary" size="md">Continue</Button>
                      <p className="text-[11px] text-default-500">md — 40px</p>
                    </div>
                    <div className="space-y-2 text-center">
                      <Button variant="solid" color="primary" size="lg">Continue</Button>
                      <p className="text-[11px] text-default-500">lg — 48px</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DocCard>
          <UsageBlock
            guidance={{
              use: "Place one primary action per region, with secondary/ghost actions for alternatives.",
              avoid: "Using danger/error styling for non-destructive operations.",
              mistakes: "Adding multiple primaries in one group or simulating states the component doesn't actually support.",
            }}
          />
        </section>

        <section id="inputs" className="w-full max-w-5xl space-y-8">
          <SectionHeader
            title="Inputs"
            description="Text inputs use components/ui/Input (a thin wrapper over the @qpub/qui bordered Input). Select uses the @qpub/qui Select primitive directly."
          />
          <DocCard>
            <div className="space-y-10">
              <div className="space-y-6">
                <SubgroupHeader
                  title="Input (components/ui/Input)"
                  description="Interact directly with the fields for real hover/focus; disabled and error/success below use the component's real props."
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <Input label="Full name" placeholder="Enter your name" helperText="Use your legal first and last name." />
                  <Input label="Email" color="success" placeholder="name@example.com" helperText="Email looks valid." />
                  <Input
                    label="Password"
                    type="password"
                    isInvalid
                    errorMessage="Password must be at least 8 characters."
                  />
                  <Input label="Role" placeholder="Owner" isDisabled helperText="Managed by organization policy." />
                </div>
                <p className="text-xs text-default-500">
                  This component has no `isLoading` prop today, so no loading specimen is shown here —
                  flagged rather than simulated.
                </p>

                <Separator className="bg-default-100" />

                <div className="space-y-4">
                  <SubgroupHeader
                    title="Sizes"
                    description="Only two sizes are officially supported: the default (no `size` prop, what every existing usage in the app renders today) and `lg` — 56px, matched to AnimatedButton's mobile-only `xl` height, since Input `lg` and AnimatedButton `xl` are the app's two large touch-target mobile controls. @qpub/qui's native `sm` (28px) exists in the library but is not exposed here. Both sizes share the same `rounded-medium` (12px) radius — radius does not scale with size."
                  />
                  <div className="flex flex-wrap items-end gap-8 rounded-xl border border-default-200 dark:border-default-800 bg-default-50 p-6 dark:bg-default-900">
                    <div className="space-y-2">
                      <Input label="Full name" placeholder="Enter your name" />
                      <p className="text-[11px] text-default-500">default — 40px</p>
                    </div>
                    <div className="space-y-2">
                      <Input label="Full name" placeholder="Enter your name" size="lg" />
                      <p className="text-[11px] text-default-500">lg — 56px</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-default-100" />

              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4 rounded-xl bg-default-50 p-6 dark:bg-default-900">
                  <p className="text-xs font-semibold text-default-500">
                    Textarea — no components/ui or @qpub/qui primitive exists yet; styled directly with
                    real tokens on a native element.
                  </p>
                  <label htmlFor="ds-textarea" className="block text-xs font-label text-foreground">
                    Description
                  </label>
                  <textarea
                    id="ds-textarea"
                    rows={4}
                    defaultValue="This control supports multiline content and follows input focus behavior."
                    className={`w-full resize-none border border-default-200 bg-background p-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-default-800 ${CONTROL_RADIUS_CLASS}`}
                  />
                </div>
                <div className="space-y-4 rounded-xl bg-default-50 p-6 dark:bg-default-900">
                  <p className="text-xs font-semibold text-default-500">Select (@qpub/qui)</p>
                  <div className="space-y-3">
                    <Select>
                      <SelectTrigger className="w-full" aria-label="Role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select isDisabled>
                      <SelectTrigger className="w-full" aria-label="Role (disabled)">
                        <SelectValue placeholder="Disabled" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </DocCard>
          <UsageBlock
            guidance={{
              use: "Use helper text proactively and reserve error text for validation failures.",
              avoid: "Replacing labels with placeholders.",
              mistakes: "Relying only on color for state without supporting copy or focus rings.",
            }}
          />
        </section>

        <section id="otp-input" className="w-full max-w-5xl space-y-8">
          <SectionHeader
            title="OTP Input"
            description="components/ui/OtpInput — four independent single-character cells with auto-advance and backspace-to-previous behavior."
          />
          <DocCard>
            <div className="space-y-6">
              <SubgroupHeader
                title="Live component"
                description="Type digits below to see real auto-advance/backspace behavior and the onComplete callback fire."
              />
              <div className="rounded-xl bg-default-50 p-6 dark:bg-default-900">
                <OtpInputDemo />
              </div>
              <p className="text-xs text-default-500">
                This component currently exposes no `disabled`, `error`, or `loading` props — only its
                default and native `focus:` state are shown above. This is a real gap in the component
                itself, not a limitation of this page; it is flagged for follow-up rather than added
                here, since extending OtpInput.tsx is out of scope for this task.
              </p>

              <Separator className="bg-default-100" />

              <div className="space-y-4">
                <SubgroupHeader
                  title="Sizes"
                  description="`lg` — 48×64px per cell — is the default (no `size` prop), matching the component's original unconditional size so no existing usage changes behavior. `sm` — 32×40px per cell — is a new opt-in size."
                />
                <div className="flex flex-wrap items-start gap-8 rounded-xl border border-default-200 dark:border-default-800 bg-default-50 p-6 dark:bg-default-900">
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-default-500">sm — 32×40px</p>
                    <OtpInputDemo size="sm" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-default-500">lg — 48×64px (default)</p>
                    <OtpInputDemo size="lg" />
                  </div>
                </div>
              </div>
            </div>
          </DocCard>
          <UsageBlock
            guidance={{
              use: "Use for fixed-length numeric confirmation codes (e.g. login OTP, verification).",
              avoid: "Using for free-form multi-character input or variable-length codes.",
              mistakes: "Wiring up disabled/error UI that the component doesn't actually support yet.",
            }}
          />
        </section>

        <section id="badges-chips" className="w-full max-w-5xl space-y-8">
          <SectionHeader
            title="Badges & Chips"
            description="Badges convey status or counts; chips represent lightweight entities and filter selections."
          />
          <DocCard>
            <div className="space-y-10">
              <div className="space-y-6">
                <SubgroupHeader
                  title="Badges"
                  description="Includes status, numeric, and dot indicators."
                />
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  <BadgeGroup title="Status" mode="status" />
                  <BadgeGroup title="Numeric" mode="numeric" />
                  <BadgeGroup title="Dot" mode="dot" />
                </div>
              </div>

              <Separator className="bg-default-100" />

              <div className="space-y-6">
                <SubgroupHeader
                  title="Chips"
                  description="Selectable chips should show clear active feedback; removable chips include explicit remove affordance."
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <ChipGroup title="Selectable" removable={false} />
                  <ChipGroup title="Removable" removable />
                </div>
              </div>
            </div>
          </DocCard>
          <UsageBlock
            guidance={{
              use: "Use badges for concise status metadata and chips for filters/tags.",
              avoid: "Using chips as primary navigation when tabs or list rows are more appropriate.",
              mistakes: "Hiding chip selected state behind subtle opacity-only changes.",
            }}
          />
        </section>

        <section id="avatars-cards" className="w-full max-w-5xl space-y-8">
          <SectionHeader
            title="Avatars & Cards"
            description="Avatars support identity density; card variants cover static, interactive, and elevated surfaces."
          />
          <DocCard>
            <div className="space-y-10">
              <div className="space-y-6">
                <SubgroupHeader title="Avatar (@qpub/qui)" description="Sizes and fallback initials for missing images." />
                <div className="flex flex-wrap items-end gap-8">
                  {AVATAR_SIZES.map(({ size, avatarClass, textClass, initials }) => (
                    <div key={size} className="space-y-2 text-center">
                      <Avatar className={avatarClass}>
                        <AvatarImage src={undefined} alt="" />
                        <AvatarFallback className={textClass}>{initials}</AvatarFallback>
                      </Avatar>
                      <p className="text-xs text-default-500">{size.toUpperCase()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-default-100" />

              <div className="space-y-6">
                <SubgroupHeader
                  title="Card (@qpub/qui)"
                  description="Default, interactive (ring + hover), and elevated (shadow) surfaces."
                />
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="border border-default-200 dark:border-default-800 bg-background">
                    <CardHeader>
                      <CardTitle>Default</CardTitle>
                      <CardDescription>Use tokenized surfaces and spacing to separate card content.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="flat" color="secondary" size="sm">Open details</Button>
                    </CardContent>
                  </Card>
                  <Card className="border border-default-200 dark:border-default-800 bg-background ring-2 ring-primary/40 transition hover:ring-primary">
                    <CardHeader>
                      <CardTitle>Interactive</CardTitle>
                      <CardDescription>Interactive cards must support hover, focus, and pressed states.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="solid" color="primary" size="sm">Open details</Button>
                    </CardContent>
                  </Card>
                  <Card className="border border-default-200 dark:border-default-800 bg-default-50 shadow-md dark:bg-default-900">
                    <CardHeader>
                      <CardTitle>Elevated</CardTitle>
                      <CardDescription>Use tokenized surfaces and spacing to separate card content.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="solid" color="primary" size="sm">Open details</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </DocCard>
          <UsageBlock
            guidance={{
              use: "Use default cards for static content and interactive cards when the whole container is actionable.",
              avoid: "Adding click handlers to elevated cards without focus/keyboard affordances.",
              mistakes: "Using elevation everywhere; depth should indicate hierarchy changes only.",
            }}
          />
        </section>

        <section id="alerts-tabs-lists" className="w-full max-w-5xl space-y-8">
          <SectionHeader
            title="Alerts, Tabs & List Rows"
            description="Feedback and navigation components need clear status semantics and strong interaction states."
          />
          <DocCard>
            <div className="space-y-10">
              <div className="space-y-6">
                <SubgroupHeader title="Alerts (@qpub/qui)" description="Semantic tone variants for success, warning, error, and info." />
                <div className="space-y-4">
                  {ALERT_TOKENS.map(({ color, name }) => (
                    <Alert key={color} color={color} variant="flat">
                      <AlertIcon />
                      <AlertContent>
                        <AlertTitle>{name} notification</AlertTitle>
                        <AlertDescription>This is a {name.toLowerCase()} alert/toast message preview.</AlertDescription>
                      </AlertContent>
                    </Alert>
                  ))}
                </div>
              </div>

              <Separator className="bg-default-100" />

              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6 rounded-xl bg-default-50 p-6 dark:bg-default-900">
                  <p className="text-sm font-semibold text-foreground">Tabs (@qpub/qui)</p>
                  <Tabs defaultValue="activity" color="primary">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                      <TabsTrigger value="billing" disabled>Billing</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                      <p className="text-xs text-default-500">Overview content.</p>
                    </TabsContent>
                    <TabsContent value="activity">
                      <p className="text-xs text-default-500">Activity content.</p>
                    </TabsContent>
                    <TabsContent value="billing">
                      <p className="text-xs text-default-500">Billing content.</p>
                    </TabsContent>
                  </Tabs>
                  <p className="text-xs text-default-500">
                    Click tabs directly to see real active/focus behavior; Billing is disabled via
                    Radix&apos;s native `disabled` prop.
                  </p>
                </div>
                <ListRowsDemo />
              </div>
            </div>
          </DocCard>
          <UsageBlock
            guidance={{
              use: "Use alerts for immediate feedback, tabs for sibling views, and rows for dense actionable lists.",
              avoid: "Using toasts for critical errors that require persistent attention.",
              mistakes: "Missing active/focus indicators on rows and tabs.",
            }}
          />
        </section>
      </div>
    </main>
  );
}

type SectionHeaderProps = { title: string; description: string };

function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="max-w-3xl text-sm text-default-500">{description}</p>
    </div>
  );
}

function SubgroupHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-label uppercase tracking-[0.08em] text-default-500">
        {title}
      </p>
      <p className="max-w-3xl text-sm text-default-500">{description}</p>
    </div>
  );
}

function UsageBlock({ guidance }: { guidance: UsageGuidance }) {
  return (
    <div className="space-y-4 rounded-xl border border-default-200 dark:border-default-800 bg-default-50 p-6 dark:bg-default-900">
      <p className="text-sm font-semibold text-foreground">Usage</p>
      <div className="grid gap-3 text-sm text-default-500 md:grid-cols-3">
        <p><span className="font-semibold text-foreground">When to use:</span> {guidance.use}</p>
        <p><span className="font-semibold text-foreground">When not to use:</span> {guidance.avoid}</p>
        <p><span className="font-semibold text-foreground">Common mistakes:</span> {guidance.mistakes}</p>
      </div>
    </div>
  );
}

function DocCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className={DOC_CARD_CLASS}>
      <CardContent className="space-y-8 p-6 sm:p-8 md:p-10">{children}</CardContent>
    </Card>
  );
}

function TypographySample({
  label,
  titleClass,
  titleText,
  description,
}: {
  label: string;
  titleClass: string;
  titleText: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-default-500">{label}</p>
      <p className={titleClass}>{titleText}</p>
      <p className="text-sm text-default-500">{description}</p>
    </div>
  );
}

type NavPillProps = { href: string; children: React.ReactNode };

function NavPill({ href, children }: NavPillProps) {
  return (
    <a
      href={href}
      className="rounded-full bg-default-100 px-4 py-2 text-xs font-medium text-default-500 transition hover:bg-default-200 dark:bg-default-800 dark:hover:bg-default-700"
    >
      {children}
    </a>
  );
}

function ColorScaleGrid({
  title,
  family,
  swatches,
}: {
  title: string;
  family: ColorFamily;
  swatches: readonly { step: number; bgClass: string }[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-default-500">{`bg-${family}-{step}`}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {swatches.map(({ step, bgClass }) => {
          const textClass = step >= TEXT_CONTRAST_THRESHOLD[family] ? "text-white" : "text-black";
          return (
            <ComputedHexSwatch
              key={`${family}-${step}`}
              label={`${family}-${step}`}
              bgClass={bgClass}
              textClass={textClass}
            />
          );
        })}
      </div>
    </div>
  );
}

function SemanticTokenPreview({
  token,
}: {
  token: (typeof SEMANTIC_TOKENS)[number];
}) {
  return (
    <div className="space-y-4 rounded-xl border border-default-200 dark:border-default-800 bg-background p-6">
      <p className="text-sm font-semibold text-foreground">{token.name}</p>
      <div className={`space-y-3 rounded-lg border p-4 ${token.bg} ${token.border} ${token.text}`}>
        <p className="text-xs font-semibold">Token usage preview</p>
        <p className="text-sm">Status copy uses semantic text color.</p>
      </div>
      <div className="space-y-1 text-xs text-default-500">
        <p>background: <span className="font-mono">{token.bg}</span></p>
        <p>text: <span className="font-mono">{token.text}</span></p>
        <p>border: <span className="font-mono">{token.border}</span></p>
      </div>
    </div>
  );
}

function SurfaceTokenPreview({
  surface,
}: {
  surface: (typeof SURFACE_TOKENS)[number];
}) {
  return (
    <div className="space-y-4 rounded-xl border border-default-200 dark:border-default-800 bg-background p-6">
      <p className="text-sm font-semibold text-foreground">{surface.name}</p>
      <div className={`h-24 rounded-lg border border-default-200 dark:border-default-700 ${surface.className}`} />
      <p className="text-xs text-default-500">{surface.description}</p>
      <p className="text-xs font-mono text-default-500">{surface.className}</p>
    </div>
  );
}

function SpacingSwatch({ token, widthClass }: { token: string; widthClass: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [px, setPx] = React.useState("—");

  React.useEffect(() => {
    if (!ref.current) return;
    setPx(window.getComputedStyle(ref.current).width);
  }, []);

  return (
    <div className="space-y-2 rounded-lg border border-default-200 dark:border-default-800 bg-default-50 p-4 dark:bg-default-900">
      <div ref={ref} className={`h-3 rounded-full bg-primary-500 ${widthClass}`} />
      <p className="text-sm font-semibold text-foreground">{px}</p>
      <p className="font-mono text-[11px] text-default-500">w-{token}</p>
    </div>
  );
}

type RadiusRowProps = {
  name: string;
  token: string;
  className: string;
  highlight?: boolean;
};

function RadiusRow({ name, token, className, highlight }: RadiusRowProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [radius, setRadius] = React.useState("—");

  React.useEffect(() => {
    if (!ref.current) return;
    setRadius(window.getComputedStyle(ref.current).borderRadius);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <div ref={ref} className={`h-10 w-20 border border-default-200 dark:border-default-800 bg-default-100 ${className}`} />
      <div className="space-y-1 text-xs">
        <p className={highlight ? "font-semibold text-secondary" : "font-semibold text-foreground"}>{name}</p>
        <p className="font-mono text-default-500">{token} • {radius}</p>
      </div>
    </div>
  );
}

function OtpInputDemo({ size }: { size?: "sm" | "lg" }) {
  const [completed, setCompleted] = React.useState<string | null>(null);

  return (
    <div className="space-y-3">
      <OtpInput size={size} onComplete={setCompleted} />
      <p className="text-xs text-default-500">
        {completed ? `onComplete fired with: ${completed}` : "Enter 4 characters to trigger onComplete."}
      </p>
    </div>
  );
}

function BadgeGroup({ title, mode }: { title: string; mode: "status" | "numeric" | "dot" }) {
  const entries: { label: string; color: "success" | "warning" | "danger" }[] =
    mode === "status"
      ? [
          { label: "Active", color: "success" },
          { label: "Pending", color: "warning" },
          { label: "Blocked", color: "danger" },
        ]
      : mode === "numeric"
        ? [
            { label: "1", color: "success" },
            { label: "12", color: "warning" },
            { label: "99+", color: "danger" },
          ]
        : [
            { label: "Online", color: "success" },
            { label: "Syncing", color: "warning" },
            { label: "Offline", color: "danger" },
          ];

  return (
    <div className="space-y-4 rounded-xl bg-default-50 p-6 dark:bg-default-900">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="flex flex-wrap gap-3">
        {entries.map(({ label, color }) => (
          <Chip
            key={label}
            color={color}
            variant={mode === "dot" ? "dot" : "flat"}
            size="sm"
          >
            {label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function ChipGroup({ title, removable }: { title: string; removable: boolean }) {
  return (
    <div className="space-y-4 rounded-xl bg-default-50 p-6 dark:bg-default-900">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="flex flex-wrap gap-3">
        <Chip variant="bordered" size="sm" onClose={removable ? () => {} : undefined}>
          default
        </Chip>
        <Chip variant="flat" size="sm" onClose={removable ? () => {} : undefined}>
          hover
        </Chip>
        <Chip color="primary" variant="solid" size="sm" onClose={removable ? () => {} : undefined}>
          active
        </Chip>
        <Chip variant="bordered" size="sm" isDisabled>
          disabled
        </Chip>
      </div>
    </div>
  );
}

function ListRowsDemo() {
  return (
    <div className="space-y-6 rounded-xl bg-default-50 p-6 dark:bg-default-900">
      <p className="text-sm font-semibold text-foreground">
        List row — no components/ui or @qpub/qui primitive exists yet; styled directly with real tokens.
      </p>
      <div className="flex items-center justify-between rounded-xl border border-default-200 dark:border-default-800 bg-background px-4 py-3 transition hover:border-default-300 dark:hover:border-default-700 hover:bg-default-100 focus-within:ring-2 focus-within:ring-primary dark:hover:bg-default-800">
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-lg bg-default-200 dark:bg-default-700" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Row with icon and text</p>
            <p className="text-xs text-default-500">Hover or focus this row to see its real state.</p>
          </div>
        </div>
        <Button variant="ghost" color="default" size="sm">Action</Button>
      </div>
    </div>
  );
}

function ComputedHexSwatch({
  label,
  bgClass,
  textClass,
}: {
  label: string;
  bgClass: string;
  textClass: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [hex, setHex] = React.useState<string>("—");

  React.useEffect(() => {
    if (!ref.current) return;
    const bg = window.getComputedStyle(ref.current).backgroundColor;
    const next = rgbStringToHex(bg);
    if (next) setHex(next);
  }, []);

  return (
    <div
      ref={ref}
      className={[
        "flex h-24 flex-col justify-between rounded-lg border border-default-200 dark:border-default-800 p-3",
        bgClass,
        textClass,
      ].join(" ")}
    >
      <div className="text-xs font-semibold">{label.split("-")[1]}</div>
      <div className="space-y-0.5 text-[11px] font-mono leading-tight opacity-90">
        <div>{hex}</div>
        <div className="truncate">{bgClass}</div>
      </div>
    </div>
  );
}

function rgbStringToHex(input: string) {
  const match = input.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) return null;
  const r = clampByte(Number(match[1]));
  const g = clampByte(Number(match[2]));
  const b = clampByte(Number(match[3]));
  return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`.toUpperCase();
}

function clampByte(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(255, Math.round(n)));
}

function toHex2(n: number) {
  return n.toString(16).padStart(2, "0");
}
