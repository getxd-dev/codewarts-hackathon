import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bayanihan: {
          green: "#0f766e",
          blue: "#2563eb",
          gold: "#f59e0b",
          red: "#dc2626",
          leaf: "#16a34a",
          ink: "#102026",
          muted: "#52646c",
          mist: "#f6faf8",
          border: "#d9e7e1",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(16, 32, 38, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
