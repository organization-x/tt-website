// import { wss } from "./src/wss";
import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import("vite").UserConfig} */
const config = {
	plugins: [sveltekit()]
};

export default config;
