import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    open: !isCodeSandbox,
  },
  css: { devSourcemap: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap', '@gsap/react'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})