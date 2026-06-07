/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Card, CardBody, Chip, Divider, Spinner } from "@nextui-org/react";

const CONTROL_RADIUS_CLASS = "rounded-button-lg";
const DOC_CARD_CLASS =
  "mx-auto w-full border border-default-200 bg-background/70 backdrop-blur";

const YELLOW_SWATCHES = [
  { step: 50, bgClass: "bg-yellow-50" },
  { step: 100, bgClass: "bg-yellow-100" },
  { step: 200, bgClass: "bg-yellow-200" },
  { step: 300, bgClass: "bg-yellow-300" },
  { step: 400, bgClass: "bg-yellow-400" },
  { step: 500, bgClass: "bg-yellow-500" },
  { step: 600, bgClass: "bg-yellow-600" },
  { step: 700, bgClass: "bg-yellow-700" },
  { step: 800, bgClass: "bg-yellow-800" },
  { step: 900, bgClass: "bg-yellow-900" },
  { step: 950, bgClass: "bg-yellow-950" },
] as const;

const ZINC_SWATCHES = [
  { step: 50, bgClass: "bg-zinc-50" },
  { step: 100, bgClass: "bg-zinc-100" },
  { step: 200, bgClass: "bg-zinc-200" },
  { step: 300, bgClass: "bg-zinc-300" },
  { step: 400, bgClass: "bg-zinc-400" },
  { step: 500, bgClass: "bg-zinc-500" },
  { step: 600, bgClass: "bg-zinc-600" },
  { step: 700, bgClass: "bg-zinc-700" },
  { step: 800, bgClass: "bg-zinc-800" },
  { step: 900, bgClass: "bg-zinc-900" },
  { step: 950, bgClass: "bg-zinc-950" },
] as const;

const SEMANTIC_TOKENS = [
  {
    name: "Success",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    border: "border-emerald-300 dark:border-emerald-700",
    text: "text-emerald-800 dark:text-emerald-300",
  },
  {
    name: "Warning",
    bg: "bg-amber-100 dark:bg-amber-900/40",
    border: "border-amber-300 dark:border-amber-700",
    text: "text-amber-800 dark:text-amber-300",
  },
  {
    name: "Error",
    bg: "bg-red-100 dark:bg-red-900/40",
    border: "border-red-300 dark:border-red-700",
    text: "text-red-800 dark:text-red-300",
  },
  {
    name: "Info",
    bg: "bg-sky-100 dark:bg-sky-900/40",
    border: "border-sky-300 dark:border-sky-700",
    text: "text-sky-800 dark:text-sky-300",
  },
] as const;

const SURFACE_TOKENS = [
  {
    name: "bg-surface",
    className: "bg-background",
    description: "Primary layout background",
  },
  {
    name: "bg-elevated",
    className: "bg-zinc-50 dark:bg-zinc-900",
    description: "Cards and raised containers",
  },
  {
    name: "bg-subtle",
    className: "bg-zinc-100 dark:bg-zinc-800",
    description: "Nested groups and quiet emphasis",
  },
] as const;

type UsageGuidance = {
  use: string;
  avoid: string;
  mistakes: string;
};

