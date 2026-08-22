/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'button': '1rem',
        'card': '2rem',
        'modal': '2.5rem',
        'badge': '0.75rem',
        // For a row/chip sitting inside a `rounded-card` container with `p-2`
        // padding: concentric corners want inner ≈ outer − padding
        // (2rem − 0.5rem), not the same radius as the outer shape (see
        // /staff ТЗ №2 part 1). A tighter container (e.g. `rounded-button`
        // with `p-0.5`) wants its own smaller value by the same formula —
        // reach for an arbitrary `rounded-[…]` there rather than this token,
        // since the right number depends on that container's own padding.
        'nested': '1.5rem',
      },
      colors: {
        brand: {
          primary: "#161819",
          secondary: "#C89E58",
          wood: "#4A3320",
          dark: "#0F1112",
          light: "#E3DDD1",
          gold: {
            50: "#FDF9F1",
            100: "#F6EBD5",
            200: "#E6D0A7",
            300: "#D4B67F",
            400: "#C89E58",
            500: "#A67F3F",
          },
          green: {
            50: "#4D6B53",
            100: "#3A543F",
            200: "#2C4631",
            300: "#1E3322",
          },
          parchment: {
            50: "#F8F6F2",
            100: "#EFEBE1",
            200: "#E3DDD1",
            300: "#D1C8B6",
            400: "#BEB19A",
          }
        }
      }
    },
  },
  plugins: [],
}
