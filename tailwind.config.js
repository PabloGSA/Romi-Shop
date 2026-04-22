/** @type {import('tailwindcss').Config} */
module.exports = {
  // Le dice a Tailwind qué archivos debe escanear para generar los estilos
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Colores personalizados para la tienda
      colors: {
        "rose-gold": "#b76e79",
        "rose-gold-light": "#d4a5a5",
      },
    },
  },
  plugins: [],
};
