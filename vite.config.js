import { wss } from "./src/wss";
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit(), wss(mode)],
	logLevel: mode === "production" ? "silent" : "info"
}));
