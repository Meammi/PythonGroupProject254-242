/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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

        // Explicit mapping for tu-red as requested
        "tu-red": "var(--color-tu-red)",

        // กลุ่มสี Disco สำหรับแบรนด์ TULóng (ใช้ var ทั้งหมด)
        disco: {
          red: "var(--color-tu-red)",
          yellow: "var(--color-disco-yellow)",
          orange: "var(--color-disco-orange)",
          purple: "var(--color-disco-purple)",
          blue: "var(--color-disco-blue)",
          green: "var(--color-disco-green)",
        },
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