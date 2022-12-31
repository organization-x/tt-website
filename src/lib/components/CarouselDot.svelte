<script lang="ts">
	import { getContext } from "svelte";

	import type { Writable } from "svelte/store";

	export let active: boolean;

	const tabindex = getContext<Writable<number>>("tabindex");
</script>

<button
	on:click
	class:text-white={active}
	class:text-gray-500={!active}
	class="cursor-pointer p-0.5"
	aria-current={active}
	tabindex={$tabindex}
>
	<svg
		class="w-2 h-2 transition-colors"
		fill="currentColor"
		viewBox="0 0 24 24"
	>
		<circle cx="12" cy="12" r="12" />
	</svg>
</button>
