import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      "2xl": [
        "4.5rem",
        {
          letterSpacing: "-2%",
          fontWeight: "400",
          lineHeight: "5.625rem",
        },
      ],
      xl: [
        "3.75rem",
        {
          letterSpacing: "-2%",
          fontWeight: "400",
          lineHeight: "5.625rem",
        },
      ],
      lg: [
        "3rem",
        {
          letterSpacing: "-2%",
          fontWeight: "400",
          lineHeight: "3.75rem",
        },
      ],
      md: [
        "2.25rem",
        {
          letterSpacing: "-2%",
          fontWeight: "400",
          lineHeight: "2.75rem",
        },
      ],
      sm: [
        "1.875rem",
        {
          letterSpacing: "-2%",
          fontWeight: "400",
          lineHeight: "2.375rem",
        },
      ],
      xs: [
        "1.5rem",
        {
          letterSpacing: "-2%",
          fontWeight: "400",
          lineHeight: "2rem",
        },
      ],
    },
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      borderWidth: {
        1: "1px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // New
        primary: {
          DEFAULT: "#EAAA08",
          900: "#713B12",
          800: "#854A0E",
          700: "#A15C07",
          600: "#CA8504",
          500: "#EAAA08",
          400: "#FAC515",
          300: "#FDE272",
          200: "#FEEE95",
          100: "#FEF7C3",
          50: "#FEFBEB",
          25: "#FEFDF0",
        },
        success: {
          DEFAULT: "#039855",
          900: "#054F31",
          800: "#05603A",
          700: "#027A48",
          600: "#039855",
          500: "#12B76A",
          400: "#32D583",
          300: "#6CE9A6",
          200: "#A6F4C5",
          100: "#D1FADF",
          50: "#ECFDF3",
          25: "#F6FEF9",
        },
        warning: {
          DEFAULT: "#DC6803",
          900: "#7A2E0E",
          800: "#93370D",
          700: "#B54708",
          600: "#DC6803",
          500: "#F79009",
          400: "#FDB022",
          300: "#FEC84B",
          200: "#FEDFB9",
          100: "#FEF0C7",
          50: "#FFFAEB",
          25: "#FFFCF5",
        },
        error: {
          DEFAULT: "#D02010",
          900: "#7A271A",
          800: "#912018",
          700: "#B42318",
          600: "#D02010",
          500: "#F04438",
          400: "#F97066",
          300: "#FDA29B",
          200: "#FECDCA",
          100: "#FEE4E2",
          50: "#FEF3F2",
          25: "#FFFBFA",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
