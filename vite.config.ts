import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { injectManifest } from 'workbox-build';

const currentWorkingDirectory = process.cwd();

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['/sw.js'],
      output: {
        manualChunks(id) {
          if (id.includes('sw.js')) {
            return 'sw';
          }
        }
      }
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('deep-chat')
        }
      }
    }),
    {
      name: 'vite-plugin-workbox',
      apply: 'build',
      closeBundle: async () => {
        await injectManifest({
          swSrc: './public/sw.js',
          swDest: 'dist/sw.js',
          globDirectory: 'dist',
          globPatterns: ['**/*.{js,css,html,png,svg,woff,woff2,ttf,eot,manifest}'],
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': `${currentWorkingDirectory}/src`,
      routes: `${currentWorkingDirectory}/src/routes`,
      services: `${currentWorkingDirectory}/src/services`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/_colors.scss";`
      }
    }
  },
});