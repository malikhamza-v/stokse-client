import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const appVersion = require('./release/app/package.json').version;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    root: 'src/web',
    build: {
      outDir: '../../dist/web',
    },
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
      'process.env.API_URL': JSON.stringify(
        env.API_URL || 'https://stokse-api.malikhamza.me',
      ),
    },
  };
});
