/** @type {import('tailwindcss').Config} */
export default {
  // Preline needs to scan its own node_modules to generate styles
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/preline/dist/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // The Preline UI plugin
    require("preline/plugin"),
  ],
};
