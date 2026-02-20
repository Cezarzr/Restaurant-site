import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: "#1f5f5b",
        accent: "#f59e0b",
      },
    },
  },
  plugins: [],
};

export default config;
