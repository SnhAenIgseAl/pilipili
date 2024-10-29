import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'



export default defineConfig({
	plugins: [vue()],
	resolve:{
        alias:{
            '@': path.resolve(__dirname, './src'),
            "../": path.resolve(__dirname, './src')
        },
    },
    server: {
        host: '127.0.0.1',
        // proxy: {
        //     '/api': {
        //         target: 'https://pilipili-server.icu',
        //         // target: 'http://127.0.0.1:18848',
        //         changeOrigin: true,
        //         rewrite: (path) => path.replace(/^\/api/, '')
        //     },
        // }
    },
    base: '/',
    build: {
        outDir: 'dist',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    }
})
