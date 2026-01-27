// hero.ts
import { heroui } from "@heroui/react";

export default heroui({
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: "#6C5CE7", // Primary Purple - Brand identity, active states
        secondary: "#FF9F43", // Secondary Orange - CTAs, Highlights, Accents
        success: "#1EDB60", // Success Green - Health indicators, Checkmarks
        background: "#F4F7F6", // Main app background
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        laca: ["Laca Black", "sans-serif"],
      },
    },
  },
});
