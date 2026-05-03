import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.BASE_PATH ?? '/curiosity-map/';

export default defineConfig({
  plugins: [react()],
  base,
});
