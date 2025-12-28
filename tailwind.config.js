const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("eye-care", ".eye-care &");
    }),
  ],
};

