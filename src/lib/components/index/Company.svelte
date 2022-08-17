<script lang="ts">
	import type { ComponentType } from "svelte/types/runtime/internal/dev.js";
	import type { Image } from "../types";

	export let img: Image;
	export let icons: ComponentType[];
</script>

<div
	class="bg-gray-800 p-4 rounded-xl flex flex-col max-w-lg mx-auto even:text-right even:items-end lg:transition-transhadow lg:hover:-translate-y-2 lg:hover:drop-shadow-lg"
>
	<!-- svelte-ignore a11y-missing-attribute -->
	<!-- Svelte doesnt recognize alt attribute being provided in spread -->
	<img class="w-48" loading="lazy" {...img} />
	<p class="my-4">
		<slot />
	</p>
	<div class="flex gap-2 items-center">
		{#each icons as Icon}
			<Icon class="w-10 h-10" />
		{/each}
	</div>
</div>
