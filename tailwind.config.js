/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ["./src/App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#285FE7",
        secondary: "#FF5733",
        success: "#28A745",
        danger: "#DC3545",
        warning: "#FFC107",
        info: "#17A2B8",
        light: "#F8F9FA",
        dark: "#343A40",
        custom: {
          heading: '#142650',
          rememberme: '#244D77',
          hyperlink: "#285FE7",
          black:"#000000",
          companytxt:"#556281",
          footerselected:"#292D32",
          lightgreen:"#E7F8F3",
          green:"#0DB984",
          red:"#FF4E4E",
          lightblue: "#EEF3FF",
          blackLight:"#101010",
          btnLightBlue:"#DDE4F0"

          
        },
        gray: {
          100: "#F8F9FA",
          200: "#E9ECEF",
          300: "#CED4DA",
          400: "#6C757D",
          500: "#495057",
          600: "#343A40",
          700: "#212529",
        },
      },
    },
  },
  plugins: [],
};

