import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // This line allows Tailwind to scan HeroUI's internal components
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class", // HeroUI uses class-based dark mode
  plugins: [
    heroui(), // Initialize the plugin
  ],
};
