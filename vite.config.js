import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const page = (path) => fileURLToPath(new URL(path, import.meta.url))

// Duas páginas: a timeline em / e a versão curta (o portfolio em lista) em /cv/.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: { main: page('./index.html'), cv: page('./cv/index.html') },
    },
  },
})
