/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'text-tu-red',
    'text-tu-gold',
    'text-black',
    'text-tu-orange',
    'bg-tu-orange'
  ],
  theme: {
    extend: {
      colors: {
        // กลุ่มสีหลักของระบบ
        primary: "var(--color-tu-red)",
        secondary: "var(--color-tu-gold)",
        tertiary: "var(--color-tu-teal)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
        },

        // Explicit mapping for branding
        "tu-red": "var(--color-tu-red)",
        "tu-gold": "var(--color-tu-gold)",
        "tu-orange": "var(--color-tu-orange)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}