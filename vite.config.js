import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/bo4-sr-helper/",
	build: {
		outDir: "dist",
		assetsDir: "assets",
	},
	server: {
		port: 5173,
		open: true,
	},
});
