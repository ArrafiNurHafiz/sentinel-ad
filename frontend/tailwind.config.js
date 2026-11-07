/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tactical: {
          dark: "#060d09",
          deeper: "#04120b",
          card: "#0d1e15",
          border: "#1c3b2b",
          accent: "#22c55e", // Military Green
          bright: "#4ade80",
          alert: "#ef4444", // Crimson Danger
          warning: "#f59e0b", // Amber
          gold: "#e8c351", // TNI AD emblem gold
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "spin 8s linear infinite",
      },
    },
  },
  plugins: [],
};
