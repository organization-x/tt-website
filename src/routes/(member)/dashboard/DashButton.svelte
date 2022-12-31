<script lang="ts">
	import { getContext } from "svelte";

	import { debounce } from "$lib/debounce";

	import type { Writable } from "svelte/store";

	let className: string;
	export let icon = false;
	export let disabled = false;
	let props:
		| {
				func: () => void;
				delay: number;
				bind: any;
		  }
		| undefined = undefined;

	export { className as class, props as debounce };

	const tabindex = getContext<Writable<number>>("tabindex");
</script>

<button
	on:click
	use:debounce={props}
	{disabled}
	class:w-24={!icon}
	class:py-5={!icon}
	class:lg:px-5={!icon}
	class:py-4={icon}
	class:lg:px-3.5={icon}
	class:lg:py-3.5={icon}
	class="rounded-lg relative px-4 text-center shrink-0 leading-none transition-backpacity transition-op duration-200 disabled:opacity-60 disabled:pointer-events-none {className}"
	tabindex={$tabindex}
>
	<slot />
</button>
