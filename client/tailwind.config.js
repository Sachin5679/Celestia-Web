/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        mobile: { max: "780px" },
        widescreen: { min: "780px" },
      },
      colors: {
        primary: "#",
        secondary: "",
        background: "#000000",
        foreground: "",
        front: "#ffffff",
        back: "#000000",
      },
      borderRadius: {
        inherit: "inherit",
      },
      transitionDuration: {
        inherit: "inherit",
      },
      fontFamily: {
        poppins: '"Poppins", sans-serif',
        raleway: '"Raleway", sans-serif',
        celestialDecorative: '"CelestialDecorative", sans-serif',
        celestial: '"Celestial", sans-serif',
      },
      zIndex: {
        1: 1,
      },
      strokeWidth: {
        0: "0px",
        5: "5px",
        10: "10px",
        15: "15px",
        20: "20px",
      },
      backgroundSize: {
        2: "200% 200%",
        5: "500% 500%",
      },
      content: {
        visible: '" "',
      },
    },
  },
  plugins: [],
};
