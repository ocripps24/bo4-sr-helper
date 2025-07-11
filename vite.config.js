import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/",
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern-compiler", // Use the modern Sass API
			},
		},
	},
	build: {
		outDir: "dist",
		assetsDir: "assets",
		// Ensure proper cache busting
		rollupOptions: {
			output: {
				// Add hash to all assets for cache busting
				entryFileNames: "assets/[name]-[hash].js",
				chunkFileNames: "assets/[name]-[hash].js",
				assetFileNames: "assets/[name]-[hash].[ext]",
			},
		},
	},
	server: {
		port: 5173,
		open: true,
	},
});
