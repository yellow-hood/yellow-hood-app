import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFD12D",
        background: {
          dark: "#0D0D0D",
          light: "#FFFFFF",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: "#0D0D0D",
            foreground: "#FFFFFF",
            primary: {
              DEFAULT: "#FFD12D",
              foreground: "#000000",
            },
          },
        },
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#000000",
            primary: {
              DEFAULT: "#FFD12D",
              foreground: "#000000",
            },
          },
        },
      },
    }),
  ],
};
export default config;

