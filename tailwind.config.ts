import type { Config } from "tailwindcss";
import TailwindCSSAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/section/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layout/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      "2xl": ["4.5rem", { lineHeight: "5.625rem" }],
      xl: ["3.75rem", { lineHeight: "4.5rem" }],
      lg: ["1.875rem", { lineHeight: "2.375rem" }],
      subtitle: ["1.2rem", { lineHeight: "1.875rem" }],
      md: ["1rem", { lineHeight: "1.5rem" }],
      sm: ["0.875rem", { lineHeight: "0.055rem" }],
      xs: ["0.75rem", { lineHeight: "2rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      label: ["0.875rem", { lineHeight: "1.125rem" }],
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
        "1": "1px",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          body: "hsl(var(--foregroundBody))",
          label: "hsl(var(--foregroundLabel))",
        },
        primary: {
          "25": "#FEFDF0",
          "50": "#FEFBEB",
          "100": "#FEF7C3",
          "200": "#FEEE95",
          "300": "#FDE272",
          "400": "#FAC515",
          "500": "#EAAA08",
          "600": "#CA8504",
          "700": "#A15C07",
          "800": "#854A0E",
          "900": "#713B12",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        success: {
          "25": "#F6FEF9",
          "50": "#ECFDF3",
          "100": "#D1FADF",
          "200": "#A6F4C5",
          "300": "#6CE9A6",
          "400": "#32D583",
          "500": "#12B76A",
          "600": "#039855",
          "700": "#027A48",
          "800": "#05603A",
          "900": "#054F31",
          DEFAULT: "#039855",
        },
        warning: {
          "25": "#FFFCF5",
          "50": "#FFFAEB",
          "100": "#FEF0C7",
          "200": "#FEDFB9",
          "300": "#FEC84B",
          "400": "#FDB022",
          "500": "#F79009",
          "600": "#DC6803",
          "700": "#B54708",
          "800": "#93370D",
          "900": "#7A2E0E",
          DEFAULT: "#DC6803",
        },
        error: {
          "25": "#FFFBFA",
          "50": "#FEF3F2",
          "100": "#FEE4E2",
          "200": "#FECDCA",
          "300": "#FDA29B",
          "400": "#F97066",
          "500": "#F04438",
          "600": "#D02010",
          "700": "#B42318",
          "800": "#912018",
          "900": "#7A271A",
          DEFAULT: "#D02010",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    TailwindCSSAnimate,
    function ({
      addVariant,
    }: {
      addVariant: (props: string, props2: string) => void;
    }) {
      addVariant?.("child", "& > *");
      addVariant?.("child-hover", "& > *:hover");
    },
  ],
} satisfies Config;
