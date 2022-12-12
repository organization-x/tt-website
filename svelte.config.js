import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-node";

/** @type {import("@sveltejs/kit").Config} */
export default {
	preprocess: preprocess({
		postcss: true,
		preserve: ["ld+json"]
	}),

	kit: {
		adapter: adapter({
			precompress: true
		})
	}
};
