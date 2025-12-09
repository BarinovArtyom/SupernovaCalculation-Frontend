import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

import mkcert from 'vite-plugin-mkcert'
import fs from 'fs';
import path from 'path';

export default defineConfig({
  base: "/SupernovaEnergyCalculation-Frontend",
  server: {
    port: 3000,
    host: 'localhost',
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    https:{
    key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
  },
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Supernova Energy Calculation",
        short_name: "Supra",
        start_url: "/SupernovaEnergyCalculation-Frontend/",
        display: "standalone",
        background_color: "#fdfdfd",
        theme_color: "#1A408A",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/SupernovaEnergyCalculation-Frontend/logo192.png",
            type: "image/png", 
            sizes: "192x192"
          },
          {
            src: "/SupernovaEnergyCalculation-Frontend/logo512.png",
            type: "image/png", 
            sizes: "512x512"
          }
        ],
      }
    })
  ]
})