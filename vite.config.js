import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

import { wss } from "./src/wss";

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit(), wss(mode)]
}));
