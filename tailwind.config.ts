// import type { Config } from "tailwindcss";

// export default {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: "var(--background)",
//         foreground: "var(--foreground)",
//       },
//     },
//   },
//   plugins: [],
// } satisfies Config;



import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}" // this is for loading content
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'Edu_NSW_ACT_Foundation': ['"Edu NSW ACT Foundation"', 'sans-serif'],
      },
      //loading pogress
      // animation: {
      //   flip: "flip 1s ease-in-out infinite",
      //   progress: "progress 3s linear infinite",
      // },
      // keyframes: {
      //   flip: {
      //     "0%, 100%": { transform: "rotateY(0deg)" },
      //     "50%": { transform: "rotateY(180deg)" },
      //   },
      //   progress: {
      //     "0%": { width: "0%" },
      //     "100%": { width: "100%" },
      //   },
      // }, // loading
      animation: {
        loading: 'loading 2s linear infinite',
      },
      keyframes: {
        loading: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      }, // loading

    },
  },
  plugins: [],
};

export default config;
