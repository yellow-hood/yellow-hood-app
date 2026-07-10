import type { Config } from "tailwindcss";
import quiPreset from "@qpub/qui/tailwind-preset";

const config: Config = {
  presets: [quiPreset],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@qpub/qui/dist/**/*.{js,mjs}",
  ],
  theme: {
    // 8pt grid spacing scale (all tokens are multiples of 4px).
    spacing: {
      0: "0px",
      1: "0.25rem",
      2: "0.5rem",
      3: "0.75rem",
      4: "1rem",
      5: "1.25rem",
      6: "1.5rem",
      7: "1.75rem",
      8: "2rem",
      9: "2.25rem",
      10: "2.5rem",
      11: "2.75rem",
      12: "3rem",
      14: "3.5rem",
      16: "4rem",
      20: "5rem",
      24: "6rem",
      28: "7rem",
      32: "8rem",
      36: "9rem",
      40: "10rem",
      44: "11rem",
      48: "12rem",
      52: "13rem",
      56: "14rem",
      60: "15rem",
      64: "16rem",
      72: "18rem",
      80: "20rem",
      96: "24rem",
    },
    extend: {
      fontFamily: {
        nunito: ["var(--font-nunito)"],
        iranxv: ["var(--font-iranxv)"],
        sans: ["var(--font-nunito)", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      fontSize: {
        lead: ["1.25rem", { lineHeight: "1.6" }],
        subtitle: ["1.5rem", { lineHeight: "2rem" }],
      },
      // Yellow Hood Design System radius tokens
      borderRadius: {
        small: "8px",
        medium: "12px",
        large: "14px",
      },
      // Yellow Hood Design System border-width tokens
      borderWidth: {
        small: "1px",
        medium: "1.5px",
        large: "3px",
      },
      colors: {
        // Primary (Yellow) — DEFAULT driven by --primary CSS var in globals.css
        primary: {
          50:  "#FFFAEB",
          100: "#FEF0C7",
          200: "#FEE089",
          300: "#FDCA4C",
          400: "#FDB933",
          500: "#F9AA1A",
          600: "#E48D09",
          700: "#C97106",
          800: "#9D5508",
          900: "#5C2F00",
        },
        // Secondary (Purple) — DEFAULT driven by CSS var
        secondary: {
          50:  "#F5EEFF",
          100: "#EBDCFF",
          200: "#E1CBFF",
          300: "#D7BBFF",
          400: "#CDA9FF",
          500: "#CF6AFF",
          600: "#B958E6",
          700: "#A64DCC",
          800: "#8C3EAF",
          900: "#672A7E",
        },
        // Warning (Orange) — DEFAULT driven by CSS var
        warning: {
          50:  "#FFF3EE",
          100: "#FFEAD9",
          200: "#FFCAA5",
          300: "#FF8F5B",
          400: "#FF844B",
          500: "#FF7332",
          600: "#E6672E",
          700: "#CC5B29",
          800: "#B34F24",
          900: "#803211",
        },
        // Danger (Pink/Red) — DEFAULT driven by CSS var
        danger: {
          50:  "#FEE7EF",
          100: "#FDD0DF",
          200: "#FAA0BF",
          300: "#F871A0",
          400: "#F54180",
          500: "#F31260",
          600: "#C20E4D",
          700: "#920B3A",
          800: "#610726",
          900: "#310413",
        },
        // Success (Green) — DEFAULT driven by CSS var
        success: {
          50:  "#E8FAF0",
          100: "#D1F4E0",
          200: "#A2E9C1",
          300: "#74DFA2",
          400: "#45D483",
          500: "#17C964",
          600: "#12A150",
          700: "#0E793C",
          800: "#095028",
          900: "#052814",
        },
        // Default (Zinc) — same scale in both light and dark
        default: {
          50:  "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
          DEFAULT: "#E4E4E7",
        },
        // Divider — theme-aware via --divider CSS variable in globals.css (referenced as border-divider)
        divider: "oklch(var(--divider) / <alpha-value>)",
      },
    },
  },
  darkMode: "class",
};

export default config;
