<script lang="ts">
	import type { ComponentType } from "svelte/types/runtime/internal/dev.js";

	let className: string;
	export let img: string;
	export let title: string;
	export let icons: ComponentType[];

	export { className as class };
</script>

<div
	class="rounded-lg border-t-4 border-solid max-w-xl mx-auto overflow-hidden bg-gray-500/40 {className}"
>
	<div
		class="h-20 sm:h-44 bg-center bg-no-repeat bg-cover"
		style="background-image: url({img});"
	/>
	<div class="py-4 px-3">
		<h1 class="font-semibold text-2xl">{title}</h1>
		<p class="mt-2">
			<slot />
		</p>
		<div class="flex gap-2 mt-4">
			{#each icons as Icon}
				<Icon class="w-8 h-8" />
			{/each}
		</div>
	</div>
</div>
