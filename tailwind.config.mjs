/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        scroll: 'scroll 30s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-150%)' },
        },
        phonescroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        // xxs:'320px',
        // xs: '405px',  // Extra small screens, e.g., small phones
        // sm: '640px',  // Small devices like phones
        // md: '768px',  // Medium devices like tablets
        // lg: '1024px', // Large devices like laptops
        // xl: '1280px', // Extra large devices like desktops
        // desktopxl: '1536px', // Extra extra large screens
        // desktop2xl:'1920px',
        // desktop3xl:'2560px'/
       
          phone: {'min':'320px','max':'767px'},
          tablet: { 'min': '768px', 'max': '1024px' }, // Tablets and small laptops
          laptop: {'min':'1025px','max':'1367px'},
          // desktop: {'min':'1281px','max':'1366px'},
          desktopxl: {'min':'1368px','max':'2560px'},
          // desktop2xl: {'min':'1921px','max':'2560px'},
          desktop3xl: {'min':'2561px','max':'3840px'},
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
  variants: {
    scrollbar: ['rounded'], // Enable rounded scrollbars
  },
};


