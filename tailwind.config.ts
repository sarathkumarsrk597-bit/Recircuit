import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        circuit: {
          ink: "#10202b",
          muted: "#5c7180",
          line: "#dbe7ec",
          blue: "#0d8bd3",
          green: "#0fa66b",
          pale: "#eef9f5"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(16, 32, 43, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
