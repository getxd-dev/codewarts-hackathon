import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bayanihan: {
          green: "#e50909",
          blue: "#1f63d8",
          gold: "#f6b23c",
          red: "#c40018",
          leaf: "#8d1b8f",
          ink: "#111111",
          muted: "#646464",
          mist: "#fff7ef",
          border: "#ead8c4",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(17, 17, 17, 0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
