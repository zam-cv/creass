/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        postIt: "#FFF1C1",
        newPostIt: "#B0A88E",
        textfield: "#D9D9D9",
        darkMode: "#121212",
      },
      fontFamily: {
        handlee: ["Handlee", "cursive"],
      },
    },
  },
  plugins: [],
  
};
