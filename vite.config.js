import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
    test: {
    globals: true, // Memungkinkan penggunaan describe, it, expect tanpa import eksplisit (opsional tapi umum)
    environment: 'jsdom', // Gunakan JSDOM untuk simulasi DOM
    setupFiles: './src/setupTests.js', // Path ke file setup
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'], // Pastikan 'html' ada di sini
    },
    dir: './src', // Opsional: Tentukan direktori root untuk test jika tidak di root proyek
  },
})
