/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        postIt: "#FFF1C1",
        textfield: "#D9D9D9",
      },
      fontFamily: {
        handlee: ["Handlee", "cursive"],
      },
    },
  },
  plugins: [],
  
};
