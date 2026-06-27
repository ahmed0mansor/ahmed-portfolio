import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-cairo)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0F172A",
        panel: "#111827",
        cyanBrand: "#38BDF8",
        violetBrand: "#8B5CF6",
      },
      boxShadow: {
        glow: "0 0 40px rgba(56, 189, 248, 0.18)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
