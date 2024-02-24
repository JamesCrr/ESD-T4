import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],

  preview: {
    port: 5173,
    strictPort: true,
  },
  server: {
    port: 5173,
    strictPort: true, // Set to true to exit if the port is already in use, instead of automatically trying the next available port.
    host: true,
    // origin: "http://0.0.0.0:5173",

    hmr: {
      clientPort: 5173,
    },
    watch: {
      usePolling: true,
    },
  },
});
