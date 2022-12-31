import { wss } from "./src/wss";
import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit(), wss(mode)],
	logLevel: mode === "production" ? "silent" : "info",
	css: {
		postcss: {
			plugins: [tailwindcss(), autoprefixer()]
		}
	}
}));
