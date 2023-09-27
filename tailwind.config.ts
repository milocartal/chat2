import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        logo: {
          100:"#F7971D11",
          200:"#F7971D33",
          300:"#F7971D55",
          400:"#F7971D77",
          500:"#F7971D99",
          600:"#F7971Daa",
          700:"#F7971Dcc",
          800:"#F7971D"
        },
        bg: {
          100:"#F0F0F0",
          900:"#202123"
        },
      }
    },
  },
  plugins: [],
} satisfies Config;
