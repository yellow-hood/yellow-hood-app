import type { Decorator, Preview } from "@storybook/nextjs-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../app/globals.css";
import { nunito, iranSansXV } from "./fonts";

// Storybook's iframe has its own <html>/<body> that app/layout.tsx never
// touches, so the font className/variables layout.tsx applies to <body>
// have to be re-applied here on a wrapping div instead. font-fa
// (IRANSansXV) is applied per-story only where dir="rtl", same as the real
// app — never globally here.
// `min-h-screen` only applies in the standalone story canvas (viewMode
// "story") — inside a Docs page (viewMode "docs"), every story is embedded
// inline and full-viewport height would make each one absurdly tall,
// stacking into an unusable page.
const withAppChrome: Decorator = (Story, context) => (
  <div
    className={`${nunito.className} ${nunito.variable} ${iranSansXV.variable} bg-background text-foreground p-6 ${context.viewMode === "docs" ? "" : "min-h-screen"}`}
  >
    <Story />
  </div>
);

const preview: Preview = {
  // Generates a Docs page (with the "Show code" panel) for every story by
  // default — the Epic's "Storybook -> Code Loop" hand-off mechanism to
  // Claude Code relies on this being available for every component, not
  // opted into per-file.
  tags: ["autodocs"],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
  },
  decorators: [
    withAppChrome,
    // Wires Storybook's toolbar theme switcher to the SAME class-based
    // mechanism next-themes uses in app/providers.tsx (attribute="class").
    // parentSelector: "html" matches app/globals.css's `html.dark`-keyed
    // dark tokens, exactly what next-themes sets on document.documentElement
    // at runtime — not a separate hardcoded override.
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "dark",
      parentSelector: "html",
    }),
  ],
};

export default preview;
