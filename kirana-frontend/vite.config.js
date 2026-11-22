import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The backend CORS config only allows ports 5173 and 3000.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
});
