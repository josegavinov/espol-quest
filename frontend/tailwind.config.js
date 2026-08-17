/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta institucional de ESPOL.
        espol: {
          azul: "#00539B",
          azulOscuro: "#003865",
          celeste: "#4FA3D9",
          arena: "#F5F1E8",
        },
      },
    },
  },
  plugins: [],
}
