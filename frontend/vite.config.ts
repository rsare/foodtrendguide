import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        host: true, // Yerel ağda görünmesini sağlar
        port: 3000,
    },
    preview: {
        host: true, // Dış dünyadan (AWS IP'sinden) erişime izin verir
        port: 3000,
        allowedHosts: ['all'] // Güvenlik duvarını gevşetir, AWS IP'sine izin verir
    }
});