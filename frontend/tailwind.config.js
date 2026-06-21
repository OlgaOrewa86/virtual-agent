/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        slideUp: {
          "0%": { transform: "translateY(6px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 }
        }
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease-out",
        slideUp: "slideUp 0.25s ease-out",
        scaleIn: "scaleIn 0.25s ease-out"
      }
    }
  },
  plugins: [require("@tailwindcss/line-clamp")]
};

export default config;

