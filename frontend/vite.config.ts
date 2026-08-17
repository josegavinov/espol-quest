import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

// El juego se promete como PWA instalable desde el navegador del celular, sin
// pasar por una tienda de aplicaciones.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "ESPOL Quest",
        short_name: "ESPOL Quest",
        description:
          "Videojuego de plataformas 2D para explorar el campus Gustavo Galindo de ESPOL.",
        lang: "es",
        start_url: "/",
        display: "fullscreen",
        orientation: "landscape",
        background_color: "#003865",
        theme_color: "#003865",
        icons: [
          { src: "icono-192.png", sizes: "192x192", type: "image/png" },
          { src: "icono-512.png", sizes: "512x512", type: "image/png" },
          { src: "icono-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
})
