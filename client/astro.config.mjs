import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  
  // Vercel deployment configuration
  output: 'static',
  
  // Build configuration
  build: {
    inlineStylesheets: 'auto',
  },
  
  // Vite configuration for better production builds
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks for better caching
            vendor: ['axios', 'jwt-decode']
          }
        }
      }
    }
  },
  
  // Server configuration for development
  server: {
    port: 4321,
    host: true // Allow external connections
  }
});
