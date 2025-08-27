const {heroui} = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "node_modules/@heroui/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(avatar|card|listbox|navbar|pagination|spacer|toggle|toast|ripple|divider|spinner).js"
  ],
  theme: {
  	extend: {
  		colors: {
            brand: {
                DEFAULT: "#a0312d",
                50: "#B53733",
                discord: {
                    DEFAULT: "#2b2d31",
                    "50": "#34363B",
                    "75": "#3B3E44",
                    "100": "#494D54"
                },
            },
            gold: {
                DEFAULT: "#FFC870",
                50: "#F9CC6C"
            }
        },
        fontFamily: {
            american: ["American Captain", "sans-serif"],
            discord: ["GG Black", "sans-serif"]
        },
        screens: {
            'mobile-only': { max: '640px' },   
            'tablet-only': { min: '641px', max: '1024px' }, 
            '3xl': '1920px', 
            '4xl': '2500px', 
        },
  	}
  },
  plugins: [require("tailwindcss-animate"), heroui()],
}