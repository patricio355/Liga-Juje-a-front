import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        allowedHosts: 'all',
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            // CAMBIO: Usamos 'credentialless' para permitir imágenes externas
            "Cross-Origin-Embedder-Policy": "credentialless",
        },
    },
    optimizeDeps: {
        exclude: ['@imgly/background-removal']
    }
})