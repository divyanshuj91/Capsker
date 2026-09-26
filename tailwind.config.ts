import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: "var(--bg-main, #FFFDF5)",
        surface: "var(--surface, #FFFFFF)",
        borderBlack: "var(--border-black, #000000)",
        neo: {
          yellow: "#FFE800",
          pink: "#FF66C4",
          green: "#00F084",
          blue: "#38BDF8",
          purple: "#A78BFA",
          orange: "#FB923C",
        },
        textPrimary: "#000000",
        textMuted: "#4B5563",
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #000000",
        "brutal-sm": "2px 2px 0px 0px #000000",
        "brutal-lg": "6px 6px 0px 0px #000000",
        "brutal-xl": "8px 8px 0px 0px #000000",
      },
      borderWidth: {
        brutal: "2px",
        "brutal-thick": "3px",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
