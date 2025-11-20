/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FFFDFB",
        black: "#111827",
        secondary: "#6B7280",
        logoStart: "#7C3AED", // mor
        logoEnd: "#FB7185", // pembemsi
        buttonStart: "#4F46E5",
        buttonEnd: "#7C3AED",
        inputBorder: "#D1D5DB",
        inputPlaceholder: "#9CA3AF",
        link: "#4F46E5",
        iconColor: "#5B4FE2",
      },
      fontFamily: {
        sblack: ["Inter-Black", "sans-serif"],
        sbold: ["Inter-Bold", "sans-serif"],
        slight: ["Inter-Light", "sans-serif"],
        sregular: ["Inter-Regular", "sans-serif"],
      },
      spacing: {
        20: "5rem",
        22: "5.5rem",
        24: "6rem",
        28: "7rem",
        32: "8rem",
        36: "9rem",
      },
    },
  },
  plugins: [],
};
