<script lang="ts">
	import { getContext } from "svelte";

	import type { Writable } from "svelte/store";

	let className: string;
	export let open: boolean;
	export let active: boolean;

	export { className as class };

	const tabindex = getContext<Writable<number>>("tabindex");

	let element: HTMLDivElement;
</script>

<div
	bind:this={element}
	class:border-gray-500={active}
	class:border-transparent={!active}
	class="flex items-center rounded-lg bg-gray-900 border-2 shrink-0"
>
	<button
		on:click
		class="flex gap-4 shrink-0 w-11 p-3 items-center justify-center"
		tabindex={$tabindex}
	>
		<slot name="button" />
	</button>

	<div
		class:px-2={open}
		on:transitionend={() => {
			if (open)
				element.scrollIntoView({
					block: "nearest",
					behavior: "smooth"
				});
		}}
		class="flex gap-3 justify-center transition-transform overflow-hidden h-full {open
			? className
			: 'w-0'}"
		aria-expanded={open}
	>
		<slot name="expanded" />
	</div>
</div>
