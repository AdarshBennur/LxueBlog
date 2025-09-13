import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Validate environment variables at build time
function validateEnvironment() {
  const isProduction = process.env.NODE_ENV === 'production';
  const apiUrl = process.env.PUBLIC_API_URL;
  
  console.log('🔧 Build Environment Check:', {
    NODE_ENV: process.env.NODE_ENV,
    PUBLIC_API_URL: apiUrl,
    isProduction
  });
  
  if (isProduction && (!apiUrl || apiUrl.includes('localhost'))) {
    console.error('❌ FATAL BUILD ERROR: Production build requires valid PUBLIC_API_URL');
    console.error('❌ Current PUBLIC_API_URL:', apiUrl);
    console.error('❌ Expected: https://lxueblog.onrender.com/api');
    throw new Error('Production builds must have PUBLIC_API_URL set to production API endpoint');
  }
  
  if (apiUrl && apiUrl.includes('localhost')) {
    console.warn('⚠️ WARNING: API URL contains localhost, ensure this is for development only');
  }
}

// Run validation
validateEnvironment();

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
    // Additional environment variable handling
    define: {
      // Ensure environment variables are properly replaced at build time
      __API_URL__: JSON.stringify(process.env.PUBLIC_API_URL),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
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
