import localFont from "next/font/local";

// Mirrors app/layout.tsx's font loading exactly (same src/weight/variable/
// display/fallback) so Storybook renders with the identical faces the real
// app uses. Paths are relative to this file, resolving to the same
// repo-root fonts/ directory app/layout.tsx points at from app/.
export const nunito = localFont({
  src: "../fonts/Nunito-Variable.ttf",
  weight: "200 1000",
  variable: "--font-nunito",
  display: "swap",
});

export const iranSansXV = localFont({
  src: "../fonts/IRANSansXV.ttf",
  weight: "100 900",
  variable: "--font-iranxv",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
});
