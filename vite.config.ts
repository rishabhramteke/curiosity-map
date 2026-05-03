import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Site lives at https://rishabhramteke.github.io/curiosity-map/
export default defineConfig({
  plugins: [react()],
  base: '/curiosity-map/',
});
