import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        base: './',
        build: {
            assetsDir: 'assets',
        },
        server: {
            host: '0.0.0.0',
            port: 5173,
        },
        define: {
            'process.env': env,
        },
    };
});
