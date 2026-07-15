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
        lead: ["1.25rem", { lineHeight: "1.4" }],
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
          50:  "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
        // Secondary (Purple) — DEFAULT driven by CSS var
        secondary: {
          50:  "var(--secondary-50)",
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          300: "var(--secondary-300)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          700: "var(--secondary-700)",
          800: "var(--secondary-800)",
          900: "var(--secondary-900)",
        },
        // Tertiary (Blue) — numbered scale only, dark-mode aware via CSS var in globals.css
        tertiary: {
          50:  "var(--tertiary-50)",
          100: "var(--tertiary-100)",
          200: "var(--tertiary-200)",
          300: "var(--tertiary-300)",
          400: "var(--tertiary-400)",
          500: "var(--tertiary-500)",
          600: "var(--tertiary-600)",
          700: "var(--tertiary-700)",
          800: "var(--tertiary-800)",
          900: "var(--tertiary-900)",
        },
        // Warning (Orange) — DEFAULT driven by CSS var
        warning: {
          50:  "var(--warning-50)",
          100: "var(--warning-100)",
          200: "var(--warning-200)",
          300: "var(--warning-300)",
          400: "var(--warning-400)",
          500: "var(--warning-500)",
          600: "var(--warning-600)",
          700: "var(--warning-700)",
          800: "var(--warning-800)",
          900: "var(--warning-900)",
        },
        // Danger (Pink/Red) — DEFAULT driven by CSS var
        danger: {
          50:  "var(--danger-50)",
          100: "var(--danger-100)",
          200: "var(--danger-200)",
          300: "var(--danger-300)",
          400: "var(--danger-400)",
          500: "var(--danger-500)",
          600: "var(--danger-600)",
          700: "var(--danger-700)",
          800: "var(--danger-800)",
          900: "var(--danger-900)",
        },
        // Success (Green) — DEFAULT driven by CSS var
        success: {
          50:  "var(--success-50)",
          100: "var(--success-100)",
          200: "var(--success-200)",
          300: "var(--success-300)",
          400: "var(--success-400)",
          500: "var(--success-500)",
          600: "var(--success-600)",
          700: "var(--success-700)",
          800: "var(--success-800)",
          900: "var(--success-900)",
        },
        // Default (Zinc) — 50-900 numbered scale is intentionally flat/same in both
        // themes; DEFAULT/foreground are theme-aware via CSS vars in globals.css
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
          DEFAULT: "var(--default)",
          foreground: "var(--default-foreground)",
        },
        // Divider — theme-aware via --divider CSS variable in globals.css (referenced as border-divider)
        divider: "oklch(var(--divider) / <alpha-value>)",
        // AnimatedButton dedicated face/wall colors — theme-aware via CSS variables in globals.css, decoupled from the numbered scale
        "animated-primary-face": "var(--animated-primary-face)",
        "animated-primary-wall": "var(--animated-primary-wall)",
        "animated-secondary-face": "var(--animated-secondary-face)",
        "animated-secondary-wall": "var(--animated-secondary-wall)",
        "animated-default-face": "var(--animated-default-face)",
        "animated-default-wall": "var(--animated-default-wall)",
        "animated-primary-face-hover": "var(--animated-primary-face-hover)",
        "animated-secondary-face-hover": "var(--animated-secondary-face-hover)",
        "animated-default-face-hover": "var(--animated-default-face-hover)",
      },
    },
  },
  darkMode: "class",
};

export default config;