export default function DesignSystemPage() {
  const isProd = process.env.NODE_ENV === "production";

  return (
    <main className="min-h-screen bg-background px-6 py-24 font-nunito text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20">
        <header className="flex w-full max-w-5xl flex-col gap-8 border-b border-default-200 pb-12">
          <div className="space-y-6">
            <p className="text-xs font-label uppercase tracking-[0.08em] text-text-secondary">
              Documentation
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Yellow Hood Design System
            </h1>
            <p className="max-w-3xl text-lead font-light text-text-secondary">
              Canonical reference for tokens, components, states, and usage patterns.
              Treat this as the source of truth for visual and interaction decisions.
            </p>
          </div>

          <nav className="flex flex-wrap gap-3 text-xs md:text-sm">
            <NavPill href="#typography">Typography</NavPill>
            <NavPill href="#colors">Colors</NavPill>
            <NavPill href="#spacing-radius">Spacing & Radius</NavPill>
            <NavPill href="#buttons">Buttons</NavPill>
            <NavPill href="#inputs">Inputs</NavPill>
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
            description="Nunito is the only typeface. Keep hierarchy clear through weight and spacing before adding extra visual chrome."
          />
          <DocCard>
            <div className="space-y-8">
              <TypographySample
                label="H1 / Page title"
                titleClass="text-4xl font-black tracking-tight md:text-5xl"
                titleText="The quick brown fox jumps over the lazy dog"
                description="Reserved for one primary title per page."
              />
              <Divider className="bg-default-100" />
              <TypographySample
                label="H2 / Section title"
                titleClass="text-2xl font-bold md:text-3xl"
                titleText="The quick brown fox jumps over the lazy dog"
                description="Use for major content groups and section starts."
              />
              <Divider className="bg-default-100" />
              <TypographySample
                label="Lead / Intro copy"
                titleClass="text-lead font-light text-text-secondary"
                titleText="Lead copy gives framing context and helps users scan content quickly."
                description="Keep it short and avoid putting actions inside lead text."
              />
              <Divider className="bg-default-100" />
              <TypographySample
                label="Body / Default copy"
                titleClass="text-base leading-relaxed text-foreground"
                titleText="Body text handles instructions, supporting details, and guidance."
                description="Prefer complete sentences with concise structure."
              />
              <Divider className="bg-default-100" />
              <TypographySample
                label="Label / Forms and controls"
                titleClass="text-xs font-label text-foreground"
                titleText="Email address"
                description="Keep labels specific and use sentence case."
              />
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
            description="Color is token-first: scales support design decisions, semantic tokens communicate intent, and surfaces establish depth."
          />
          <DocCard>
            <div className="space-y-10">
              <div className="space-y-6">
                <SubgroupHeader
                  title="Core scales"
                  description="Yellow and zinc scales are canonical references for brand and neutrals."
                />
                <ColorScaleGrid title="Yellow (Brand)" scale="yellow" swatches={YELLOW_SWATCHES} />
                <ColorScaleGrid title="Zinc (Neutral)" scale="zinc" swatches={ZINC_SWATCHES} />
              </div>

              <Divider className="bg-default-100" />

              <div className="space-y-6">
                <SubgroupHeader
                  title="Semantic tokens"
                  description="Each semantic family defines background, text, and border usage."
                />
                <div className="grid gap-6 md:grid-cols-2">
                  {SEMANTIC_TOKENS.map((token) => (
                    <SemanticTokenPreview key={token.name} token={token} />
                  ))}
                </div>
              </div>

              <Divider className="bg-default-100" />

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
            description="Layout rhythm is built on 8pt increments, with 24px and 32px spacing driving section and block separation."
          />
          <DocCard>
            <div className="grid gap-10 md:grid-cols-2">
              <div className="space-y-6">
                <SubgroupHeader
                  title="Spacing tokens"
                  description="Prefer `space-6` and `space-8` between major groups to keep hierarchy readable."
                />
                <div className="grid grid-cols-3 gap-4 text-xs">
                  {[
                    { label: "4px", token: "space-1" },
                    { label: "8px", token: "space-2" },
                    { label: "12px", token: "space-3" },
                    { label: "16px", token: "space-4" },
                    { label: "24px", token: "space-6" },
                    { label: "32px", token: "space-8" },
                    { label: "40px", token: "space-10" },
                    { label: "48px", token: "space-12" },
                    { label: "64px", token: "space-16" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="space-y-2 rounded-lg border border-default-200 bg-zinc-50 p-4 dark:bg-zinc-900"
                    >
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-[11px] text-text-secondary">{item.token}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <SubgroupHeader
                  title="Radius tokens"
                  description="All controls share `rounded-button-lg`; supporting surfaces can use smaller radius values."
                />
                <div className="space-y-4 text-xs">
                  <RadiusRow name="SM" className="rounded-md" token="rounded-md" />
                  <RadiusRow name="MD" className="rounded-lg" token="rounded-lg" />
                  <RadiusRow
                    name="LG (Controls)"
                    className={CONTROL_RADIUS_CLASS}
                    token="rounded-button-lg"
                    highlight
                  />
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
            description="Button hierarchy: Primary for main action, Secondary for alternatives, Ghost for low emphasis, and Danger for destructive actions."
          />
          <DocCard>
            <div className="space-y-10">
              <SubgroupHeader
                title="Text buttons by hierarchy"
                description="All variants expose default, hover, focus, active, disabled, and loading previews."
              />
              <ButtonMatrix variant="primary" title="Primary" />
              <ButtonMatrix variant="secondary" title="Secondary" />
              <ButtonMatrix variant="ghost" title="Ghost / Tertiary" />
              <ButtonMatrix variant="danger" title="Danger" />

              <Divider className="bg-default-100" />

              <div className="space-y-6">
                <SubgroupHeader
                  title="Icon combinations"
                  description="Use icon + text for clearer intent; reserve icon-only buttons for well-known actions."
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
                    <p className="text-xs font-semibold text-text-secondary">Icon + text</p>
                    <div className="flex flex-wrap gap-4">
                      <DSButton variant="primary" size="md" state="default" icon="leading">
                        Create report
                      </DSButton>
                      <DSButton variant="secondary" size="md" state="hover" icon="leading">
                        Save draft
                      </DSButton>
                    </div>
                  </div>
                  <div className="space-y-4 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
                    <p className="text-xs font-semibold text-text-secondary">Icon-only</p>
                    <div className="flex flex-wrap gap-4">
                      <DSButton variant="ghost" size="md" state="focus" iconOnly ariaLabel="Search" />
                      <DSButton variant="danger" size="md" state="active" iconOnly ariaLabel="Delete" />
                      <DSButton variant="primary" size="md" state="disabled" iconOnly ariaLabel="Share" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DocCard>
          <UsageBlock
            guidance={{
              use: "Place one primary action per region, with secondary/ghost actions for alternatives.",
              avoid: "Using danger styling for non-destructive operations.",
              mistakes: "Adding multiple primaries in one group or hiding critical actions in icon-only buttons.",
            }}
          />
        </section>

        <section id="inputs" className="w-full max-w-5xl space-y-8">
          <SectionHeader
            title="Inputs"
            description="Inputs share the button radius token and provide explicit feedback for focus, success, error, disabled, and loading states."
          />
          <DocCard>
            <div className="space-y-10">
              <SubgroupHeader
                title="Text input states"
                description="Helper text supports guidance; error text should explain how to recover."
              />
              <div className="grid gap-8 md:grid-cols-2">
                <DSInput title="Default + helper" label="Full name" placeholder="Enter your name" state="default" hint="Use your legal first and last name." />
                <DSInput title="Focus" label="Project title" placeholder="Quarterly goals" state="focus" hint="This field is ready for entry." />
                <DSInput title="Success" label="Email" placeholder="name@example.com" state="success" hint="Email looks valid." />
                <DSInput title="Error" label="Password" placeholder="••••••••" state="error" hint="Password must be at least 8 characters." />
                <DSInput title="Disabled" label="Role" placeholder="Owner" state="disabled" hint="Managed by organization policy." />
                <DSInput title="Loading" label="Search" placeholder="Looking up data…" state="loading" hint="Fetching recommendations..." />
              </div>

              <Divider className="bg-default-100" />

              <div className="grid gap-8 md:grid-cols-2">
                <DSTextarea />
                <DSSelect />
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
                <div className="grid gap-6 md:grid-cols-3">
                  <BadgeGroup title="Status" mode="status" />
                  <BadgeGroup title="Numeric" mode="numeric" />
                  <BadgeGroup title="Dot" mode="dot" />
                </div>
              </div>

              <Divider className="bg-default-100" />

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
                <SubgroupHeader title="Avatars" description="Sizes and fallback initials for missing images." />
                <div className="flex flex-wrap items-end gap-8">
                  <DSAvatar size="sm" initials="YH" />
                  <DSAvatar size="md" initials="KM" />
                  <DSAvatar size="lg" initials="AN" />
                  <DSAvatar size="xl" initials="FH" />
                </div>
              </div>

              <Divider className="bg-default-100" />

              <div className="space-y-6">
                <SubgroupHeader
                  title="Card variants"
                  description="Default, interactive, and elevated variants with explicit hover/focus/active handling."
                />
                <div className="grid gap-6 md:grid-cols-3">
                  <DSCardPreview variant="default" />
                  <DSCardPreview variant="interactive" />
                  <DSCardPreview variant="elevated" />
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
                <SubgroupHeader title="Alerts / Toasts" description="Semantic tone variants for success, info, warning, and error." />
                <div className="space-y-4">
                  {SEMANTIC_TOKENS.map((token) => (
                    <DSAlert key={token.name} token={token} />
                  ))}
                </div>
              </div>

              <Divider className="bg-default-100" />

              <div className="grid gap-8 md:grid-cols-2">
                <DSTabs />
                <DSListRows />
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
      <p className="max-w-3xl text-sm text-text-secondary">{description}</p>
    </div>
  );
}

function SubgroupHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-label uppercase tracking-[0.08em] text-text-secondary">
        {title}
      </p>
      <p className="max-w-3xl text-sm text-text-secondary">{description}</p>
    </div>
  );
}

function UsageBlock({ guidance }: { guidance: UsageGuidance }) {
  return (
    <div className="space-y-4 rounded-xl border border-default-200 bg-zinc-50 p-6 dark:bg-zinc-900">
      <p className="text-sm font-semibold text-foreground">Usage</p>
      <div className="grid gap-3 text-sm text-text-secondary md:grid-cols-3">
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
      <CardBody className="space-y-8 p-8 md:p-10">{children}</CardBody>
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
      <p className="text-xs font-semibold text-text-secondary">{label}</p>
      <p className={titleClass}>{titleText}</p>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  );
}

type NavPillProps = { href: string; children: React.ReactNode };

function NavPill({ href, children }: NavPillProps) {
  return (
    <a
      href={href}
      className="rounded-full bg-default-100 px-4 py-2 text-xs font-medium text-text-secondary transition hover:bg-default-200"
    >
      {children}
    </a>
  );
}

type ColorScale = "yellow" | "zinc";

function ColorScaleGrid({
  title,
  scale,
  swatches,
}: {
  title: string;
  scale: ColorScale;
  swatches: readonly { step: number; bgClass: string }[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-text-secondary">
          {scale === "yellow" ? "bg-yellow-{step}" : "bg-zinc-{step}"}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {swatches.map(({ step, bgClass }) => {
          const textClass =
            scale === "zinc" ? (step >= 600 ? "text-white" : "text-black") : step >= 700 ? "text-white" : "text-black";
          return (
            <ComputedHexSwatch
              key={`${scale}-${step}`}
              label={`${scale}-${step}`}
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
    <div className="space-y-4 rounded-xl border border-default-200 bg-background p-6">
      <p className="text-sm font-semibold text-foreground">{token.name}</p>
      <div className={`space-y-3 rounded-lg border p-4 ${token.bg} ${token.border} ${token.text}`}>
        <p className="text-xs font-semibold">Token usage preview</p>
        <p className="text-sm">Status copy uses semantic text color.</p>
      </div>
      <div className="space-y-1 text-xs text-text-secondary">
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
    <div className="space-y-4 rounded-xl border border-default-200 bg-background p-6">
      <p className="text-sm font-semibold text-foreground">{surface.name}</p>
      <div className={`h-24 rounded-lg border border-default-200 ${surface.className}`} />
      <p className="text-xs text-text-secondary">{surface.description}</p>
      <p className="text-xs font-mono text-text-secondary">{surface.className}</p>
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
  return (
    <div className="flex items-center gap-4">
      <div className={`h-10 w-20 border border-default-200 bg-default-100 ${className}`} />
      <div className="space-y-1 text-xs">
        <p className={highlight ? "font-semibold text-secondary" : "font-semibold text-foreground"}>{name}</p>
        <p className="font-mono text-text-secondary">{token}</p>
      </div>
    </div>
  );
}

type DSButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type DSButtonSize = "sm" | "md" | "lg";
type DSButtonState = "default" | "hover" | "focus" | "active" | "disabled" | "loading";

function ButtonMatrix({ title, variant }: { title: string; variant: DSButtonVariant }) {
  const states: { key: DSButtonState; label: string }[] = [
    { key: "default", label: "Default" },
    { key: "hover", label: "Hover" },
    { key: "focus", label: "Focus" },
    { key: "active", label: "Active" },
    { key: "disabled", label: "Disabled" },
    { key: "loading", label: "Loading" },
  ];
  const sizes: DSButtonSize[] = ["sm", "md", "lg"];

  return (
    <div className="space-y-6">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="grid gap-4">
        {states.map((state) => (
          <div key={`${title}-${state.key}`} className="grid gap-3 md:grid-cols-4 md:items-center">
            <p className="text-xs font-semibold text-text-secondary">{state.label}</p>
            {sizes.map((size) => (
              <DSButton key={`${title}-${state.key}-${size}`} variant={variant} size={size} state={state.key}>
                {title}
              </DSButton>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function DSButton({
  variant,
  size,
  state,
  children,
  icon,
  iconOnly,
  ariaLabel,
}: {
  variant: DSButtonVariant;
  size: DSButtonSize;
  state: DSButtonState;
  children?: React.ReactNode;
  icon?: "leading";
  iconOnly?: boolean;
  ariaLabel?: string;
}) {
  const baseByVariant: Record<DSButtonVariant, string> = {
    primary: "bg-primary text-background border border-primary",
    secondary: "bg-secondary text-black border border-secondary",
    ghost: "bg-transparent text-foreground border border-default-300",
    danger: "bg-red-600 text-white border border-red-600",
  };
  const ringByVariant: Record<DSButtonVariant, string> = {
    primary: "ring-primary",
    secondary: "ring-secondary",
    ghost: "ring-zinc-500",
    danger: "ring-red-500",
  };

  const sizeClass = size === "sm" ? "h-9 px-4 text-sm" : size === "md" ? "h-10 px-5 text-sm" : "h-12 px-6 text-base";
  const iconOnlySizeClass = size === "sm" ? "h-9 w-9" : size === "md" ? "h-10 w-10" : "h-12 w-12";

  const stateClass =
    state === "hover"
      ? "brightness-95"
      : state === "focus"
        ? `ring-2 ring-offset-2 ring-offset-background ${ringByVariant[variant]}`
        : state === "active"
          ? "scale-[0.98] brightness-90"
          : "";

  const isDisabled = state === "disabled" || state === "loading";

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center justify-center gap-2 transition",
        CONTROL_RADIUS_CLASS,
        iconOnly ? iconOnlySizeClass : `${sizeClass} w-full`,
        "font-label shadow-sm",
        baseByVariant[variant],
        stateClass,
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:border-zinc-300 disabled:bg-zinc-200 disabled:text-zinc-500 dark:disabled:border-zinc-700 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500",
      ].join(" ")}
    >
      {(iconOnly || icon === "leading") && <span className="h-3.5 w-3.5 rounded-full bg-current/70" />}
      {state === "loading" && <Spinner size="sm" className="text-current" />}
      {!iconOnly && children}
    </button>
  );
}

type DSInputState = "default" | "focus" | "success" | "error" | "disabled" | "loading";

function DSInput({
  title,
  label,
  placeholder,
  hint,
  state,
}: {
  title: string;
  label: string;
  placeholder: string;
  hint?: string;
  state: DSInputState;
}) {
  const id = React.useId();
  const stateClass =
    state === "error"
      ? "border-red-500 ring-1 ring-red-500"
      : state === "success"
        ? "border-emerald-500 ring-1 ring-emerald-500"
        : state === "focus"
          ? "border-primary ring-2 ring-primary/60"
          : "border-zinc-200 dark:border-zinc-800";

  return (
    <div className="space-y-4 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
      <p className="text-xs font-semibold text-text-secondary">{title}</p>
      <div className="space-y-2">
        <label htmlFor={id} className="block text-xs font-label text-foreground">{label}</label>
        <div className={["flex h-12 items-center gap-3 border bg-background px-4", CONTROL_RADIUS_CLASS, stateClass].join(" ")}>
          <input
            id={id}
            disabled={state === "disabled" || state === "loading"}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-text-disabled focus:outline-none disabled:cursor-not-allowed"
          />
          {state === "loading" && <Spinner size="sm" className="text-text-secondary" />}
        </div>
      </div>
      {state === "error" && <p className="text-xs text-red-600 dark:text-red-400">{hint}</p>}
      {state === "success" && <p className="text-xs text-emerald-600 dark:text-emerald-400">{hint}</p>}
      {(state === "default" || state === "focus" || state === "disabled" || state === "loading") && hint && (
        <p className="text-xs text-text-secondary">{hint}</p>
      )}
    </div>
  );
}

function DSTextarea() {
  return (
    <div className="space-y-4 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
      <p className="text-xs font-semibold text-text-secondary">Textarea</p>
      <label className="text-xs font-label text-foreground">Description</label>
      <div className={`border border-zinc-200 bg-background p-4 ring-2 ring-primary/50 dark:border-zinc-800 ${CONTROL_RADIUS_CLASS}`}>
        <textarea
          rows={4}
          defaultValue="This control supports multiline content and follows input focus behavior."
          className="w-full resize-none bg-transparent text-sm text-foreground focus:outline-none"
        />
      </div>
      <p className="text-xs text-text-secondary">Use for longer input. Avoid for short values.</p>
    </div>
  );
}

function DSSelect() {
  return (
    <div className="space-y-4 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
      <p className="text-xs font-semibold text-text-secondary">Select</p>
      <label className="text-xs font-label text-foreground">Role</label>
      <div className={`flex h-12 items-center justify-between border border-zinc-200 bg-background px-4 ring-1 ring-zinc-300 dark:border-zinc-800 dark:ring-zinc-700 ${CONTROL_RADIUS_CLASS}`}>
        <span className="text-sm text-foreground">Editor</span>
        <span className="h-2 w-2 rotate-45 border-b border-r border-current text-text-secondary" />
      </div>
      <p className="text-xs text-text-secondary">Use select for constrained options and stable value lists.</p>
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
    <div className="space-y-4 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
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
    <div className="space-y-4 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
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

function DSAvatar({ size, initials }: { size: "sm" | "md" | "lg" | "xl"; initials: string }) {
  const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : size === "md" ? "h-10 w-10 text-sm" : size === "lg" ? "h-14 w-14 text-base" : "h-16 w-16 text-lg";
  return (
    <div className="space-y-2 text-center">
      <div className={`inline-flex items-center justify-center rounded-full border border-default-300 bg-zinc-100 font-label text-foreground dark:bg-zinc-800 ${sizeClass}`}>
        {initials}
      </div>
      <p className="text-xs text-text-secondary">{size.toUpperCase()}</p>
    </div>
  );
}

function DSCardPreview({ variant }: { variant: "default" | "interactive" | "elevated" }) {
  const classByVariant: Record<typeof variant, string> = {
    default: "border border-default-200 bg-background",
    interactive: "border border-default-200 bg-background ring-2 ring-primary/40",
    elevated: "border border-default-200 bg-zinc-50 shadow-md dark:bg-zinc-900",
  };
  return (
    <article className={`space-y-4 rounded-xl p-6 transition ${classByVariant[variant]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-secondary">{variant}</p>
      <h3 className="text-base font-semibold text-foreground">Card title</h3>
      <p className="text-sm text-text-secondary">
        {variant === "interactive"
          ? "Interactive cards must support hover, focus, and pressed states."
          : "Use tokenized surfaces and spacing to separate card content."}
      </p>
      <DSButton variant={variant === "default" ? "secondary" : "primary"} size="sm" state={variant === "interactive" ? "active" : "default"}>
        Open details
      </DSButton>
    </article>
  );
}

function DSAlert({ token }: { token: (typeof SEMANTIC_TOKENS)[number] }) {
  return (
    <div className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3 ${token.bg} ${token.border}`}>
      <div className="space-y-1">
        <p className={`text-sm font-semibold ${token.text}`}>{token.name} notification</p>
        <p className={`text-xs ${token.text}`}>This is a {token.name.toLowerCase()} alert/toast message preview.</p>
      </div>
      <button type="button" className={`text-xs font-semibold ${token.text}`}>Dismiss</button>
    </div>
  );
}

function DSTabs() {
  return (
    <div className="space-y-6 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
      <p className="text-sm font-semibold text-foreground">Tabs</p>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button type="button" className={`border border-default-300 bg-background px-4 py-2 text-sm text-foreground ${CONTROL_RADIUS_CLASS}`}>Overview</button>
          <button type="button" className={`border border-primary bg-primary text-background px-4 py-2 text-sm ring-2 ring-primary/50 ${CONTROL_RADIUS_CLASS}`}>Activity</button>
          <button type="button" disabled className={`cursor-not-allowed border border-zinc-300 bg-zinc-200 px-4 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 ${CONTROL_RADIUS_CLASS}`}>Billing</button>
        </div>
        <p className="text-xs text-text-secondary">Active tab uses semantic primary token and visible focus ring.</p>
      </div>
    </div>
  );
}

function DSListRows() {
  const states = [
    { label: "Default", className: "border-default-200 bg-background" },
    { label: "Hover", className: "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800" },
    { label: "Active", className: "border-primary bg-primary/10 ring-1 ring-primary/50" },
  ];

  return (
    <div className="space-y-6 rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
      <p className="text-sm font-semibold text-foreground">List rows</p>
      <div className="space-y-3">
        {states.map((state) => (
          <div key={state.label} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${state.className}`}>
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">Row with icon and text</p>
                <p className="text-xs text-text-secondary">{state.label} state preview</p>
              </div>
            </div>
            <DSButton variant="ghost" size="sm" state={state.label === "Active" ? "active" : "default"}>
              Action
            </DSButton>
          </div>
        ))}
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
        "flex h-24 flex-col justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-800",
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