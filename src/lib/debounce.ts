import type { Action } from "svelte/action";

// Delay inputs so the database doesn't get spammed with queries
export const debounce: Action<
	HTMLElement,
	{ func: () => void; delay: number; bind: any }
> = (node, params) => {
	let timer: NodeJS.Timeout;

	if (!params) return;

	return {
		update() {
			clearTimeout(timer);

			timer = setTimeout(params.func, params.delay);
		},

		destroy() {
			clearTimeout(timer);
		}
	};
};
