/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
       colors: {
        primary: "rgb(11, 12, 94)",
        accent: "rgb(252, 255, 0)",
        background: "rgb(242, 245, 251)",
      },
    },
  },
  plugins: [],
}