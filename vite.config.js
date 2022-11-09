import { wss } from "./src/wss";
import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import("vite").UserConfig} */
export default {
	plugins: [sveltekit(), wss]
};
