import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-node";

/** @type {import("@sveltejs/kit").Config} */
export default {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		postcss: true
	}),

	kit: {
		adapter: adapter({
			precompress: true
		})
	}
};
