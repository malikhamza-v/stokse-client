import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const appVersion = require('./release/app/package.json').version;

export default defineConfig({
  plugins: [react()],
  root: 'src/web',
  build: {
    outDir: '../../dist/web',
  },
  define: {
    __APP_VERSION__: appVersion,
  },
});
